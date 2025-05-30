'use client';

import { ErrorNotification } from '@lib/components/atoms/error-notification';
import { PageTitle } from '@lib/components/atoms/page-title';
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { getCsrfToken } from 'next-auth/react';
import { useState } from 'react';
import { useEffect } from 'react';

export function LoginClientPage({ error }: { error?: string }) {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    void (async () => {
      const csrfToken = await getCsrfToken();
      setCsrfToken(csrfToken);
    })();
  }, []);

  return (
    <Container>
      <PageTitle>Login</PageTitle>
      <Paper className="is-half-size">
        {error && <ErrorNotification>{error}</ErrorNotification>}
        <Stack>
          <form method="post" action="/api/auth/callback/credentials">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <TextInput label="Email" type="email" name="email" required />
            <PasswordInput label="Password" name="password" required />
            <Button type="submit" mt="md">
              Login
            </Button>
          </form>
        </Stack>
      </Paper>
      <Paper className="is-half-size" mt="md">
        <Stack>
          <Button component="a" href="/sign-up" variant="subtle">
            Don&quot;t have an account? Sign up
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
