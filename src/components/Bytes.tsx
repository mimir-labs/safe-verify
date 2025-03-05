// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { type Hex, size } from 'viem';

import CopyButton from './CopyButton';

function Bytes({ data }: { data?: Hex }) {
  const byteSize = useMemo(() => size(data || '0x'), [data]);

  return (
    <span className='inline-flex items-center gap-x-1'>
      {byteSize} Bytes
      <CopyButton style={{ color: 'inherit' }} value={data} size='sm' />
    </span>
  );
}

export default React.memo(Bytes);
