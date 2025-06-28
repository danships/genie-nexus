'use client';

import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import localFont from 'next/font/local';
import Link from 'next/link';

const karma = localFont({
  src: './fonts/karma-suture.otf',
});

export function HomePageClient() {
  return (
    <Container size="lg" py="xl">
      <Stack align="center" gap="xl" mb={80}>
        <Title
          order={1}
          ta="center"
          size="3rem"
          lh={1.2}
          className={karma.className}
          c="cyan.3"
        >
          genie-nexus
        </Title>
        <Text size="xl" ta="center" c="dimmed" maw={600}>
          Route, transform, and adapt your API traffic with intelligent
          failover, rate limiting, and LLM-aware routing.
        </Text>
        <Group>
          <Button component={Link} href="/sign-in" size="lg" radius="md">
            Login
          </Button>
          <Button
            component={Link}
            href="/sign-up"
            variant="outline"
            size="lg"
            radius="md"
          >
            Sign Up
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
