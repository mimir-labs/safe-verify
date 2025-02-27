// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { formatUnits } from 'viem';

interface Props {
  value?: bigint | string | number | null;
  decimals?: number;
  unit?: number;
  symbol?: string;
  showSymbol?: boolean;
  prefix?: React.ReactNode;
  restOpacity?: number;
}

const formatDisplay = (value: string, unit = 4): [string, string] => {
  if (value.includes('.')) {
    const [pre, suf] = value.split('.');

    return unit === 0 ? [pre, ''] : [pre, suf.slice(0, unit)];
  }

  return [value, ''];
};

function FormatBalance({
  decimals = 18,
  prefix,
  showSymbol = false,
  symbol,
  restOpacity = 1,
  unit = 4,
  value
}: Props): React.ReactNode {
  const [major, rest] = useMemo(() => {
    const _value = formatUnits(BigInt(value || 0), decimals);

    return formatDisplay(_value, unit);
  }, [value, decimals, unit]);

  return (
    <span className='inline-flex items-center gap-1'>
      {prefix}
      <span>
        {major}
        {rest ? <span style={{ opacity: restOpacity }}>.{rest}</span> : null}
      </span>
      <span>{showSymbol ? ` ${symbol || ''}` : ''}</span>
    </span>
  );
}

export default React.memo(FormatBalance);
