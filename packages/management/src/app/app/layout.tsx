'use client';
import { SwrDefaultApiConfig } from '@lib/api/swr-config';
import { AppShell, Burger, Group } from '@mantine/core';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from '@lib/components/molecules/navbar';
import { useDisclosure } from '@mantine/hooks';
const Layout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  useEffect(() => {
    if (!session?.data?.user) {
      // TODO: remove this when auth is implemented
      // void signIn();
      return;
    }
  }, [session]);

  const [opened, { toggle }] = useDisclosure();

  return (
    <SessionProvider>
      <SwrDefaultApiConfig
        customOptions={{
          baseURL: '/api/v1',
        }}
      >
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 200,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Image
                src="/icons/genie-nexus.svg"
                alt="Genie Nexus"
                width="48"
                height="48"
              />
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p="md">
            <Navbar />
          </AppShell.Navbar>
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
