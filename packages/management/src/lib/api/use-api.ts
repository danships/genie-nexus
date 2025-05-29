import { notifications } from '@mantine/notifications';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import useSWR, { type SWRConfiguration } from 'swr';
import { fetcher as defaultFetcher, getClient } from './swr-config';
export { useMatchMutate } from './use-match-mutate';
export { getClient, SwrDefaultApiConfig, noUnwrapFetcher } from './swr-config';

export const useApi = <T = unknown>(
  url: string | (() => string | false),
  options: Partial<SWRConfiguration> = {}
) => {
  const fetcher = options.fetcher || defaultFetcher;
  const result = useSWR<T>(url, fetcher, options);

  useEffect(() => {
    // Make sure it gets caught by the error boundary
    if (
      result.error &&
      isAxiosError(result.error) &&
      result.error.config?.method?.toLowerCase() === 'get'
    ) {
      notifications.show({
        title: 'Error',
        message: 'Data could not be retrieved.',
        color: 'red',
      });
    }
  }, [result.error]);

  return {
    ...result,
    isLoading: !result.error && typeof result.data === 'undefined',
  };
};

export const useCudApi = () => {
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function request<T, D>(
    method: 'post' | 'patch' | 'delete',
    path: string,
    data?: D
  ): Promise<T> {
    setInProgress(true);
    setError(null);
    try {
      const result = await getClient()<T>({
        method,
        url: path,
        data,
      });
      return result.data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      throw error;
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
    error,
  };
};
