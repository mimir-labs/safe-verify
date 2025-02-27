// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  address?: string | null | undefined;
  showFull?: boolean;
}

function Address({ showFull, address }: Props) {
  return address ? `${showFull ? address : `${address.slice(0, 6)}…${address.slice(-4)}`}` : '0x';
}

export default React.memo(Address);
