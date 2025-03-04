// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address } from 'abitype';

import React, { useMemo } from 'react';
import { type Chain, isHex } from 'viem';

import { useMediaQuery } from '@mimir-wallet/hooks/useMediaQuery';

import AddressRow from './AddressRow';
import Bytes from './Bytes';

function FunctionItem({ chain, name, type, data }: { chain: Chain; name: string; type: string; data: unknown }) {
  const upSm = useMediaQuery('sm');
  const content = useMemo(() => {
    if (type === 'address') {
      return <AddressRow chain={chain} showFull={upSm} withCopy withExplorer iconSize={14} address={data as Address} />;
    }

    if (isHex(data)) {
      return <Bytes data={data} />;
    }

    if (Array.isArray(data)) {
      return JSON.stringify(data);
    }

    return data?.toString?.() || null;
  }, [chain, data, type, upSm]);

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <span className='text-small font-medium text-foreground'>{name}</span>
        <span className='text-tiny text-foreground/50'>({type})</span>
      </div>
      <div className='rounded-small bg-default-100 p-2 font-mono text-tiny break-all'>{content}</div>
    </div>
  );
}

export default React.memo(FunctionItem);
