// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

export class FetchError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Failed when connect server, please check your network');
  }
}

export async function fetcher(resource: URL | string | Promise<URL | string>, init?: RequestInit): Promise<any> {
  let url: string | URL;

  if (resource instanceof Promise) {
    url = await resource;
  } else {
    url = resource;
  }

  return fetch(url, init)
    .catch(() => {
      throw new NetworkError();
    })
    .then(async (res) => {
      const json = await res.json();

      if (!res.ok) {
        throw new FetchError(json?.message || 'An error occurred while fetching the data.', json?.statusCode || 500);
      }

      return json;
    });
}
