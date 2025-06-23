import type { LlmAction } from '@genie-nexus/types';
import { Text } from '@mantine/core';
import { LogBlock } from '../pipeline-blocks/log-block';
import { SetProviderBlock } from '../pipeline-blocks/set-provider-block';
import { UpdateModelBlock } from '../pipeline-blocks/update-model-block';
import { UpdatePromptBlock } from '../pipeline-blocks/update-prompt-block';

type Properties = {
  action: LlmAction;
  onChange: (action: LlmAction) => void;
};

export function LlmAction({ action, onChange }: Properties) {
  switch (action.type) {
    case 'updateModel':
      return <UpdateModelBlock action={action} onChange={onChange} />;
    case 'updatePrompt':
      return <UpdatePromptBlock action={action} onChange={onChange} />;
    case 'log':
      return <LogBlock action={action} onChange={onChange} />;
    case 'setProvider':
      return <SetProviderBlock action={action} onChange={onChange} />;
    default:
      return <Text c="dimmed">No editable fields for this action.</Text>;
  }
}
