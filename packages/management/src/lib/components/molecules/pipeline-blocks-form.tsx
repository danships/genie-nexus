import { FlowStep } from '@genie-nexus/types';
import {
  ActionIcon,
  Button,
  Code,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { IconGripVertical, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  IconCheck,
  IconClock,
  IconFilter,
  IconListDetails,
  IconTransform,
} from '@tabler/icons-react';
import { useState } from 'react';
import { AddRequestHeaderBlock } from './pipeline-blocks/add-request-header-block';
import { AddResponseHeaderBlock } from './pipeline-blocks/add-response-header-block';
import { DelayBlock } from './pipeline-blocks/delay-block';
import { FilterBlock } from './pipeline-blocks/filter-block';
import { LogBlock } from './pipeline-blocks/log-block';
import { RemoveRequestHeaderBlock } from './pipeline-blocks/remove-request-header-block';
import { RemoveResponseHeaderBlock } from './pipeline-blocks/remove-response-header-block';
import { SetRequestHeaderBlock } from './pipeline-blocks/set-request-header-block';
import { SetResponseHeaderBlock } from './pipeline-blocks/set-response-header-block';
import { TransformDataBlock } from './pipeline-blocks/transform-data-block';
import { UpdateResponseBodyBlock } from './pipeline-blocks/update-response-body-block';
import { UpdateResponseStatusCodeBlock } from './pipeline-blocks/update-response-status-code-block';

// Helper to get a user-friendly label for each action type
const ACTION_LABELS: Record<string, string> = {
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
};

function getActionLabel(type: string) {
  return ACTION_LABELS[type] || type;
}

// --- Main PipelineBlocksForm ---

type PipelineBlocksFormProps = {
  steps: FlowStep[];
  onChange: (steps: FlowStep[]) => void;
};

const buildingBlocks = [
  { label: 'Transform Data', icon: IconTransform, type: 'transformData' },
  { label: 'Validate', icon: IconCheck, type: 'validate' },
  { label: 'Filter', icon: IconFilter, type: 'filter' },
  { label: 'Add Delay', icon: IconClock, type: 'delay' },
  { label: 'Log Data', icon: IconListDetails, type: 'log' },
];

export function PipelineBlocksForm({
  steps,
  onChange,
}: PipelineBlocksFormProps) {
  const [modalOpened, setModalOpened] = useState(false);

  // Edit a block
  const handleBlockChange = (idx: number, action: FlowStep['action']) => {
    const newSteps = [...steps];
    newSteps[idx] = { action };
    onChange(newSteps);
  };

  const handleDelete = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const handleAdd = (type: string) => {
    let newStep: FlowStep;
    switch (type) {
      case 'transformData':
        newStep = { action: { type: 'transformData', expression: '' } };
        break;
      case 'filter':
        newStep = { action: { type: 'filter', expression: '' } };
        break;
      case 'delay':
        newStep = { action: { type: 'delay', ms: 1000 } };
        break;
      case 'log':
        newStep = { action: { type: 'log', message: '' } };
        break;
      default:
        newStep = { action: { type: 'updateResponseBody', value: '' } };
    }
    onChange([...steps, newStep]);
    setModalOpened(false);
  };

  return (
    <Stack>
      {steps.map((step, index) => (
        <Paper key={index} p="sm" withBorder>
          <Group justify="space-between" align="center" mb="xs">
            <Group>
              <IconGripVertical size={18} />
              <Text fw={500}>{getActionLabel(step.action.type)}</Text>
              <Code ml="sm">{step.action.type}</Code>
            </Group>
            <Button
              variant="subtle"
              color="red"
              onClick={() => handleDelete(index)}
            >
              Delete
            </Button>
          </Group>
          {/* Render the correct block form */}
          {(() => {
            switch (step.action.type) {
              case 'addRequestHeader':
                return (
                  <AddRequestHeaderBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'removeRequestHeader':
                return (
                  <RemoveRequestHeaderBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'setRequestHeader':
                return (
                  <SetRequestHeaderBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'addResponseHeader':
                return (
                  <AddResponseHeaderBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'removeResponseHeader':
                return (
                  <RemoveResponseHeaderBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'setResponseHeader':
                return (
                  <SetResponseHeaderBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'updateResponseBody':
                return (
                  <UpdateResponseBodyBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'updateResponseStatusCode':
                return (
                  <UpdateResponseStatusCodeBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'transformData':
                return (
                  <TransformDataBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'filter':
                return (
                  <FilterBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'delay':
                return (
                  <DelayBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              case 'log':
                return (
                  <LogBlock
                    action={step.action}
                    onChange={(a) => handleBlockChange(index, a)}
                  />
                );
              default:
                return (
                  <Text c="dimmed">No editable fields for this action.</Text>
                );
            }
          })()}
        </Paper>
      ))}
      <Button
        leftSection={<IconPlus size={16} />}
        variant="light"
        onClick={() => setModalOpened(true)}
      >
        Add Block
      </Button>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Select Block Type"
        size="md"
      >
        <Stack>
          <Text size="sm">Select the type of block to add:</Text>
          {buildingBlocks.map((block) => (
            <Button
              key={block.type}
              leftSection={<block.icon size={16} />}
              variant="light"
              onClick={() => handleAdd(block.type)}
            >
              {block.label}
            </Button>
          ))}
        </Stack>
      </Modal>
    </Stack>
  );
}
