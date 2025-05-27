'use client';

import { PageTitle } from '@lib/components/atoms/page-title';
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { doSignUp } from './_actions';
import { useRouter } from 'next/navigation';
import { ErrorNotification } from '@lib/components/atoms/error-notification';
import { useChangeData } from '@lib/hooks/use-change-data';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
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
      await doSignUp(values.name, values.email, values.password);
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
            {error && <ErrorNotification>{error}</ErrorNotification>}
            <Button type="submit" loading={inProgress}>
              Sign Up
            </Button>
          </Stack>
        </Paper>
      </form>
      <Paper className="is-half-size" mt="md">
        <Stack>
          <Button component="a" href="/sign-in" variant="subtle">
            Already have an account? Sign in
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
