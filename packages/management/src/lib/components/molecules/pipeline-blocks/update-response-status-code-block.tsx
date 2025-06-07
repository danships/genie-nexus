import type { UpdateResponseStatusCodeAction } from '@genie-nexus/types';
import { TextInput } from '@mantine/core';

export function UpdateResponseStatusCodeBlock({
  action,
  onChange,
}: {
  action: UpdateResponseStatusCodeAction;
  onChange: (a: UpdateResponseStatusCodeAction) => void;
}) {
  return (
    <TextInput
      label="Status Code"
      value={action.value}
      onChange={(e) => onChange({ ...action, value: e.currentTarget.value })}
    />
  );
}
