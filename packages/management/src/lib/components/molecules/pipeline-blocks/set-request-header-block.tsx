import type { WeaveSetRequestHeaderAction } from '@genie-nexus/types';
import { Group, TextInput } from '@mantine/core';

export function SetRequestHeaderBlock({
  action,
  onChange,
}: {
  action: WeaveSetRequestHeaderAction;
  onChange: (a: WeaveSetRequestHeaderAction) => void;
}) {
  return (
    <Group grow>
      <TextInput
        label="Key"
        value={action.key}
        onChange={(e) => onChange({ ...action, key: e.currentTarget.value })}
      />
      <TextInput
        label="Value"
        value={action.value}
        onChange={(e) => onChange({ ...action, value: e.currentTarget.value })}
      />
    </Group>
  );
}
