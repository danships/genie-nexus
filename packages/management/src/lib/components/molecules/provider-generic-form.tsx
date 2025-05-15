import { TextInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

type FormValues = {
  name: string;
};

type Properties = {
  name: string;
  submit: (values: FormValues) => Promise<void>;
};

export function ProviderGenericForm({ name, submit }: Properties) {
  const form = useForm<FormValues>({
    initialValues: {
      name,
    },
    validate: {
      name: (value) =>
        value.trim().length < 2 ? 'Name must be at least 2 characters' : null,
    },
  });

  const handleSubmit = (values: FormValues) => {
    void submit(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Enter name"
          required
          {...form.getInputProps('name')}
        />
        <Button type="submit">Save</Button>
      </Stack>
    </form>
  );
}
