'use client';
import { SwrDefaultApiConfig } from '@lib/api/swr-config';
import type { AuthMethod } from '@lib/auth/types';
import { AnimatedBackground } from '@lib/components/molecules/animated-background';
import { Navbar } from '@lib/components/molecules/navbar';
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import Link from 'next/link';

const AppLayoutClient = ({
  children,
  authMethod,
}: {
  children: React.ReactNode;
  authMethod: AuthMethod;
}) => {
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
            <Link href="/app">
              <Image
                src="/icons/genie-nexus.svg"
                alt="Genie Nexus"
                width="48"
                height="48"
                priority
              />
            </Link>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Navbar authMethod={authMethod} />
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </SwrDefaultApiConfig>
  );
};

export default function LayoutWithSessionProvider({
  children,
  authMethod,
}: {
  children: React.ReactNode;
  authMethod: AuthMethod;
}) {
  return <AppLayoutClient authMethod={authMethod}>{children}</AppLayoutClient>;
}
