import type { WeaveRemoveResponseHeaderAction } from '@genie-nexus/types';
import { TextInput } from '@mantine/core';

export function RemoveResponseHeaderBlock({
  action,
  onChange,
}: {
  action: WeaveRemoveResponseHeaderAction;
  onChange: (a: WeaveRemoveResponseHeaderAction) => void;
}) {
  return (
    <TextInput
      label="Key"
      value={action.key}
      onChange={(e) => onChange({ ...action, key: e.currentTarget.value })}
    />
  );
}
