// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMedia } from 'react-use';

export function useMediaQuery(size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'): boolean {
  const query =
    size === 'sm'
      ? '(min-width: 640px)'
      : size === 'md'
        ? '(min-width: 768px)'
        : size === 'lg'
          ? '(min-width: 1024px)'
          : size === 'xl'
            ? '(min-width: 1280px)'
            : size === '2xl'
              ? '(min-width: 1536px)'
              : size === '3xl'
                ? '(min-width: 1920px)'
                : '(min-width: 0px)';

  return useMedia(query);
}
