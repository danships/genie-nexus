import { Action, Condition, FlowStep } from '@genie-nexus/types';
import {
  IconCheck,
  IconClock,
  IconFilter,
  IconListDetails,
  IconTransform,
} from '@tabler/icons-react';

export type { Action, Condition, FlowStep };

export type BlockType = {
  type: Action['type'];
  label: string;
  icon: React.ComponentType<{ size: number }>;
  group: 'request' | 'response' | 'generic';
};

export const BLOCK_TYPES: BlockType[] = [
  // Request actions
  {
    type: 'addRequestHeader',
    label: 'Add Request Header',
    icon: IconCheck,
    group: 'request',
  },
  {
    type: 'removeRequestHeader',
    label: 'Remove Request Header',
    icon: IconCheck,
    group: 'request',
  },
  {
    type: 'setRequestHeader',
    label: 'Set Request Header',
    icon: IconCheck,
    group: 'request',
  },

  // Response actions
  {
    type: 'addResponseHeader',
    label: 'Add Response Header',
    icon: IconCheck,
    group: 'response',
  },
  {
    type: 'removeResponseHeader',
    label: 'Remove Response Header',
    icon: IconCheck,
    group: 'response',
  },
  {
    type: 'setResponseHeader',
    label: 'Set Response Header',
    icon: IconCheck,
    group: 'response',
  },
  {
    type: 'updateResponseBody',
    label: 'Update Response Body',
    icon: IconCheck,
    group: 'response',
  },
  {
    type: 'updateResponseStatusCode',
    label: 'Update Response Status Code',
    icon: IconCheck,
    group: 'response',
  },

  // Generic actions
  {
    type: 'transformData',
    label: 'Transform Data',
    icon: IconTransform,
    group: 'generic',
  },
  { type: 'filter', label: 'Filter', icon: IconFilter, group: 'generic' },
  { type: 'delay', label: 'Add Delay', icon: IconClock, group: 'generic' },
  { type: 'log', label: 'Log Data', icon: IconListDetails, group: 'generic' },
  {
    type: 'setProvider',
    label: 'Set Provider',
    icon: IconCheck,
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
};

export function getActionLabel(type: string) {
  return ACTION_LABELS[type] || type;
}
