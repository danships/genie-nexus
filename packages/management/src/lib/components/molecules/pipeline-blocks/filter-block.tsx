import { TextInput } from '@mantine/core';

export function FilterBlock({
  action,
  onChange,
}: {
  action: { type: 'filter'; expression: string };
  onChange: (a: { type: 'filter'; expression: string }) => void;
}) {
  return (
    <TextInput
      label="Filter Expression"
      value={action.expression}
      onChange={(e) =>
        onChange({ ...action, expression: e.currentTarget.value })
      }
    />
  );
}
