// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

export function useInput(
  defaultValue?: string
): [value: string, setValue: (value: string | React.ChangeEvent<HTMLInputElement>) => void] {
  const [value, setValue] = useState<string>(defaultValue || '');

  const onChange = useCallback((_value: string | React.ChangeEvent<HTMLInputElement>) => {
    if (typeof _value === 'string') {
      setValue(_value);
    } else {
      setValue(_value.target.value);
    }
  }, []);

  return [value, onChange];
}
