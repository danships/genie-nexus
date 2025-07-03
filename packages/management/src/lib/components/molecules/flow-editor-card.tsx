import { Button, Group, Paper, Stack, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type Properties = {
  deploymentId: string;
  label?: ReactNode;
};

export function FlowEditorCard({
  deploymentId,
  label = 'Configure Flow',
}: Properties) {
  return (
    <Paper p="md" withBorder>
      <Group>
        <Stack gap="md">
          <Title order={3}>Configuration</Title>
          <Button
            component={Link}
            href={`/app/deployments/${deploymentId}/flow`}
            rightSection={<IconArrowRight size={16} />}
            data-umami-event="flow-editor-card-configure"
          >
            {label}
          </Button>
        </Stack>
      </Group>
    </Paper>
  );
}
