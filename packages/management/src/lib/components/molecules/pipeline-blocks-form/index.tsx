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
import type { Action, Condition, FlowStep } from '@genie-nexus/types';
import { Button, Code, Group, Paper, Stack, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { AddRequestHeaderBlock } from '../pipeline-blocks/add-request-header-block';
import { AddResponseHeaderBlock } from '../pipeline-blocks/add-response-header-block';
import { DelayBlock } from '../pipeline-blocks/delay-block';
import { FilterBlock } from '../pipeline-blocks/filter-block';
import { LogBlock } from '../pipeline-blocks/log-block';
import { RemoveRequestHeaderBlock } from '../pipeline-blocks/remove-request-header-block';
import { RemoveResponseHeaderBlock } from '../pipeline-blocks/remove-response-header-block';
import { SetProviderBlock } from '../pipeline-blocks/set-provider-block';
import { SetRequestHeaderBlock } from '../pipeline-blocks/set-request-header-block';
import { SetResponseHeaderBlock } from '../pipeline-blocks/set-response-header-block';
import { TransformDataBlock } from '../pipeline-blocks/transform-data-block';
import { UpdateResponseBodyBlock } from '../pipeline-blocks/update-response-body-block';
import { UpdateResponseStatusCodeBlock } from '../pipeline-blocks/update-response-status-code-block';
import { AddBlockModal } from './add-block-modal';
import { ConditionEditor } from './condition-editor';
import { SortableBlock } from './sortable-block';
import { getActionLabel } from './types';

type PipelineBlocksFormProps = {
  steps: FlowStep[];
  onChange: (steps: FlowStep[]) => void;
  eventType: 'request' | 'response';
};

export function PipelineBlocksForm({
  steps,
  onChange,
  eventType,
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
      onChange(arrayMove(steps, oldIndex, newIndex));
    }
  };

  const handleBlockChange = (idx: number, action: Action) => {
    const newSteps = [...steps];
    const step = newSteps[idx];
    if (!step) return;
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
    onChange(newSteps);
  };

  const handleDelete = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    onChange(newSteps);
  };

  const handleAdd = (type: Action['type']) => {
    let action: Action;
    switch (type) {
      case 'addRequestHeader':
        action = { type, key: '', value: '' };
        break;
      case 'removeRequestHeader':
        action = { type, key: '' };
        break;
      case 'setRequestHeader':
        action = { type, key: '', value: '' };
        break;
      case 'addResponseHeader':
        action = { type, key: '', value: '' };
        break;
      case 'removeResponseHeader':
        action = { type, key: '' };
        break;
      case 'setResponseHeader':
        action = { type, key: '', value: '' };
        break;
      case 'updateResponseBody':
        action = { type, value: '' };
        break;
      case 'updateResponseStatusCode':
        action = { type, value: '' };
        break;
      case 'transformData':
        action = { type, expression: '' };
        break;
      case 'filter':
        action = { type, expression: '' };
        break;
      case 'delay':
        action = { type, ms: 1000 };
        break;
      case 'log':
        action = { type, message: '' };
        break;
      case 'setProvider':
        action = { type, providerId: '' };
        break;
    }

    const newStep: FlowStep = {
      id: crypto.randomUUID(),
      action,
    };
    onChange([...steps, newStep]);
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
                      case 'setProvider':
                        return (
                          <SetProviderBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      default:
                        return (
                          <Text c="dimmed">
                            No editable fields for this action.
                          </Text>
                        );
                    }
                  })()}
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
      />
    </Stack>
  );
}
