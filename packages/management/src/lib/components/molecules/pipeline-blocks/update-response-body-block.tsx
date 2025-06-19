import type { WeaveUpdateResponseBodyAction } from '@genie-nexus/types';
import { TextInput } from '@mantine/core';

export function UpdateResponseBodyBlock({
  action,
  onChange,
}: {
  action: WeaveUpdateResponseBodyAction;
  onChange: (a: WeaveUpdateResponseBodyAction) => void;
}) {
  return (
    <TextInput
      label="Body Value"
      value={action.value}
      onChange={(e) => onChange({ ...action, value: e.currentTarget.value })}
    />
  );
}
