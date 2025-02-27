// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Outlet } from 'react-router-dom';

import TopBar from './TopBar';

function BaseContainer() {
  return (
    <>
      <TopBar />

      <div>
        <Outlet />
      </div>
    </>
  );
}

export default BaseContainer;
