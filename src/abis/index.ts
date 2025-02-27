// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { erc20Abi } from 'viem';

import Allowance from './Allowance';
import CompatibilityFallbackHandler from './CompatibilityFallbackHandler';
import Delay from './Delay';
import ERC1155 from './ERC1155';
import ModuleProxyFactory from './ModuleProxyFactory';
import MultiSend from './MultiSend';
import MultiSendCallOnly from './MultiSendCallOnly';
import SafeL2 from './SafeL2';
import SafeProxyFactory from './SafeProxyFactory';
import SimulateTxAccessor from './SimulateTxAccessor';

export const abis = {
  CompatibilityFallbackHandler,
  MultiSend,
  MultiSendCallOnly,
  SafeL2,
  SafeProxyFactory,
  SimulateTxAccessor,
  ModuleProxyFactory,
  Allowance,
  Delay,
  ERC1155,
  ERC20: erc20Abi
};
