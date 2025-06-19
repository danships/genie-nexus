import type { WeaveUpdateResponseStatusCodeAction } from '@genie-nexus/types';
import { TextInput } from '@mantine/core';

export function UpdateResponseStatusCodeBlock({
  action,
  onChange,
}: {
  action: WeaveUpdateResponseStatusCodeAction;
  onChange: (a: WeaveUpdateResponseStatusCodeAction) => void;
}) {
  return (
    <TextInput
      label="Status Code"
      value={action.value}
      onChange={(e) =>
        onChange({ ...action, value: Number.parseInt(e.currentTarget.value) })
      }
    />
  );
}
