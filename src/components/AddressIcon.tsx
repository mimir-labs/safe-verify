// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Avatar } from '@heroui/react';
import jazzicon from '@metamask/jazzicon';
import React, { useLayoutEffect, useMemo, useRef } from 'react';

import AddressIconJazz from './AddressIconJazz';

interface Props {
  chainId?: number;
  address?: string | null | undefined;
  ensImage?: string | null;
  size?: number;
  src?: string;
}

function AddressIcon({ ensImage, size = 24, src, address }: Props): React.ReactElement {
  const icon = useMemo(() => (address ? jazzicon(size, parseInt(address.slice(2, 10), 16)) : null), [size, address]);
  const iconRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const { current } = iconRef;

    if (icon) {
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
  }, [icon]);

  const iconSrc = src || ensImage;

  return (
    <span
      className='relative'
      style={{
        width: size,
        height: size
      }}
    >
      <Avatar
        src={iconSrc || undefined}
        style={{ width: size, height: size, background: 'transparent' }}
        fallback={<AddressIconJazz address={address} size={size} ensImage={ensImage} />}
      />
    </span>
  );
}

export default React.memo(AddressIcon);
