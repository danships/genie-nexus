'use client';

import { Card, Stack, Group, Title, Paper } from '@mantine/core';
import { ReactNode, ComponentType } from 'react';

type Properties = {
  icon: ComponentType<{ size: number }>;
  title: string;
  children: ReactNode;
};

export function DetailCard({ icon: Icon, title, children }: Properties) {
  return (
    <Card withBorder className="is-transparent">
      <Stack gap="md">
        <Group>
          <Icon size={24} />
          <Title order={3}>{title}</Title>
        </Group>
        <Paper withBorder p="md">
          {children}
        </Paper>
      </Stack>
    </Card>
  );
}
