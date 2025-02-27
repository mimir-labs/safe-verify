// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type CallFunctions = string;

export interface ParsedCall<F extends CallFunctions = CallFunctions> {
  functionName: F;
  args: unknown[];
  names: (string | undefined)[];
  types: string[];
}
