'use client'; // Error boundaries must be Client Components

import { debugLogger } from '@lib/core/debug-logger';
import { Notification, Stack, Text } from '@mantine/core';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    debugLogger('Error Boundary encountered an error.', error);
  }, [error]);

  return (
    <>
      {isAxiosError(error) && error.config?.method?.toLowerCase() === 'get' && (
        <Notification maw={'50%'} ml={'25%'} color="red">
          <Stack>
            <Text>The data could not be retrieved.</Text>
          </Stack>
        </Notification>
      )}
    </>
  );
}
