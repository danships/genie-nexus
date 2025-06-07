import type { UpdateResponseBodyAction } from '@genie-nexus/types';
import { TextInput } from '@mantine/core';

export function UpdateResponseBodyBlock({
  action,
  onChange,
}: {
  action: UpdateResponseBodyAction;
  onChange: (a: UpdateResponseBodyAction) => void;
}) {
  return (
    <TextInput
      label="Body Value"
      value={action.value}
      onChange={(e) => onChange({ ...action, value: e.currentTarget.value })}
    />
  );
}
