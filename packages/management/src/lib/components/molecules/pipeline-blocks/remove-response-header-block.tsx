import type { RemoveResponseHeaderAction } from '@genie-nexus/types';
import { TextInput } from '@mantine/core';

export function RemoveResponseHeaderBlock({
  action,
  onChange,
}: {
  action: RemoveResponseHeaderAction;
  onChange: (a: RemoveResponseHeaderAction) => void;
}) {
  return (
    <TextInput
      label="Key"
      value={action.key}
      onChange={(e) => onChange({ ...action, key: e.currentTarget.value })}
    />
  );
}
