// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

export function useCopy(value?: { toString: () => string }, ms: number = 500): [isCopied: boolean, copy: () => void] {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  return [
    copied,
    useCallback(() => {
      if (value) {
        copy(value.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), ms);
      }
    }, [copy, ms, value])
  ];
}
