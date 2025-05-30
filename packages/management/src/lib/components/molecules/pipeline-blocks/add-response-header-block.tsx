import type { AddResponseHeaderAction } from '@genie-nexus/types';
import { Group, TextInput } from '@mantine/core';
import React from 'react';

export function AddResponseHeaderBlock({
  action,
  onChange,
}: {
  action: AddResponseHeaderAction;
  onChange: (a: AddResponseHeaderAction) => void;
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
