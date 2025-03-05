// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Avatar } from '@heroui/react';
import React from 'react';

import { useAllChainIcons } from '@mimir-wallet/hooks/useChains';

function ChainIcon({ icon }: { icon: string }) {
  const allChainIcons = useAllChainIcons();

  const url = allChainIcons?.[icon];

  return (
    <Avatar
      alt={icon}
      className='flex-shrink-0'
      size='sm'
      src={url?.replace('ipfs://', 'https://ipfs.io/ipfs/')}
      classNames={{
        base: url ? 'bg-transparent' : '',
        img: 'object-contain object-center'
      }}
      fallback={<Avatar src='https://cdn.jsdelivr.net/gh/webThreeBuilder/CryptoLogos/logos/unknow.png' size='sm' />}
    />
  );
}

export default React.memo(ChainIcon);
