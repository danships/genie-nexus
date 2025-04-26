'use client';
import { debugLogger } from '@lib/core/debug-logger';
import axios, { AxiosInstance, isAxiosError } from 'axios';
import React, {
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
      'Client not initialized. Did you forget to wrap your app in SwrDefaultApiConfig?',
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
  return (
    getClient()
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`${resource}`)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .then((res) => res.data)
  );
};

export const fetcher = (resource: unknown) => {
  return (
    getClient()
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`${resource}`)
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (typeof res.data?.data === 'object') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          return res.data['data']; // Unwrap the data wrapper in the response.
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return res.data;
      })
  );
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
    // const configuredOptions = {
    //   ...defaultOptions,
    //   ...customOptions,
    // };

    client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!isAxiosError(error)) {
          throw error;
        }
        if (error.config?.method?.toLocaleLowerCase() === 'get') {
          throw error; // the initialize-client already takes care of this.
        }
      },
    );

    setClientAvailable(true);
  }, [client]);

  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error) => debugLogger(error),
      }}
    >
      {clientAvailable && children}
    </SWRConfig>
  );
};
