import type { LlmUpdateModelAction } from '@genie-nexus/types';
import { TextInput } from '@mantine/core';

type UpdateModelBlockProps = {
  action: LlmUpdateModelAction;
  onChange: (action: LlmUpdateModelAction) => void;
};

export function UpdateModelBlock({ action, onChange }: UpdateModelBlockProps) {
  return (
    <TextInput
      label="Model Name"
      value={action.modelName}
      onChange={(e) => onChange({ ...action, modelName: e.target.value })}
      placeholder="Enter model name"
    />
  );
}
