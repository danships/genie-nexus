import { Notification } from '@mantine/core';

export function ErrorNotification({ children }: { children: React.ReactNode }) {
  return (
    <Notification color="red" withCloseButton={false}>
      {children}
    </Notification>
  );
}
