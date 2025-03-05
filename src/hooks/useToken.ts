// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from '@tanstack/react-query';

export function useTokenMeta(address?: string | null) {
  const { data } = useQuery<{ i: string; n: string; s: string; d: number }>({
    queryHash: `tokenmeta-${address}`,
    queryKey: [address ? `https://evm-assets-api.mimir.global/tokens/${address}/meta` : null],
    refetchInterval: 0,
    refetchOnMount: false
  });

  return data;
}
