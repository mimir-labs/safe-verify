// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain, Hex } from 'viem';

import React, { useEffect, useState } from 'react';

import { useParseCall } from '@mimir-wallet/hooks/useParseCall';

import FunctionItem from './FunctionItem';

function FunctionArgs({ chain, data }: { chain: Chain; data: Hex }) {
  const [node, setNode] = useState<React.ReactNode>();
  const [size, parsed] = useParseCall(data);

  useEffect(() => {
    try {
      if (size === 0) {
        return;
      }

      setNode(
        parsed.args.map((item, index) => (
          <FunctionItem
            key={index}
            chain={chain}
            name={parsed.names[index] || `param${index + 1}`}
            type={parsed.types[index]}
            data={item}
          />
        ))
      );
    } catch {
      /* empty */
    }
  }, [chain, parsed, size]);

  return node;
}

export default React.memo(FunctionArgs);
