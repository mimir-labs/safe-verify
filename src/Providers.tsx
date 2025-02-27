// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeroUIProvider } from '@heroui/system';
import { useNavigate } from 'react-router-dom';

function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return <HeroUIProvider navigate={navigate}>{children}</HeroUIProvider>;
}

export default Providers;
