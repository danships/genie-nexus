'use client';
import axios, { AxiosInstance } from 'axios';
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { SWRConfig } from 'swr';

let client!: AxiosInstance;

export function getClient(): AxiosInstance {
  if (!client) {
    throw new Error(
      'Client not initialized. Did you forget to wrap your app in SwrDefaultApiConfig?'
    );
  }
  return client;
}

type Options = {
  baseURL: string;
};

const defaultOptions: Options = {
  baseURL: '',
};

export const SwrDefaultApiConfig: FunctionComponent<
  PropsWithChildren<{
    customOptions?: Partial<Options>;
  }>
> = ({ children, customOptions }) => {
  return (
    <SwrDefaultApiConfigInner customOptions={customOptions ?? {}}>
      {children}
    </SwrDefaultApiConfigInner>
  );
};

export const noUnwrapFetcher = (resource: unknown) => {
  return getClient()
    .get(`${resource}`)

    .then((res) => res.data);
};

export const fetcher = (resource: unknown) => {
  return getClient()
    .get(`${resource}`)
    .then((res) => {
      if (typeof res.data?.data === 'object') {
        return res.data['data']; // Unwrap the data wrapper in the response.
      }

      return res.data;
    });
};

/* We define this as an inner component, so that we can wrap it in the ErrorContainer. */
const SwrDefaultApiConfigInner: FunctionComponent<
  PropsWithChildren<{
    customOptions: Partial<Options>;
  }>
> = ({ children, customOptions }) => {
  const [clientAvailable, setClientAvailable] = useState<boolean>(false);

  useEffect(() => {
    client = axios.create({
      baseURL: customOptions.baseURL ?? defaultOptions.baseURL,
    });

    setClientAvailable(true);
  }, [client]);

  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {clientAvailable && children}
    </SWRConfig>
  );
};
