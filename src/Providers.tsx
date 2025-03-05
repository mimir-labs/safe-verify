// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeroUIProvider } from '@heroui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetcher } from './fetcher';

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchInterval: 6_000,
          queryFn: ({ queryKey }) => (queryKey[0] ? fetcher(queryKey[0] as string) : null)
        }
      }
    })
  );
  const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient.current}>
      <HeroUIProvider navigate={navigate}>{children}</HeroUIProvider>
    </QueryClientProvider>
  );
}

export default Providers;
