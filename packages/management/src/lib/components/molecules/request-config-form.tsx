import { Group, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export type RequestConfigFormValues = {
  method: string;
  url: string;
  timeout: number;
};

type Properties = {
  value: RequestConfigFormValues;
  onChange: (value: RequestConfigFormValues) => void;
};

const METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'OPTIONS', label: 'OPTIONS' },
];

export function RequestConfigForm({ value, onChange }: Properties) {
  const form = useForm<RequestConfigFormValues>({
    initialValues: value,
    validate: {
      url: (v) => (!v ? 'URL is required' : null),
      timeout: (v) => (v < 100 ? 'Timeout too low' : null),
    },
  });

  return (
    <Group align="end" grow>
      <Select
        label="Method"
        data={METHODS}
        required
        value={form.values.method}
        onChange={(v) => {
          form.setFieldValue('method', v || 'GET');
          onChange({ ...form.values, method: v || 'GET' });
        }}
      />
      <TextInput
        label="URL"
        placeholder="https://api.example.com/data"
        required
        value={form.values.url}
        onChange={(e) => {
          form.setFieldValue('url', e.currentTarget.value);
          onChange({ ...form.values, url: e.currentTarget.value });
        }}
      />
      <NumberInput
        label="Timeout (ms)"
        min={100}
        max={60000}
        required
        value={form.values.timeout}
        onChange={(v) => {
          form.setFieldValue('timeout', Number(v));
          onChange({ ...form.values, timeout: Number(v) });
        }}
      />
    </Group>
  );
}
