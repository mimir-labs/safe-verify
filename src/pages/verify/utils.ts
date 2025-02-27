// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SafeTransaction } from '@mimir-wallet/safe/types';

import { type Address, type Chain, getAddress, type Hex, isAddressEqual, zeroAddress } from 'viem';

import { getSafeVersion, hashSafeTransaction, recoverSigner } from '@mimir-wallet/safe';
import { getPublicClient, getSafeGateway } from '@mimir-wallet/utils';

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

export async function verifySafeTransaction(safeTransactionLink: string) {
  const link = new URL(safeTransactionLink);
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

  //   {
  //     "safeAddress": "0x9B268cCe1138D8f3db27881D294704aE2353B833",
  //     "txId": "multisig_0x9B268cCe1138D8f3db27881D294704aE2353B833_0x71bbd1697aa1ff2e50cb9afb4f1b4abe59b8849f32bc58be1b3dbcbdb2330f1d",
  //     "executedAt": null,
  //     "txStatus": "AWAITING_CONFIRMATIONS",
  //     "txInfo": {
  //         "type": "Transfer",
  //         "humanDescription": null,
  //         "sender": {
  //             "value": "0x9B268cCe1138D8f3db27881D294704aE2353B833",
  //             "name": null,
  //             "logoUri": null
  //         },
  //         "recipient": {
  //             "value": "0x8CF60B289f8d31F737049B590b5E4285Ff0Bd1D1",
  //             "name": "GnosisSafeProxy",
  //             "logoUri": null
  //         },
  //         "direction": "OUTGOING",
  //         "transferInfo": {
  //             "type": "NATIVE_COIN",
  //             "value": "1000000000000000"
  //         }
  //     },
  //     "txData": {
  //         "hexData": null,
  //         "dataDecoded": null,
  //         "to": {
  //             "value": "0x8CF60B289f8d31F737049B590b5E4285Ff0Bd1D1",
  //             "name": "GnosisSafeProxy",
  //             "logoUri": null
  //         },
  //         "value": "1000000000000000",
  //         "operation": 0,
  //         "trustedDelegateCallTarget": null,
  //         "addressInfoIndex": null
  //     },
  //     "txHash": null,
  //     "detailedExecutionInfo": {
  //         "type": "MULTISIG",
  //         "submittedAt": 1740639328380,
  //         "nonce": 1,
  //         "safeTxGas": "0",
  //         "baseGas": "0",
  //         "gasPrice": "0",
  //         "gasToken": "0x0000000000000000000000000000000000000000",
  //         "refundReceiver": {
  //             "value": "0x0000000000000000000000000000000000000000",
  //             "name": null,
  //             "logoUri": null
  //         },
  //         "safeTxHash": "0x71bbd1697aa1ff2e50cb9afb4f1b4abe59b8849f32bc58be1b3dbcbdb2330f1d",
  //         "executor": null,
  //         "signers": [
  //             {
  //                 "value": "0x466a8c62eA9Eb6f49c718A0244B095AB05519DEa",
  //                 "name": null,
  //                 "logoUri": null
  //             },
  //             {
  //                 "value": "0xfF542BbB954E836f2fA1F2f53D5444aF36a701Ee",
  //                 "name": null,
  //                 "logoUri": null
  //             },
  //             {
  //                 "value": "0x7aE77149ed38c5dD313e9069d790Ce7085caf0A6",
  //                 "name": null,
  //                 "logoUri": null
  //             }
  //         ],
  //         "confirmationsRequired": 2,
  //         "confirmations": [
  //             {
  //                 "signer": {
  //                     "value": "0x466a8c62eA9Eb6f49c718A0244B095AB05519DEa",
  //                     "name": null,
  //                     "logoUri": null
  //                 },
  //                 "signature": "0x47a7676d459e942e79f2cb91d24c39d0ba14177ce197c796fd53cdd65e4ec7f2014cd0a720ef22de8ef68bc704bed54317371c7395bf73dab337f4438509d12e1b",
  //                 "submittedAt": 1740639328433
  //             }
  //         ],
  //         "rejectors": [],
  //         "gasTokenInfo": null,
  //         "trusted": true,
  //         "proposer": {
  //             "value": "0x466a8c62eA9Eb6f49c718A0244B095AB05519DEa",
  //             "name": null,
  //             "logoUri": null
  //         },
  //         "proposedByDelegate": null
  //     },
  //     "safeAppInfo": null,
  //     "note": null
  // }

  const client = getPublicClient(chain.chainId);

  const safeAddress = getAddress(data.safeAddress);
  const SafeTransaction: SafeTransaction = {
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

  const version = await getSafeVersion(client, safeAddress);
  const safeTxHash = hashSafeTransaction(chain.chainId, safeAddress, SafeTransaction, version);

  const status: VerifyResult = {
    chain: client.chain,
    safeTx: SafeTransaction,
    safeAddress,
    version,
    hash: {
      value: safeTxHash,
      verified: data.detailedExecutionInfo.safeTxHash === safeTxHash
    },
    signatures: []
  };

  for (const confirmation of data.detailedExecutionInfo.confirmations) {
    const signer = await recoverSigner(client, SafeTransaction, safeAddress, version, confirmation.signature);

    status.signatures.push({
      signer,
      signature: confirmation.signature,
      verified: isAddressEqual(signer, confirmation.signer.value)
    });
  }

  return status;
}
