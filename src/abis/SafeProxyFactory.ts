// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract SafeProxy',
        name: 'proxy',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'singleton',
        type: 'address'
      }
    ],
    name: 'ProxyCreation',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_singleton',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'initializer',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: 'saltNonce',
        type: 'uint256'
      }
    ],
    name: 'createChainSpecificProxyWithNonce',
    outputs: [
      {
        internalType: 'contract SafeProxy',
        name: 'proxy',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_singleton',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'initializer',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: 'saltNonce',
        type: 'uint256'
      },
      {
        internalType: 'contract IProxyCreationCallback',
        name: 'callback',
        type: 'address'
      }
    ],
    name: 'createProxyWithCallback',
    outputs: [
      {
        internalType: 'contract SafeProxy',
        name: 'proxy',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_singleton',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'initializer',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: 'saltNonce',
        type: 'uint256'
      }
    ],
    name: 'createProxyWithNonce',
    outputs: [
      {
        internalType: 'contract SafeProxy',
        name: 'proxy',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getChainId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proxyCreationCode',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  }
] as const;
