import type { SetRequestHeaderAction } from '@genie-nexus/types';
import { Group, TextInput } from '@mantine/core';
import React from 'react';

export function SetRequestHeaderBlock({
  action,
  onChange,
}: {
  action: SetRequestHeaderAction;
  onChange: (a: SetRequestHeaderAction) => void;
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
