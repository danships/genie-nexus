import type { LlmUpdatePromptAction } from '@genie-nexus/types';
import { Select, Textarea } from '@mantine/core';

type UpdatePromptBlockProps = {
  action: LlmUpdatePromptAction;
  onChange: (action: LlmUpdatePromptAction) => void;
};

export function UpdatePromptBlock({
  action,
  onChange,
}: UpdatePromptBlockProps) {
  return (
    <>
      <Select
        label="What to update"
        value={action.what}
        onChange={(value) =>
          onChange({ ...action, what: value as 'prompt' | 'systemPrompt' })
        }
        data={[
          { value: 'prompt', label: 'User Prompt' },
          { value: 'systemPrompt', label: 'System Prompt' },
        ]}
      />
      <Textarea
        label="Value"
        value={action.value}
        onChange={(e) => onChange({ ...action, value: e.target.value })}
        placeholder="Enter prompt value"
        minRows={3}
      />
    </>
  );
}
