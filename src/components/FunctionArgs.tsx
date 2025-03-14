// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { type Address, type Chain, type Hex } from 'viem';

import { useParseCall } from '@mimir-wallet/hooks/useParseCall';
import { useTokenInfo } from '@mimir-wallet/hooks/useToken';

import FunctionItem from './FunctionItem';

function FunctionArgs({ chain, address, data }: { chain: Chain; address?: Address; data: Hex }) {
  const [node, setNode] = useState<React.ReactNode[]>();
  const [size, parsed] = useParseCall(data);
  const token = useTokenInfo(
    chain.id,
    parsed.functionName === 'transfer' || parsed.functionName === 'transferFrom' ? address : undefined
  );

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
            token={token}
          />
        ))
      );
    } catch {
      /* empty */
    }
  }, [chain, parsed, size, token]);

  return node;
}

export default React.memo(FunctionArgs);
