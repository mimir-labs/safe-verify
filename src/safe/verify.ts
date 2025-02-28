// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain } from 'viem/chains';
import type { SafeTransaction } from './types';

import {
  type Address,
  encodePacked,
  type Hex,
  keccak256,
  type PublicClient,
  recoverAddress,
  sliceHex,
  type Transport
} from 'viem';

import { hashSafeTransaction } from './helper';

export async function recoverSigner(
  client: PublicClient<Transport, Chain>,
  message: SafeTransaction,
  safeAddress: Address,
  version: string,
  signature: Hex
) {
  if (!['1.1.0', '1.1.1', '1.2.0', '1.3.0', '1.4.0', '1.4.1'].includes(version)) {
    throw new Error('Unsupported Safe version');
  }

  const hash = hashSafeTransaction(client.chain.id, safeAddress, message, version);
  const v = Number(sliceHex(signature, 64, 65));

  if (v == 0) {
    throw new Error('Unsupported contract signature');
  } else if (v == 1) {
    throw new Error('Unsupported approveHash signature');
  } else if (v > 30) {
    return recoverAddress({
      hash: keccak256(encodePacked(['string', 'bytes32'], ['\x19Ethereum Signed Message:\n32', hash])),
      signature: {
        r: sliceHex(signature, 0, 32),
        s: sliceHex(signature, 32, 64),
        v: BigInt(v - 4)
      }
    });
  }

  return recoverAddress({
    hash: hash,
    signature: {
      r: sliceHex(signature, 0, 32),
      s: sliceHex(signature, 32, 64),
      v: BigInt(v)
    }
  });
}
