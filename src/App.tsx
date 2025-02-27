// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import BaseContainer from './containers/BaseContainer';
import PageVerify from './pages/verify';
import Providers from './Providers';

function App(): React.ReactElement {
  const router = useRef(
    createBrowserRouter(
      [
        {
          element: (
            <Providers>
              <BaseContainer />
            </Providers>
          ),
          children: [
            {
              children: [
                {
                  index: true,
                  element: <PageVerify />
                }
              ]
            }
          ]
        },
        {
          path: '*',
          element: <Navigate replace to='/' />
        }
      ],
      { basename: import.meta.env.BASE_URL }
    )
  );

  return <RouterProvider router={router.current} />;
}

export default App;
