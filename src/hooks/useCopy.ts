// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

export function useCopy(
  value?: { toString: () => string },
  ms: number = 500
): [isCopied: boolean, copy: (value?: string) => void] {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  return [
    copied,
    useCallback(
      (v?: string) => {
        const _value = v || value;

        if (_value) {
          copy(_value.toString());
          setCopied(true);
          setTimeout(() => setCopied(false), ms);
        }
      },
      [copy, ms, value]
    )
  ];
}
