// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ButtonProps } from '@heroui/react';

import React from 'react';

import CopyButton from './CopyButton';

interface Props extends Omit<ButtonProps, 'value'> {
  address?: string | null;
  colored?: boolean;
}

function CopyAddressButton({ address, ...props }: Props) {
  return <CopyButton {...props} value={address ? address : '0x'} />;
}

export default React.memo(CopyAddressButton);
