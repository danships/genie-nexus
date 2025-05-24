'use client';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { debugLogger } from '@lib/core/debug-logger';

type BaseApiKey = {
  id: string;
  active: boolean;
};

type Properties<T extends BaseApiKey> = {
  apiKey: T;
  onToggle: (newState: boolean) => void;
  inProgress: boolean;
};

export function ApiKeyToggle<T extends BaseApiKey>({
  apiKey,
  onToggle,
  inProgress,
}: Properties<T>) {
  const handleToggleActive = () => {
    try {
      onToggle(!apiKey.active);
    } catch (error) {
      debugLogger('Failed to update API key:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update API key',
        color: 'red',
      });
    }
  };

  return (
    <Button
      variant={apiKey.active ? 'light' : 'outline'}
      color={apiKey.active ? 'red' : 'green'}
      onClick={handleToggleActive}
      loading={inProgress}
      mb="md"
    >
      {apiKey.active ? 'Disable API Key' : 'Enable API Key'}
    </Button>
  );
}
