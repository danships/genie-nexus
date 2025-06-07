import { Title } from '@mantine/core';
import type { ReactNode } from 'react';

export const PageTitle = ({ children }: { children: ReactNode }) => (
  <Title order={1} mb="md">
    {children}
  </Title>
);
