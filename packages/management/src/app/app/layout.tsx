'use client';
import { SwrDefaultApiConfig } from '@lib/api/swr-config';
import { AppShell, Burger, Group } from '@mantine/core';
import Image from 'next/image';
import { Navbar } from '@lib/components/molecules/navbar';
import { useDisclosure } from '@mantine/hooks';
import { AnimatedBackground } from '@lib/components/molecules/animated-background';
import { ensureUserIsAuthenticated } from '@lib/auth/ensure-user-authenticated';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureUserIsAuthenticated();

  const [opened, { toggle }] = useDisclosure();

  return (
    <SwrDefaultApiConfig
      customOptions={{
        baseURL: '/api/v1',
      }}
    >
      <AnimatedBackground />
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
              priority
            />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Navbar />
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </SwrDefaultApiConfig>
  );
}
