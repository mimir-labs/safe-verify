// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button, type ButtonProps } from '@heroui/react';
import React from 'react';

import IconCopy from '@mimir-wallet/assets/svg/icon-copy.svg?react';
import IconSuccess from '@mimir-wallet/assets/svg/icon-success.svg?react';
import { useCopy } from '@mimir-wallet/hooks/useCopy';

interface Props extends Omit<ButtonProps, 'value'> {
  value?: string | null;
}

function CopyButton({ value, className, style, ...props }: Props) {
  const [copied, copy] = useCopy(value || '');

  return (
    <Button
      {...props}
      isIconOnly
      variant='light'
      onPress={copy}
      style={style}
      className={(className || '').concat(' border-transparent min-w-0 w-[16px] h-[16px]')}
    >
      {copied ? <IconSuccess width={14} /> : <IconCopy width={14} />}
    </Button>
  );
}

export default React.memo(CopyButton);
