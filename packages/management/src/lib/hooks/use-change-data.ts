import { debugLogger } from '@lib/core/debug-logger';
import { useState } from 'react';

/**
 * Usage:
 * void changeData(
      () => createTaskServerAction(formDataToObject(formData)),
      () => close()
    );
 * @returns
 */
export function useChangeData() {
  const [error, setError] = useState<string | null>(null);
  const [inProgress, setInProgress] = useState<boolean>(false);

  async function changeData<T, O>(
    action: () => Promise<T | null>,
    success?: (result?: O) => void
  ) {
    try {
      setInProgress(true);
      setError(null);
      const result = await action();
      if (success) {
        success(result as O);
      }

      return result;
    } catch (thrownError) {
      if (thrownError instanceof Error) {
        debugLogger('useChangeData error', thrownError);
        setError(thrownError.message);
        return null;
      }

      setError('An unexpected error occurred.');
      return null;
    } finally {
      setInProgress(false);
    }
  }

  return {
    error,
    inProgress,
    changeData,
  };
}
