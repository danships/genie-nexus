import useSWR, { type SWRConfiguration } from 'swr';
import { fetcher as defaultFetcher, getClient } from './swr-config';
import { useEffect, useState } from 'react';
export { useMatchMutate } from './use-match-mutate';
export { getClient, SwrDefaultApiConfig, noUnwrapFetcher } from './swr-config';

export const useApi = <T>(
  url: string | (() => string | false),
  options: Partial<SWRConfiguration> = {},
) => {
  const fetcher = options.fetcher || defaultFetcher;
  const result = useSWR<T>(url, fetcher, options);

  useEffect(() => {
    // Make sure it gets caught by the error boundary
    if (result.error) {
      throw result.error;
    }
  }, [result.error]);

  return {
    ...result,
    isLoading: !result.error && typeof result.data === 'undefined',
  };
};

export const useCudApi = () => {
  const [inProgress, setInProgress] = useState<boolean>(false);

  async function request<T, D>(
    method: 'post' | 'patch' | 'delete',
    path: string,
    data?: D,
  ): Promise<T> {
    setInProgress(true);
    try {
      const result = await getClient()<T>({
        method,
        url: path,
        data,
      });
      return result.data;
    } finally {
      setInProgress(false);
    }
  }

  return {
    inProgress,
    post: <T, D = unknown>(path: string, data?: D) =>
      request<T, D>('post', path, data),
    patch: <T, D = unknown>(path: string, data?: D) =>
      request<T, D>('patch', path, data),
    delete: <T, D = unknown>(path: string, data?: D) =>
      request<T, D>('delete', path, data),
  };
};
