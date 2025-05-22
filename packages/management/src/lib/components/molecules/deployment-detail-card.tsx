'use client';

import { Card, Stack, Group, Title, Paper } from '@mantine/core';
import { ReactNode, ComponentType } from 'react';

type DeploymentDetailCardProps = {
  icon: ComponentType<{ size: number }>;
  title: string;
  children: ReactNode;
};

export function DeploymentDetailCard({
  icon: Icon,
  title,
  children,
}: DeploymentDetailCardProps) {
  return (
    <Card withBorder>
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
