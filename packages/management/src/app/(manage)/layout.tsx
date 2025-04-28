'use client';
import { SwrDefaultApiConfig } from '@lib/api/swr-config';
import { AppShell, Group, Text, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { SessionProvider, useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  useEffect(() => {
    if (!session?.data?.user) {
      void signIn();
      return;
    }
  }, [session]);

  return (
    <SessionProvider>
      <SwrDefaultApiConfig
        customOptions={{
          baseURL: '/api/v1',
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
    </SessionProvider>
  );
};

export default function LayoutWithSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
}
