// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'transactions',
        type: 'bytes'
      }
    ],
    name: 'multiSend',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
] as const;
