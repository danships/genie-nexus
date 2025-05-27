import { WeaveHttpProxyProvider } from '@genie-nexus/types';
import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons-react';

type FormValues = Pick<
  WeaveHttpProxyProvider,
  'baseUrl' | 'requestHeaders' | 'responseHeaders'
>;

type Properties = {
  provider: WeaveHttpProxyProvider;
  submit: (values: FormValues) => Promise<void>;
};

export function ProviderHttpProxyForm({ provider, submit }: Properties) {
  const form = useForm<FormValues>({
    initialValues: {
      baseUrl: provider.baseUrl,
      requestHeaders: provider.requestHeaders ?? [],
      responseHeaders: provider.responseHeaders ?? [],
    },
    validate: {
      baseUrl: (value) => {
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
    await submit(values);
  };

  const addHeader = (type: 'requestHeaders' | 'responseHeaders') => {
    form.setFieldValue(type, [
      ...(form.values[type] ?? []),
      { key: '', operation: 'set', value: '' },
    ]);
  };

  const removeHeader = (
    type: 'requestHeaders' | 'responseHeaders',
    index: number
  ) => {
    form.setFieldValue(
      type,
      (form.values[type] ?? []).filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Base URL"
          placeholder="Enter base URL"
          {...form.getInputProps('baseUrl')}
        />

        <Paper withBorder p="md">
          <Group justify="space-between" mb="md">
            <Title order={3}>Request Headers</Title>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => addHeader('requestHeaders')}
              variant="light"
            >
              Add Header
            </Button>
          </Group>

          <Stack>
            {(form.values.requestHeaders ?? []).map((_, index) => (
              <Group key={index} align="flex-start">
                <TextInput
                  placeholder="Header Key"
                  style={{ flex: 1 }}
                  {...form.getInputProps(`requestHeaders.${index}.key`)}
                />
                <TextInput
                  placeholder="Value"
                  style={{ flex: 1 }}
                  {...form.getInputProps(`requestHeaders.${index}.value`)}
                />
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeHeader('requestHeaders', index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </Paper>

        <Paper withBorder p="md">
          <Group justify="space-between" mb="md">
            <Stack>
              <Title order={3}>Response Headers</Title>
              <Text size="sm" c="suppressed">
                Overwrite any of the returned response headers with your own
                value.
              </Text>
            </Stack>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => addHeader('responseHeaders')}
              variant="light"
            >
              Add Header
            </Button>
          </Group>

          <Stack>
            {(form.values.responseHeaders ?? []).map((_, index) => (
              <Group key={index} align="flex-start">
                <TextInput
                  placeholder="Header Key"
                  style={{ flex: 1 }}
                  {...form.getInputProps(`responseHeaders.${index}.key`)}
                />
                <TextInput
                  placeholder="Value"
                  style={{ flex: 1 }}
                  {...form.getInputProps(`responseHeaders.${index}.value`)}
                />
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeHeader('responseHeaders', index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </Paper>

        <Button type="submit">Save</Button>
      </Stack>
    </form>
  );
}
