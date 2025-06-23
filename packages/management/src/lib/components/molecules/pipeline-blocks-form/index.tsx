import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type {
  WeaveAction as WeaveActionType,
  Condition,
  WeaveFlowStep,
  LlmFlowStep,
  LlmAction as LlmActionType,
  WeaveAddRequestHeaderAction,
  WeaveRemoveRequestHeaderAction,
  WeaveSetRequestHeaderAction,
  WeaveAddResponseHeaderAction,
  WeaveRemoveResponseHeaderAction,
  WeaveSetResponseHeaderAction,
  WeaveUpdateResponseStatusCodeAction,
  WeaveUpdateResponseBodyAction,
  WeaveTransformDataAction,
  WeaveFilterAction,
  WeaveDelayAction,
  LogAction,
  SetProviderAction,
  LlmUpdatePromptAction,
  LlmUpdateModelAction,
} from '@genie-nexus/types';
import { Button, Code, Group, Paper, Stack, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { AddBlockModal } from './add-block-modal';
import { ConditionEditor } from './condition-editor';
import { SortableBlock } from './sortable-block';
import { getActionLabel } from './types';
import { generateRandomId } from '@lib/core/generate-random-id';
import { WeaveAction } from './weave-action';
import { LlmAction } from './llm-action';

type PipelineBlocksFormProps = {
  steps: WeaveFlowStep[] | LlmFlowStep[];
  onChange: (steps: WeaveFlowStep[] | LlmFlowStep[]) => void;
  eventType: 'request' | 'response';
  flowType: 'weave' | 'llm';
};

export function PipelineBlocksForm({
  steps,
  onChange,
  eventType,
  flowType,
}: PipelineBlocksFormProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      // @ts-expect-error, either weave or llm step
      onChange(arrayMove(steps, oldIndex, newIndex));
    }
  };

  const handleBlockChange = (
    idx: number,
    action: WeaveActionType | LlmActionType
  ) => {
    const newSteps: WeaveFlowStep[] | LlmFlowStep[] = [...steps] as
      | WeaveFlowStep[]
      | LlmFlowStep[];
    const step = newSteps[idx];
    if (!step) {
      return;
    }
    // @ts-expect-error, either weave or llm step
    newSteps[idx] = {
      ...step,
      action,
    };
    onChange(newSteps);
  };

  const handleConditionChange = (
    idx: number,
    conditions: Condition[] | undefined
  ) => {
    const newSteps = [...steps];
    const step = newSteps[idx];
    if (!step) return;
    newSteps[idx] = {
      ...step,
      conditions,
    };
    onChange(newSteps as WeaveFlowStep[] | LlmFlowStep[]);
  };

  const handleDelete = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    onChange(newSteps as WeaveFlowStep[] | LlmFlowStep[]);
  };

  const handleAddWeave = (type: WeaveActionType['type']) => {
    let action: WeaveActionType;
    switch (type) {
      case 'addRequestHeader':
        action = {
          type,
          key: '',
          value: '',
        } satisfies WeaveAddRequestHeaderAction;
        break;
      case 'removeRequestHeader':
        action = { type, key: '' } satisfies WeaveRemoveRequestHeaderAction;
        break;
      case 'setRequestHeader':
        action = {
          type,
          key: '',
          value: '',
        } satisfies WeaveSetRequestHeaderAction;
        break;
      case 'addResponseHeader':
        action = {
          type,
          key: '',
          value: '',
        } satisfies WeaveAddResponseHeaderAction;
        break;
      case 'removeResponseHeader':
        action = { type, key: '' } satisfies WeaveRemoveResponseHeaderAction;
        break;
      case 'setResponseHeader':
        action = {
          type,
          key: '',
          value: '',
        } satisfies WeaveSetResponseHeaderAction;
        break;
      case 'updateResponseBody':
        action = { type, value: '' } satisfies WeaveUpdateResponseBodyAction;
        break;
      case 'updateResponseStatusCode':
        action = {
          type,
          value: 200,
        } satisfies WeaveUpdateResponseStatusCodeAction;
        break;
      case 'transformData':
        action = { type, expression: '' } satisfies WeaveTransformDataAction;
        break;
      case 'filter':
        action = { type, expression: '' } satisfies WeaveFilterAction;
        break;
      case 'delay':
        action = { type, ms: 1000 } satisfies WeaveDelayAction;
        break;
      case 'log':
        action = { type, message: '' } satisfies LogAction;
        break;
      case 'setProvider':
        action = { type, providerId: '' } satisfies SetProviderAction;
        break;
      default:
        return;
    }

    const newStep: WeaveFlowStep = {
      id: generateRandomId(),
      action,
    };
    onChange([...steps, newStep] as WeaveFlowStep[] | LlmFlowStep[]);
  };

  const handleAddLlm = (type: LlmActionType['type']) => {
    let action: LlmActionType;
    switch (type) {
      case 'log':
        action = { type, message: '' } satisfies LogAction;
        break;
      case 'setProvider':
        action = { type, providerId: '' } satisfies SetProviderAction;
        break;
      case 'updatePrompt':
        action = {
          type,
          what: 'prompt',
          value: '',
        } satisfies LlmUpdatePromptAction;
        break;
      case 'updateModel':
        action = {
          type,
          modelName: '',
        } satisfies LlmUpdateModelAction;
        break;
      default:
        return;
    }

    const newStep: LlmFlowStep = {
      id: generateRandomId(),
      action,
    };
    onChange([...steps, newStep] as WeaveFlowStep[] | LlmFlowStep[]);
  };

  const handleAdd = (type: WeaveActionType['type'] | LlmActionType['type']) => {
    if (flowType === 'weave') {
      handleAddWeave(type as WeaveActionType['type']);
      setShowAddModal(false);
      return;
    }

    handleAddLlm(type as LlmActionType['type']);
    setShowAddModal(false);
  };

  return (
    <Stack>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={steps.map((step) => step.id)}
          strategy={verticalListSortingStrategy}
        >
          {steps.map((step, index) => (
            <SortableBlock key={step.id} id={step.id}>
              <Paper p="md" withBorder style={{ flex: 1 }}>
                <Group justify="space-between" align="center" mb="xs">
                  <Group>
                    <Text fw={500}>{getActionLabel(step.action.type)}</Text>
                    <Code ml="sm">{step.action.type}</Code>
                  </Group>
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(index)}
                    leftSection={<IconTrash size={16} />}
                  >
                    Remove
                  </Button>
                </Group>
                <Stack>
                  <ConditionEditor
                    conditions={step.conditions}
                    onChange={(conditions) =>
                      handleConditionChange(index, conditions)
                    }
                  />
                  {flowType === 'weave' && (
                    <WeaveAction
                      action={step.action as WeaveActionType}
                      onChange={(a) => handleBlockChange(index, a)}
                    />
                  )}
                  {flowType === 'llm' && (
                    <LlmAction
                      action={step.action as LlmActionType}
                      onChange={(a) => handleBlockChange(index, a)}
                    />
                  )}
                </Stack>
              </Paper>
            </SortableBlock>
          ))}
        </SortableContext>
      </DndContext>

      <Button
        leftSection={<IconPlus size={16} />}
        variant="light"
        onClick={() => setShowAddModal(true)}
      >
        Add Block
      </Button>

      <AddBlockModal
        opened={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
        eventType={eventType}
        flowType={flowType}
      />
    </Stack>
  );
}
