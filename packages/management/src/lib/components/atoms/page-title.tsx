import { Title } from '@mantine/core';
import type { ReactNode } from 'react';

export const PageTitle = ({
  children,
  className,
}: { className?: string; children: ReactNode }) => (
  <Title order={1} mb="md" c="cyan.3" className={className ?? ''}>
    {children}
  </Title>
);
