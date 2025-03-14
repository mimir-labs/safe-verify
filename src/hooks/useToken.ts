// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from '@tanstack/react-query';
import { type Address, erc20Abi } from 'viem';

import { getPublicClient } from '@mimir-wallet/utils';

export function useTokenMeta(address?: string | null) {
  const { data } = useQuery<{ i: string; n: string; s: string; d: number }>({
    queryHash: `tokenmeta-${address}`,
    queryKey: [address ? `https://evm-assets-api.mimir.global/tokens/${address}/meta` : null],
    refetchInterval: 0,
    refetchOnMount: false
  });

  return data;
}

function getTokenInfoQueryKey(chainId: number, address?: Address | null) {
  const client = getPublicClient(chainId);

  if (!address) {
    return undefined;
  }

  return client.multicall({
    allowFailure: false,
    contracts: [
      {
        abi: erc20Abi,
        functionName: 'decimals',
        address
      },
      {
        abi: erc20Abi,
        functionName: 'symbol',
        address
      },
      {
        abi: erc20Abi,
        functionName: 'name',
        address
      }
    ]
  });
}

export function useTokenInfo(chainId: number, address?: Address | null) {
  const { data } = useQuery({
    queryHash: `token-info-${address}`,
    queryKey: [chainId, address] as const,
    queryFn: ({ queryKey }) => getTokenInfoQueryKey(queryKey[0], queryKey[1]),
    refetchInterval: 0,
    refetchOnMount: false
  });

  return data;
}
