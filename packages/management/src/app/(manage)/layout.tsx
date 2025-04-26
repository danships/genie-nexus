'use client';
import { SwrDefaultApiConfig } from '@lib/api/swr-config';
import { AppShell, Group, Text, UnstyledButton } from '@mantine/core';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SwrDefaultApiConfig
      customOptions={{
        baseURL: process.env['NEXT_PUBLIC_API_BASE_URL'] ?? '/api/v1',
      }}
    >
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <UnstyledButton component={Link} href="/deployments">
                <Text fw={500}>Deployments</Text>
              </UnstyledButton>
              <UnstyledButton component={Link} href="/providers">
                <Text fw={500}>Providers</Text>
              </UnstyledButton>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </SwrDefaultApiConfig>
  );
}
