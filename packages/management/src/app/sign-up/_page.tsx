'use client';

import { authClient } from '@lib/auth/auth-client';
import { PageTitle } from '@lib/components/atoms/page-title';
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUpClientPage() {
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

    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    });
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(doSubmit)}>
        <PageTitle>Sign Up</PageTitle>
        <SimpleGrid cols={2}>
          <Paper withBorder p="md">
            <Stack>
              <TextInput
                label="Name"
                required
                {...form.getInputProps('name')}
              />
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
              <Button type="submit">Sign Up</Button>
            </Stack>
          </Paper>
        </SimpleGrid>
      </form>
    </Container>
  );
}
