import { OpenAIProvider } from '@genie-nexus/types';
import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

type FormValues = {
  baseURL: string;
  apiKey?: string;
};

type Properties = {
  provider: OpenAIProvider;
  submit: (values: { baseURL: string; apiKey?: string }) => Promise<void>;
};

export function ProviderOpenAIForm({ provider, submit }: Properties) {
  const form = useForm<FormValues>({
    initialValues: {
      apiKey: provider.apiKey,
      baseURL: provider.baseURL,
    },
    validate: {
      baseURL: (value) => {
        try {
          new URL(value);
          return null;
        } catch {
          return 'Invalid URL';
        }
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (values.apiKey === '') {
      // Only override the apiKey when it changes
      delete values['apiKey'];
    }
    await submit(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="API Key"
          placeholder="Enter OpenAI API key to replace the existing one"
          type="password"
          {...form.getInputProps('apiKey')}
        />

        <TextInput
          label="Base URL (your Model Provider should supply this)"
          placeholder="Enter base URL (e.g. https://api.openai.com/v1)"
          required
          {...form.getInputProps('baseURL')}
        />

        <Button type="submit">Save</Button>
      </Stack>
    </form>
  );
}
