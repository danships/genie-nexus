import type { FlowAction } from '@genie-nexus/types';
import {
  IconBrain,
  IconCheck,
  IconClock,
  IconFilter,
  IconListDetails,
  IconMessage,
  IconTransform,
} from '@tabler/icons-react';

export type BlockType = {
  type: FlowAction['type'];
  label: string;
  icon: React.ComponentType<{ size: number }>;
  flows: Array<'weave' | 'llm'>;
  group: 'request' | 'response' | 'generic';
};

export const BLOCK_TYPES: BlockType[] = [
  // Request actions
  {
    type: 'addRequestHeader',
    label: 'Add Request Header',
    icon: IconCheck,
    flows: ['weave'],
    group: 'request',
  },
  {
    type: 'removeRequestHeader',
    label: 'Remove Request Header',
    icon: IconCheck,
    flows: ['weave'],
    group: 'request',
  },
  {
    type: 'setRequestHeader',
    label: 'Set Request Header',
    icon: IconCheck,
    flows: ['weave'],
    group: 'request',
  },

  // Response actions
  {
    type: 'addResponseHeader',
    label: 'Add Response Header',
    icon: IconCheck,
    flows: ['weave'],
    group: 'response',
  },
  {
    type: 'removeResponseHeader',
    label: 'Remove Response Header',
    icon: IconCheck,
    flows: ['weave'],
    group: 'response',
  },
  {
    type: 'setResponseHeader',
    label: 'Set Response Header',
    icon: IconCheck,
    flows: ['weave'],
    group: 'response',
  },
  {
    type: 'updateResponseBody',
    label: 'Update Response Body',
    icon: IconCheck,
    flows: ['weave'],
    group: 'response',
  },
  {
    type: 'updateResponseStatusCode',
    label: 'Update Response Status Code',
    icon: IconCheck,
    flows: ['weave'],
    group: 'response',
  },

  // Generic actions
  {
    type: 'transformData',
    label: 'Transform Data',
    icon: IconTransform,
    flows: ['weave'],
    group: 'generic',
  },
  {
    type: 'filter',
    label: 'Filter',
    icon: IconFilter,
    flows: ['weave'],
    group: 'generic',
  },
  {
    type: 'delay',
    label: 'Add Delay',
    icon: IconClock,
    flows: ['weave'],
    group: 'generic',
  },
  {
    type: 'log',
    label: 'Log Data',
    icon: IconListDetails,
    flows: ['weave', 'llm'],
    group: 'generic',
  },
  {
    type: 'setProvider',
    label: 'Set Provider',
    icon: IconCheck,
    flows: ['weave', 'llm'],
    group: 'request',
  },

  // LLM-specific actions
  {
    type: 'updateModel',
    label: 'Update Model',
    icon: IconBrain,
    flows: ['llm'],
    group: 'request',
  },
  {
    type: 'updatePrompt',
    label: 'Update Prompt',
    icon: IconMessage,
    flows: ['llm'],
    group: 'request',
  },
];

export const ACTION_LABELS: Record<string, string> = {
  addRequestHeader: 'Add Request Header',
  removeRequestHeader: 'Remove Request Header',
  setRequestHeader: 'Set Request Header',
  addResponseHeader: 'Add Response Header',
  removeResponseHeader: 'Remove Response Header',
  setResponseHeader: 'Set Response Header',
  updateResponseBody: 'Update Response Body',
  updateResponseStatusCode: 'Update Response Status Code',
  transformData: 'Transform Data',
  filter: 'Filter',
  delay: 'Add Delay',
  log: 'Log Data',
  setProvider: 'Set Provider',
  updateModel: 'Update Model',
  updatePrompt: 'Update Prompt',
};

export function getActionLabel(type: string) {
  return ACTION_LABELS[type] || type;
}
