// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Image, Navbar, NavbarBrand } from '@heroui/react';

import Logo from '@mimir-wallet/assets/images/logo.png';

function TopBar() {
  return (
    <Navbar maxWidth='full' isBordered shouldHideOnScroll>
      <NavbarBrand>
        <Image radius='none' width={87} src={Logo} alt='Mimir Wallet' />
      </NavbarBrand>
    </Navbar>
  );
}

export default TopBar;
