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
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      },
      {
        internalType: 'enum Enum.Operation',
        name: 'operation',
        type: 'uint8'
      }
    ],
    name: 'simulate',
    outputs: [
      {
        internalType: 'uint256',
        name: 'estimate',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'success',
        type: 'bool'
      },
      {
        internalType: 'bytes',
        name: 'returnData',
        type: 'bytes'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
