'use client';

import { type SignInResponse, getCsrfToken } from 'next-auth/react';

async function doRequest<T>(
  url: string,
  method: string,
  body?: string | FormData
): Promise<T> {
  const request: RequestInit = {
    method,
  };
  if (body) {
    request.body = body;
    request.headers = {
      'Content-Type': 'application/json',
    };
  }
  const response = await fetch(url, request);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json() as Promise<T>;
}

export const credentialsClient = {
  signIn: async (email: string, password: string): Promise<SignInResponse> => {
    const data = new FormData();
    data.append('csrfToken', await getCsrfToken());
    data.append('email', email);
    data.append('password', password);

    const response = await doRequest<SignInResponse>(
      '/api/auth/callback/credentials',
      'POST',
      data
    );
    return response;
  },
};
