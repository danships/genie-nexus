import { TextInput } from '@mantine/core';
import React from 'react';

export function TransformDataBlock({
  action,
  onChange,
}: {
  action: { type: 'transformData'; expression: string };
  onChange: (a: { type: 'transformData'; expression: string }) => void;
}) {
  return (
    <TextInput
      label="Expression"
      value={action.expression}
      onChange={(e) =>
        onChange({ ...action, expression: e.currentTarget.value })
      }
    />
  );
}
