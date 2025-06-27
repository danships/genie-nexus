'use client';

import { ErrorNotification } from '@lib/components/atoms/error-notification';
import { PageTitle } from '@lib/components/atoms/page-title';
import {
  Button,
  Container,
  Group,
  Image,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { getCsrfToken } from 'next-auth/react';
import localFont from 'next/font/local';
import { useState } from 'react';
import { useEffect } from 'react';

const karma = localFont({
  src: '../fonts/karma-suture.otf',
});

export function LoginClientPage({ error }: { error?: string }) {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    void (async () => {
      const csrfToken = await getCsrfToken();
      setCsrfToken(csrfToken);
    })();
  }, []);

  return (
    <Container
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Group gap="md" mb="xl">
        <Image src="/icons/genie-nexus.svg" alt="Genie Nexus" w={48} h={48} />
        <PageTitle className={karma.className}>login</PageTitle>
      </Group>
      <Paper className="is-half-size" w={400}>
        {error && <ErrorNotification>{error}</ErrorNotification>}
        <Stack>
          <form method="post" action="/api/auth/callback/credentials">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <TextInput label="Email" type="email" name="email" required />
            <PasswordInput label="Password" name="password" required />
            <Button type="submit" mt="md" fullWidth>
              Login
            </Button>
          </form>
        </Stack>
      </Paper>
      <Paper className="is-half-size" mt="md" w={400}>
        <Stack>
          <Button component="a" href="/sign-up" variant="subtle" fullWidth>
            Don&apos;t have an account? Sign up
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
