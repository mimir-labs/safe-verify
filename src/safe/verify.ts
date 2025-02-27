// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain } from 'wagmi/chains';
import type { SafeTransaction } from './types';

import { type Address, type Hex, type PublicClient, recoverTypedDataAddress, type Transport } from 'viem';

import { TypedDataTypes } from './config';

export async function recoverSigner(
  client: PublicClient<Transport, Chain>,
  message: SafeTransaction,
  safeAddress: Address,
  version: string,
  signature: Hex
) {
  if (!['1.1.0', '1.2.0', '1.3.0', '1.4.0', '1.4.1'].includes(version)) {
    throw new Error('Unsupported Safe version');
  }

  return recoverTypedDataAddress({
    types: TypedDataTypes.safeTx,
    primaryType: 'SafeTx',
    domain: ['1.1.0', '1.2.0'].includes(version)
      ? {
          verifyingContract: safeAddress
        }
      : {
          chainId: client.chain.id,
          verifyingContract: safeAddress
        },
    message,
    signature
  });
}
