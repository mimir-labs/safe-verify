// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import jazzicon from '@metamask/jazzicon';
import React, { useLayoutEffect, useRef } from 'react';

interface Props {
  address?: string | null | undefined;
  ensImage?: string | null;
  size?: number;
}

function AddressIconJazz({ size = 24, address, ensImage }: Props): React.ReactElement {
  const iconRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const { current } = iconRef;

    if (address) {
      const icon = jazzicon(size, parseInt(address.slice(2, 10), 16));

      current?.appendChild(icon);

      return () => {
        try {
          current?.removeChild(icon);
        } catch {
          /* empty */
        }
      };
    }

    return () => 0;
  }, [address, size]);

  if (ensImage) {
    return <img src={ensImage} style={{ width: size, height: size }} alt='Address Icon' />;
  }

  return (
    <div
      ref={iconRef}
      style={{ width: size, height: size, lineHeight: 1, fontSize: '12px' }}
      className='inline-block [&>div]:rounded-full'
    />
  );
}

export default React.memo(AddressIconJazz);
