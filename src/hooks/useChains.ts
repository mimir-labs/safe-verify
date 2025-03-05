// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface ChainInfo {
  name: string;
  chain: string;
  icon: string;
  rpc: string[];
  features: { name: string }[];
  faucets: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  infoURL: string;
  shortName: string;
  chainId: number;
  networkId: number;
  slip44: number;
  ens?: {
    registry: string;
  };
  explorers: {
    name: string;
    url: string;
    standard: string;
    icon?: string;
  }[];
}

export function useAllChains() {
  const { data } = useQuery<ChainInfo[]>({
    queryHash: 'all_chains',
    queryKey: ['https://chainid.network/chains.json'],
    refetchInterval: 0,
    refetchOnMount: false
  });

  return data;
}

export function useAllChainIcons() {
  const { data } = useQuery<
    {
      name: string;
      icons: {
        url: string;
        width: number;
        height: number;
        format: string;
      }[];
    }[]
  >({
    queryHash: 'all_chains_icon',
    queryKey: ['https://chainid.network/chain_icons.json'],
    refetchInterval: 0,
    refetchOnMount: false
  });

  return useMemo(
    () =>
      data?.reduce(
        (result, { name, icons }) => {
          if (icons?.[0]?.url) {
            result[name] = icons[0].url;
          }

          return result;
        },
        {} as Record<string, string>
      ),
    [data]
  );
}
