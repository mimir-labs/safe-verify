// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Image, Link, Navbar, NavbarBrand } from '@heroui/react';

import Logo from '@mimir-wallet/assets/images/logo.png';

function TopBar() {
  return (
    <Navbar maxWidth='full' isBordered shouldHideOnScroll>
      <NavbarBrand>
        <Link href='https://mimir.global' target='_blank'>
          <Image radius='none' width={87} src={Logo} alt='Mimir Wallet' />
        </Link>
      </NavbarBrand>
    </Navbar>
  );
}

export default TopBar;
