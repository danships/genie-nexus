import { GoogleProvider } from '@genie-nexus/types';
import { Button, PasswordInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

type Properties = {
  provider: GoogleProvider;
  submit: (values: { apiKey: string }) => Promise<void>;
};

export function ProviderGoogleForm({ provider, submit }: Properties) {
  const form = useForm({
    initialValues: {
      apiKey: provider.apiKey ?? '',
    },
  });

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <Stack>
        <PasswordInput
          label="API Key"
          placeholder="Enter your Google AI API key"
          description="Fill in to replace the current API key"
          {...form.getInputProps('apiKey')}
        />
        <Button type="submit" variant="light">
          Save
        </Button>
      </Stack>
    </form>
  );
}
