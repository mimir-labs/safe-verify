// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hex } from 'viem';

import Events from 'eventemitter3';

type EventTypes = {
  refetch_call_data: (value: Hex) => void;
};

export const events = new Events<EventTypes>();
