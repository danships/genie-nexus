'use client';

import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { PageTitle } from '@lib/components/atoms/page-title';
import { Button, Card, Stack, Text } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import { IconBrandGithub } from '@tabler/icons-react';

export const InsightsClientPage = disableSSR(function () {
  return (
    <Stack gap="lg">
      <PageTitle>Insights</PageTitle>

      <Card withBorder p="xl">
        <Stack align="center" gap="md">
          <IconChartBar size={48} color="var(--highlight-color)" />
          <Text size="xl" fw={600} ta="center">
            Insights Dashboard
          </Text>
          <Text c="dimmed" ta="center" maw={400}>
            This feature is currently under development. We&apos;re working on
            bringing you comprehensive analytics and insights about your
            deployments, usage patterns, and performance metrics.
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Check back soon for updates!
          </Text>
          <Button
            component="a"
            href="https://github.com/danships/genie-nexus"
            target="_blank"
            rel="noopener noreferrer"
            leftSection={<IconBrandGithub size={16} />}
            variant="light"
            data-umami-event="insights-github-link"
          >
            View on GitHub
          </Button>
          <Text size="xs" c="dimmed" ta="center" maw={400}>
            Have ideas or suggestions for this feature? We&apos;d love to hear
            from you! Visit our GitHub repository to share your thoughts and
            contribute to the development.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
});
