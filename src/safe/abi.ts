// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { parseAbi } from 'viem';

export const SafeAbi = parseAbi([
  'function VERSION() view returns (string)',
  'function getThreshold() view returns (uint256)',
  'function getOwners() view returns (address[])',
  'function getModules() view returns (address[])',
  'function getGuard() view returns (address)'
]);
