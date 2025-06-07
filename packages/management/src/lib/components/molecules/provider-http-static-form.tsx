import type { WeaveHttpStaticProvider } from '@genie-nexus/types';
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons-react';

type FormValues = Pick<
  WeaveHttpStaticProvider,
  'statusCode' | 'body' | 'responseHeaders'
>;

type Properties = {
  provider: WeaveHttpStaticProvider;
  submit: (values: FormValues) => Promise<void>;
};

export function ProviderHttpStaticForm({ provider, submit }: Properties) {
  const form = useForm<FormValues>({
    initialValues: {
      responseHeaders: provider.responseHeaders ?? [],
      body: provider.body ?? '',
      statusCode: provider.statusCode ?? 200,
    },
    validate: {
      statusCode: (value) =>
        value && value < 100 ? 'Status code must be at least 100' : null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await submit(values);
  };

  const addHeader = () => {
    form.setFieldValue('responseHeaders', [
      ...(form.values.responseHeaders ?? []),
      { key: '', operation: 'set', value: '' },
    ]);
  };

  const removeHeader = (index: number) => {
    form.setFieldValue(
      'responseHeaders',
      (form.values.responseHeaders ?? []).filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <NumberInput
          label="Status Code"
          placeholder="Enter status code"
          min={100}
          {...form.getInputProps('statusCode')}
        />
        <Textarea
          label="Response Body"
          placeholder="Enter response body"
          minRows={4}
          {...form.getInputProps('body')}
        />

        <Paper withBorder p="md">
          <Group justify="space-between" mb="md">
            <Title order={3}>Response Headers</Title>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={addHeader}
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
                <Select
                  placeholder="Operation"
                  data={[
                    { value: 'set', label: 'Set' },
                    { value: 'add', label: 'Add' },
                    { value: 'remove', label: 'Remove' },
                  ]}
                  style={{ width: 120 }}
                  {...form.getInputProps(`responseHeaders.${index}.operation`)}
                />
                <TextInput
                  placeholder="Value"
                  style={{ flex: 1 }}
                  {...form.getInputProps(`responseHeaders.${index}.value`)}
                />
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeHeader(index)}
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
