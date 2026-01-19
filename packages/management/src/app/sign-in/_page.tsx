'use client';

import { authClient } from '@lib/auth/auth-client';
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
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const karma = localFont({
  src: '../fonts/karma-suture.otf',
});

export function LoginClientPage({ error: initialError }: { error?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: '/app',
    });

    if (signInError) {
      setError(signInError.message || 'Invalid credentials');
      setLoading(false);
    } else {
      router.push('/app');
      router.refresh();
    }
  };

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
          <form onSubmit={handleSignIn}>
            <TextInput
              label="Email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="Password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button
              type="submit"
              mt="md"
              fullWidth
              loading={loading}
              data-umami-event="login-submit"
            >
              Login
            </Button>
          </form>
        </Stack>
      </Paper>
      <Paper className="is-half-size" mt="md" w={400}>
        <Stack>
          <Button
            component="a"
            href="/sign-up"
            variant="subtle"
            fullWidth
            data-umami-event="login-navigate-to-signup"
          >
            Don&apos;t have an account? Sign up
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
