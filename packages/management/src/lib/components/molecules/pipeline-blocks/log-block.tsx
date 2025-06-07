import { TextInput } from '@mantine/core';

export function LogBlock({
  action,
  onChange,
}: {
  action: { type: 'log'; message?: string | undefined };
  onChange: (a: { type: 'log'; message?: string | undefined }) => void;
}) {
  return (
    <TextInput
      label="Log Message"
      value={action.message || ''}
      onChange={(e) => onChange({ ...action, message: e.currentTarget.value })}
    />
  );
}
