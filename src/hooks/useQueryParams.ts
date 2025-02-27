// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo, useRef } from 'react';
import { type NavigateOptions, useSearchParams } from 'react-router-dom';
import * as searchQuery from 'search-query-parser';

export function useQueryParam<T>(
  key: string,
  defaultValue?: undefined,
  options?: NavigateOptions
): [T | undefined, (newQuery: T | undefined, options?: NavigateOptions) => void];
export function useQueryParam<T>(
  key: string,
  defaultValue: T,
  options?: NavigateOptions
): [T, (newQuery: T | undefined, options?: NavigateOptions) => void];

export function useQueryParam<T>(
  key: string,
  defaultValue?: T,
  options?: NavigateOptions
): [T | undefined, (newQuery: T | undefined, options?: NavigateOptions) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get(key);
  const optionsRef = useRef(options);

  optionsRef.current = options;

  const value = useMemo(
    () => (paramValue ? (searchQuery.parse(paramValue) as unknown as T) : defaultValue),
    [defaultValue, paramValue]
  );

  const setValue = useCallback(
    (newValue: T | undefined, _options?: NavigateOptions) => {
      if (newValue === undefined || newValue === null) {
        const newSearchParams = new URLSearchParams(searchParams);

        newSearchParams.delete(key);
        setSearchParams(newSearchParams, {
          ...optionsRef.current,
          ..._options
        });
      } else {
        const newSearchParams = new URLSearchParams(searchParams);

        newSearchParams.set(key, searchQuery.stringify(newValue));
        setSearchParams(newSearchParams, {
          ...optionsRef.current,
          ..._options
        });
      }
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
}
