import { Button, Group, Paper, Stack, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

type Properties = {
  deploymentId: string;
};

export function WeaveEditor({ deploymentId }: Properties) {
  return (
    <Paper p="md" withBorder>
      <Group>
        <Stack gap="md">
          <Title order={3}>Weave Configuration</Title>
          <Button
            component={Link}
            href={`/app/deployments/${deploymentId}/flow`}
            rightSection={<IconArrowRight size={16} />}
          >
            Configure Flow
          </Button>
        </Stack>
      </Group>
    </Paper>
  );
}
