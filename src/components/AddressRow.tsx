// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain } from 'viem';

import { Button, Link } from '@heroui/react';
import React from 'react';

import IconAnchor from '@mimir-wallet/assets/svg/icon-anchor.svg?react';
import { useTokenMeta } from '@mimir-wallet/hooks/useToken';
import { explorerUrl } from '@mimir-wallet/utils';

import Address from './Address';
import AddressIcon from './AddressIcon';
import CopyAddressButton from './CopyAddressButton';

interface Props {
  chain: Chain;
  className?: string;
  address?: string | null | undefined;
  showFull?: boolean;
  iconSize?: number;
  withCopy?: boolean;
  withExplorer?: boolean;
}

function AddressRow({ className, chain, iconSize, address, showFull, withCopy, withExplorer }: Props) {
  const tokenMeta = useTokenMeta(address);

  const displayName = tokenMeta?.n || tokenMeta?.s || <Address address={address} showFull={showFull} />;

  return (
    <div className={`inline-flex items-center gap-x-[5px] ${className || ''}`}>
      <AddressIcon size={iconSize} address={address} src={tokenMeta?.i} />
      {displayName}

      {withCopy && <CopyAddressButton style={{ color: 'inherit' }} size='sm' address={address} />}
      {withExplorer && address && (
        <Button
          size='sm'
          as={Link}
          target='_blank'
          href={explorerUrl('address', chain, address)}
          isIconOnly
          variant='light'
          style={{ color: 'inherit' }}
          className='border-transparent min-w-0 w-[16px] h-[16px]'
        >
          <IconAnchor style={{ width: 12, height: 12 }} />
        </Button>
      )}
    </div>
  );
}

export default React.memo(AddressRow);
