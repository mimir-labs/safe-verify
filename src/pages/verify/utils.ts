// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SafeTransaction } from '@mimir-wallet/safe/types';

import {
  type Address,
  type Chain,
  decodeFunctionData,
  getAddress,
  type Hex,
  isAddressEqual,
  isHex,
  parseAbi,
  size,
  sliceHex,
  zeroAddress
} from 'viem';

import { getSafeVersion, hashSafeTransaction, recoverSigner } from '@mimir-wallet/safe';
import { getExplorerChain, getPublicClient, getSafeGateway } from '@mimir-wallet/utils';

export type VerifyResult = {
  chain: Chain;
  safeTx: SafeTransaction;
  safeAddress: Address;
  version: string;
  hash: {
    value: Hex;
    verified: boolean;
  };
  signatures: {
    signer: Address;
    signature: Hex;
    verified: boolean;
  }[];
};

export async function getChains(): Promise<
  {
    name: string;
    chainId: number;
    shortName: string;
    networkId: number;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpc: string[];
    infoURL: string;
  }[]
> {
  return fetch('https://chainid.network/chains_mini.json').then((res) => res.json());
}

async function parseFromSafeLink(
  value: string
): Promise<
  | [
      safeTxHash: Hex,
      SafeTransaction,
      signatures: { signer: Address; signature: Hex }[],
      chainId: number,
      safeAddress: Address,
      version: string
    ]
  | null
> {
  try {
    const link = new URL(value);
    const transactionId = link.searchParams.get('id');
    const safe = link.searchParams.get('safe');

    if (!safe || !transactionId) {
      throw new Error('Invalid Safe transaction link format');
    }

    const [shortName] = safe.split(':');

    const chains = await getChains();

    const chain = chains.find((chain) => chain.shortName === shortName);

    if (!chain) {
      throw new Error('Invalid chain');
    }

    const gateway = getSafeGateway(chain.chainId);

    const url = new URL(gateway);

    url.pathname = `/v1/chains/${chain.chainId}/transactions/${transactionId}`;

    const data = await fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch Safe transaction');
      }

      return res.json();
    });

    const safeAddress = getAddress(data.safeAddress);
    const safeTransaction: SafeTransaction = {
      to: data.txData.to.value || zeroAddress,
      value: BigInt(data.txData.value || '0'),
      data: data.txData.hexData || '0x',
      operation: data.txData.operation,
      safeTxGas: BigInt(data.detailedExecutionInfo.safeTxGas || '0'),
      baseGas: BigInt(data.detailedExecutionInfo.baseGas || '0'),
      gasPrice: BigInt(data.detailedExecutionInfo.gasPrice || '0'),
      gasToken: data.detailedExecutionInfo.gasToken || zeroAddress,
      refundReceiver: data.detailedExecutionInfo.refundReceiver.value || zeroAddress,
      nonce: BigInt(data.detailedExecutionInfo.nonce || '0')
    };

    const client = getPublicClient(chain.chainId);

    return [
      data.detailedExecutionInfo.safeTxHash,
      safeTransaction,
      data.detailedExecutionInfo.confirmations.map((item: any) => ({
        signer: getAddress(item.signer.value),
        signature: item.signature
      })),
      chain.chainId,
      safeAddress,
      await getSafeVersion(client, safeAddress)
    ];
  } catch (error) {
    console.error(error);

    return null;
  }
}

async function parseFromExplorer(
  value: string
): Promise<
  | [
      safeTxHash: Hex | null,
      SafeTransaction,
      signatures: { signer?: Address; signature: Hex }[],
      chainId: number,
      safeAddress: Address,
      version: string
    ]
  | null
> {
  try {
    const url = new URL(value);
    const hash = url.pathname
      .split('/')
      .map((item) => item.trim())
      .filter(Boolean)
      .pop();

    if (!hash || !isHex(hash) || hash.length !== 66) {
      throw new Error('Invalid Safe transaction link format');
    }

    const chain = getExplorerChain(value);

    const client = getPublicClient(chain.id);

    const transaction = await client.getTransaction({ hash });

    if (!transaction.to) {
      throw new Error('Invalid Transaction to address');
    }

    const result = decodeFunctionData({
      abi: parseAbi([
        'function execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)'
      ]),
      data: transaction.input
    });

    const nonce = await client.readContract({
      abi: parseAbi(['function nonce() view returns (uint256)']),
      functionName: 'nonce',
      address: getAddress(transaction.to),
      blockNumber: transaction.blockNumber - 1n
    });

    const version = await getSafeVersion(client, getAddress(transaction.to), transaction.blockNumber - 1n);

    if (result.functionName === 'execTransaction') {
      const signatureBytes = result.args[9];
      const signatures: { signer?: Address; signature: Hex }[] = [];

      for (let i = 0; i < size(signatureBytes); i += 65) {
        signatures.push({
          signature: sliceHex(signatureBytes, i, i + 65)
        });
      }

      return [
        null,
        {
          to: result.args[0],
          value: result.args[1],
          data: result.args[2],
          operation: result.args[3],
          safeTxGas: result.args[4],
          baseGas: result.args[5],
          gasPrice: result.args[6],
          gasToken: result.args[7],
          refundReceiver: result.args[8],
          nonce
        },
        signatures,
        client.chain.id,
        getAddress(transaction.to),
        version
      ];
    } else {
      throw new Error('Invalid Safe transaction');
    }
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function verifySafeTransaction(link: string) {
  const result = (await parseFromSafeLink(link)) || (await parseFromExplorer(link));

  if (!result) {
    throw new Error('Can not parse Safe transaction');
  }

  const [_safeTxHash, safeTransaction, signatures, chainId, safeAddress, version] = result;

  const client = getPublicClient(chainId);

  const safeTxHash = hashSafeTransaction(chainId, safeAddress, safeTransaction, version);

  const status: VerifyResult = {
    chain: client.chain,
    safeTx: safeTransaction,
    safeAddress,
    version,
    hash: {
      value: safeTxHash,
      verified: _safeTxHash ? _safeTxHash === safeTxHash : true
    },
    signatures: []
  };

  for (const item of signatures) {
    const signer = await recoverSigner(client, safeTransaction, safeAddress, version, item.signature);

    status.signatures.push({
      signer,
      signature: item.signature,
      verified: item.signer ? isAddressEqual(signer, item.signer) : true
    });
  }

  return status;
}
