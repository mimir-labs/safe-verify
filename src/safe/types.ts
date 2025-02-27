// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address, Hex } from 'viem';

export enum Operation {
  Call,
  DelegateCall
}

export interface MetaTransaction {
  to: Address;
  value: bigint;
  data: Hex;
  operation: Operation;
}

export interface SafeTransaction extends MetaTransaction {
  safeTxGas: bigint;
  baseGas: bigint;
  gasPrice: bigint;
  gasToken: Address;
  refundReceiver: Address;
  nonce: bigint;
}
