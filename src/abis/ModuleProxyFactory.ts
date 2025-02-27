// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default [
  { inputs: [], name: 'FailedInitialization', type: 'error' },
  { inputs: [{ internalType: 'address', name: 'address_', type: 'address' }], name: 'TakenAddress', type: 'error' },
  { inputs: [{ internalType: 'address', name: 'target', type: 'address' }], name: 'TargetHasNoCode', type: 'error' },
  { inputs: [{ internalType: 'address', name: 'target', type: 'address' }], name: 'ZeroAddress', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'proxy', type: 'address' },
      { indexed: true, internalType: 'address', name: 'masterCopy', type: 'address' }
    ],
    name: 'ModuleProxyCreation',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'address', name: 'masterCopy', type: 'address' },
      { internalType: 'bytes', name: 'initializer', type: 'bytes' },
      { internalType: 'uint256', name: 'saltNonce', type: 'uint256' }
    ],
    name: 'deployModule',
    outputs: [{ internalType: 'address', name: 'proxy', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
