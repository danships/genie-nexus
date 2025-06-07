import type { RemoveRequestHeaderAction } from '@genie-nexus/types';
import { TextInput } from '@mantine/core';

export function RemoveRequestHeaderBlock({
  action,
  onChange,
}: {
  action: RemoveRequestHeaderAction;
  onChange: (a: RemoveRequestHeaderAction) => void;
}) {
  return (
    <TextInput
      label="Key"
      value={action.key}
      onChange={(e) => onChange({ ...action, key: e.currentTarget.value })}
    />
  );
}
