'use client';

import { ErrorNotification } from '@lib/components/atoms/error-notification';
import { PageTitle } from '@lib/components/atoms/page-title';
import { useChangeData } from '@lib/hooks/use-change-data';
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { doSignUp } from './_actions';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  newsletter: boolean;
};

export function SignUpClientPage() {
  const router = useRouter();
  const { inProgress, error, changeData } = useChangeData();

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      newsletter: false,
    },
    validate: {
      acceptTerms: (value) =>
        !value ? 'You must accept the terms and conditions' : null,
    },
  });

  const doSubmit = async (values: FormValues) => {
    if (values.password !== values.confirmPassword) {
      form.setErrors({
        confirmPassword: 'Your passwords do not match',
      });
      return;
    }

    await changeData(async () => {
      await doSignUp(
        values.name,
        values.email,
        values.password,
        values.newsletter
      );
      router.push('/sign-in');
    });
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(doSubmit)}>
        <PageTitle>Sign Up</PageTitle>

        <Paper withBorder p="md" className="is-half-size">
          <Stack>
            {error && <ErrorNotification>{error}</ErrorNotification>}
            <TextInput label="Name" {...form.getInputProps('name')} />
            <TextInput
              label="Email"
              type="email"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Your password"
              required
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label="Confirm Password"
              required
              {...form.getInputProps('confirmPassword')}
            />
            <Checkbox
              required
              label={
                <Text size="sm">
                  I accept the Genie Nexus{' '}
                  <Anchor
                    href="https://www.gnxs.io/pages/terms?ref=sh-sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms & Conditions
                  </Anchor>{' '}
                  and{' '}
                  <Anchor
                    href="https://www.gnxs.io/pages/privacy?ref=sh-sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Anchor>
                </Text>
              }
              {...form.getInputProps('acceptTerms', { type: 'checkbox' })}
            />
            <Checkbox
              label={
                <Text size="sm">
                  I want to subscribe to the Genie Nexus newsletter (to get
                  product updates, tips, and exclusive offers)
                </Text>
              }
              {...form.getInputProps('newsletter', { type: 'checkbox' })}
            />
            {error && <ErrorNotification>{error}</ErrorNotification>}
            <Button
              type="submit"
              loading={inProgress}
              data-umami-event="signup-submit"
            >
              Sign Up
            </Button>
          </Stack>
        </Paper>
      </form>
      <Paper className="is-half-size" mt="md">
        <Stack>
          <Button
            component="a"
            href="/sign-in"
            variant="subtle"
            data-umami-event="signup-navigate-to-signin"
          >
            Already have an account? Sign in
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
