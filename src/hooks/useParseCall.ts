// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CallFunctions, ParsedCall } from './types';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { decodeFunctionData, getAbiItem, type Hex, parseAbiItem, size } from 'viem';

import { abis } from '@mimir-wallet/abis';
import { events } from '@mimir-wallet/events';
import { decodeMultisend } from '@mimir-wallet/safe';

const cache = new Map<Hex, [size: number, parsed: ParsedCall<CallFunctions>]>();

async function getAbi(hex: Hex, fromCache: boolean = true): Promise<string | null> {
  return fetch(
    `https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=${hex.slice(0, 10)}${fromCache ? '' : '&timestamp=' + Date.now()}`
  )
    .then((res) => res.json())
    .then((results) => {
      if (results.results && results.results.length > 0) {
        return results.results[results.results.length - 1].text_signature;
      }

      throw new Error('Not find signatures');
    });
}

export function useParseCall(data: Hex): [size: number, parsed: ParsedCall<CallFunctions>, isParsed: boolean] {
  const [state, setState] = useState<[size: number, parsed: ParsedCall<CallFunctions>]>(
    cache.get(data) || [
      0,
      {
        functionName: data.slice(0, 10).length > 2 ? data.slice(0, 10) : 'Send',
        args: [],
        names: [],
        types: []
      } as unknown as ParsedCall<CallFunctions>
    ]
  );
  const [isParsed, setIsParsed] = useState(cache.has(data));

  const parseFromAbi = useCallback((data: Hex, fromCache: boolean = true) => {
    const dataSize = size(data);

    getAbi(data, fromCache)
      .then((signatures) => {
        const abiItem = parseAbiItem(`function ${signatures}` as string);

        if (abiItem.type === 'function') {
          const { functionName, args } = decodeFunctionData({
            abi: [abiItem],
            data
          });
          const _state = [
            dataSize,
            {
              functionName,
              args: args || [],
              names: abiItem.inputs.map((item) => item.name || item.type),
              types: abiItem.inputs.map((item) => item.type)
            } as ParsedCall<CallFunctions>
          ];

          cache.set(data, _state as [size: number, parsed: ParsedCall<CallFunctions>]);
          setState(_state as [size: number, parsed: ParsedCall<CallFunctions>]);
          setIsParsed(true);
        } else {
          throw new Error('not function abi');
        }
      })
      .catch(() => {
        setState((state) => [dataSize, { ...state[1], functionName: data.slice(0, 10) }]);
        setIsParsed(false);
      });
  }, []);

  useEffect(() => {
    const handleRefetch = (value: Hex) => {
      if (value === data) {
        parseFromAbi(data, false);
      }
    };

    events.on('refetch_call_data', handleRefetch);

    return () => {
      events.off('refetch_call_data', handleRefetch);
    };
  }, [data, parseFromAbi]);

  useEffect(() => {
    if (cache.has(data)) {
      setState(cache.get(data)!);
      setIsParsed(true);
    } else {
      try {
        const dataSize = size(data);

        if (dataSize > 0) {
          const abiItem = getAbiItem({ abi: Object.values(abis).flat(), name: data.slice(0, 10) as Hex });

          if (abiItem && abiItem.type === 'function') {
            const { functionName, args } = decodeFunctionData({
              data,
              abi: [abiItem]
            });

            const _state = [
              dataSize,
              {
                functionName,
                args: args || [],
                names: abiItem.inputs.map((item) => item.name || item.type),
                types: abiItem.inputs.map((item) => item.type)
              } as ParsedCall<CallFunctions>
            ];

            cache.set(data, _state as [size: number, parsed: ParsedCall<CallFunctions>]);
            setState(_state as [size: number, parsed: ParsedCall<CallFunctions>]);
            setIsParsed(true);
          } else {
            parseFromAbi(data);
          }
        } else {
          setState([dataSize, { functionName: 'Send', args: [], names: [], types: [] }]);
          setIsParsed(true);
        }
      } catch {
        parseFromAbi(data);
      }
    }
  }, [data, parseFromAbi]);

  return [...state, isParsed];
}

export function useParseMultisend(parsed: ParsedCall<CallFunctions>) {
  return useMemo(() => {
    if (parsed.functionName === 'multiSend') {
      try {
        return decodeMultisend(parsed.args[0] as Hex);
      } catch {
        /* empty */
      }
    }

    return null;
  }, [parsed.args, parsed.functionName]);
}
