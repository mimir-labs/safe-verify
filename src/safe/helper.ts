// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address, Hex, PublicClient } from 'viem';
import type { MetaTransaction, Operation, SafeTransaction } from './types';

import { bytesToBigInt, bytesToNumber, getAddress, hashTypedData, hexToBytes, toHex } from 'viem';

import { SafeAbi } from './abi';
import { TypedDataTypes } from './config';

export async function getSafeVersion(client: PublicClient, address: string, blockNumber?: bigint) {
  return await client.readContract({
    address: getAddress(address),
    abi: SafeAbi,
    functionName: 'VERSION',
    args: [],
    blockNumber
  });
}

export function hashSafeTransaction(chainId: number, safeAddress: Address, tx: SafeTransaction, version: string): Hex {
  return hashTypedData({
    domain: ['1.1.0', '1.1.1', '1.2.0'].includes(version)
      ? {
          verifyingContract: safeAddress
        }
      : {
          chainId,
          verifyingContract: safeAddress
        },
    types: TypedDataTypes.safeTx,
    primaryType: 'SafeTx',
    message: tx
  });
}

export function decodeMultisend(data: Hex): MetaTransaction[] {
  const bytes = hexToBytes(data);

  const results: MetaTransaction[] = [];

  for (let i = 0; i < bytes.length; ) {
    const operation: Operation = bytesToNumber(bytes.slice(i, (i += 1)));

    const to: Address = getAddress(toHex(bytes.slice(i, (i += 20))));

    const value: bigint = bytesToBigInt(bytes.slice(i, (i += 32)));

    const length: number = Number(bytesToBigInt(bytes.slice(i, (i += 32))));

    const data: Hex = toHex(bytes.slice(i, (i += length)));

    results.push({ operation, to, value, data });
  }

  return results;
}
