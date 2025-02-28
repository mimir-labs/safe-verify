// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { type Chain, createPublicClient, http, type PublicClient, type Transport } from 'viem';
import * as chains from 'viem/chains';

export function getSafeGateway(chainId: number) {
  if (chainId === 1284) {
    // for moonbeam
    return 'https://gateway.multisig.moonbeam.network';
  }

  return 'https://safe-client.safe.global';
}

const cacheClient = new Map<number, PublicClient<Transport, chains.Chain>>();

export function getPublicClient(chainId: number) {
  const cachedClient = cacheClient.get(chainId);

  if (cachedClient) {
    return cachedClient;
  }

  const chain = Object.values(chains).find((chain) => chain.id === chainId);

  if (!chain) {
    throw new Error('Invalid chain');
  }

  const client = createPublicClient<Transport, chains.Chain>({
    chain,
    transport: http()
  });

  cacheClient.set(chainId, client);

  return client;
}

export function getExplorerChain(explorerUrl: string) {
  const url = new URL(explorerUrl);
  const hostname = url.hostname;

  const chain = Object.values(chains).find(
    (chain) => chain.blockExplorers && new URL(chain.blockExplorers.default.url).hostname === hostname
  );

  if (!chain) {
    throw new Error('Invalid explorer URL');
  }

  return chain;
}

type ExplorerType = 'address' | 'tx' | 'block' | 'token' | 'nft';

export function explorerUrl<Type extends ExplorerType>(
  type: Type,
  chain: Chain,
  value: Type extends 'nft' ? [string, string] : string | number | { toString: () => string }
): string | undefined {
  if (!chain.blockExplorers?.default.url) {
    return undefined;
  }

  const url = new URL(chain.blockExplorers.default.url);

  url.pathname = type === 'nft' ? `${type}/${(value as []).join('/')}` : `${type}/${value.toString()}`;

  return url.href;
}
