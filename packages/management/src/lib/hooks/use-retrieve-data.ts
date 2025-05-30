import { debugLogger } from '@lib/core/debug-logger';
import { useEffect, useState } from 'react';

type Options = {
  autoStart?: boolean;
  clearDataOnRefresh?: boolean; // default false
};

export function useRetrieveData<T>(
  fetcher: () => Promise<T>,
  providedOptions?: Options
) {
  const options = {
    autoStart: true,
    clearDataOnRefresh: false,
    ...providedOptions,
  };
  debugLogger('useRetrieveData initialized with options:', options);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);

  async function retrieveData() {
    if (options.clearDataOnRefresh) {
      debugLogger('Clearing data due to clearDataOnRefresh option');
      setData(null);
    }

    try {
      debugLogger('Starting data retrieval');
      setLoading(true);
      setError(null);

      const retrievedData = await fetcher();
      debugLogger('Data retrieved successfully:', retrievedData);
      setData(retrievedData);
    } catch (thrownError) {
      debugLogger('Error during data retrieval:', thrownError);
      if (thrownError instanceof Error) {
        setError(thrownError.message);
        return;
      }

      setError('An unexpected error occurred.');
    } finally {
      debugLogger('Data retrieval completed, loading state set to false');
      setLoading(false);
    }
  }

  useEffect(() => {
    if (options.autoStart) {
      debugLogger('Auto-starting data retrieval due to autoStart option');
      void retrieveData();
    }
  }, [fetcher, options.autoStart, retrieveData]);

  return {
    error,
    loading,
    data,
    refresh: () => {
      debugLogger('Manual refresh triggered');
      return retrieveData();
    },
  };
}
