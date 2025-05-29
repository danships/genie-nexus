import { Condition, FlowStep, Action } from "@genie-nexus/types";
import {
  Button,
  Code,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Switch,
  ActionIcon,
} from "@mantine/core";
import { IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import {
  IconCheck,
  IconClock,
  IconFilter,
  IconListDetails,
  IconTransform,
} from "@tabler/icons-react";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AddRequestHeaderBlock } from "./pipeline-blocks/add-request-header-block";
import { AddResponseHeaderBlock } from "./pipeline-blocks/add-response-header-block";
import { DelayBlock } from "./pipeline-blocks/delay-block";
import { FilterBlock } from "./pipeline-blocks/filter-block";
import { LogBlock } from "./pipeline-blocks/log-block";
import { RemoveRequestHeaderBlock } from "./pipeline-blocks/remove-request-header-block";
import { RemoveResponseHeaderBlock } from "./pipeline-blocks/remove-response-header-block";
import { SetProviderBlock } from "./pipeline-blocks/set-provider-block";
import { SetRequestHeaderBlock } from "./pipeline-blocks/set-request-header-block";
import { SetResponseHeaderBlock } from "./pipeline-blocks/set-response-header-block";
import { TransformDataBlock } from "./pipeline-blocks/transform-data-block";
import { UpdateResponseBodyBlock } from "./pipeline-blocks/update-response-body-block";
import { UpdateResponseStatusCodeBlock } from "./pipeline-blocks/update-response-status-code-block";

// Helper to get a user-friendly label for each action type
const ACTION_LABELS: Record<string, string> = {
  addRequestHeader: "Add Request Header",
  removeRequestHeader: "Remove Request Header",
  setRequestHeader: "Set Request Header",
  addResponseHeader: "Add Response Header",
  removeResponseHeader: "Remove Response Header",
  setResponseHeader: "Set Response Header",
  updateResponseBody: "Update Response Body",
  updateResponseStatusCode: "Update Response Status Code",
  transformData: "Transform Data",
  filter: "Filter",
  delay: "Add Delay",
  log: "Log Data",
  setProvider: "Set Provider",
};

function getActionLabel(type: string) {
  return ACTION_LABELS[type] || type;
}

// Condition editor component
type ConditionEditorProps = {
  conditions: Condition[] | undefined;
  onChange: (conditions: Condition[] | undefined) => void;
};

function ConditionEditor({ conditions = [], onChange }: ConditionEditorProps) {
  const [showConditions, setShowConditions] = useState(!!conditions?.length);

  const handleTypeChange = (type: string, index: number) => {
    const newConditions = [...(conditions || [])];
    switch (type) {
      case "equals":
        newConditions[index] = {
          type: "equals" as const,
          field: "",
          value: "",
        };
        break;
      case "notEquals":
        newConditions[index] = {
          type: "notEquals" as const,
          field: "",
          value: "",
        };
        break;
      case "contains":
        newConditions[index] = {
          type: "contains" as const,
          field: "",
          value: "",
        };
        break;
      case "doesNotContain":
        newConditions[index] = {
          type: "doesNotContain" as const,
          field: "",
          value: "",
        };
        break;
      case "isEmpty":
        newConditions[index] = { type: "isEmpty" as const, field: "" };
        break;
      case "isNotEmpty":
        newConditions[index] = { type: "isNotEmpty" as const, field: "" };
        break;
    }
    onChange(newConditions);
  };

  const handleFieldChange = (field: string, index: number) => {
    const newConditions = [...(conditions || [])];
    const condition = newConditions[index];
    if (!condition) return;
    newConditions[index] = { ...condition, field };
    onChange(newConditions);
  };

  const handleValueChange = (value: string, index: number) => {
    const newConditions = [...(conditions || [])];
    const condition = newConditions[index];
    if (
      !condition ||
      condition.type === "isEmpty" ||
      condition.type === "isNotEmpty"
    )
      return;
    newConditions[index] = { ...condition, value };
    onChange(newConditions);
  };

  const handleAddCondition = () => {
    const newConditions = [
      ...(conditions || []),
      { type: "equals" as const, field: "", value: "" },
    ];
    onChange(newConditions);
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...(conditions || [])];
    newConditions.splice(index, 1);
    onChange(newConditions.length ? newConditions : undefined);
  };

  return (
    <Stack>
      <Group>
        <Switch
          label="Add conditions"
          checked={showConditions}
          onChange={(e) => {
            setShowConditions(e.currentTarget.checked);
            if (!e.currentTarget.checked) {
              onChange(undefined);
            } else if (!conditions?.length) {
              handleAddCondition();
            }
          }}
        />
      </Group>
      {showConditions && conditions && (
        <Stack>
          {conditions.map((condition, index) => (
            <Paper key={index} p="sm" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Condition {index + 1}</Text>
                <Button
                  variant="subtle"
                  color="red"
                  onClick={() => handleRemoveCondition(index)}
                >
                  Remove
                </Button>
              </Group>
              <Stack>
                <Select
                  label="Condition Type"
                  value={condition.type}
                  onChange={(value) => value && handleTypeChange(value, index)}
                  data={[
                    { value: "equals", label: "Equals" },
                    { value: "notEquals", label: "Not Equals" },
                    { value: "contains", label: "Contains" },
                    { value: "doesNotContain", label: "Does Not Contain" },
                    { value: "isEmpty", label: "Is Empty" },
                    { value: "isNotEmpty", label: "Is Not Empty" },
                  ]}
                />
                <TextInput
                  label="Field"
                  value={condition.field}
                  onChange={(e) =>
                    handleFieldChange(e.currentTarget.value, index)
                  }
                  placeholder="e.g. request.headers.content-type"
                />
                {condition.type !== "isEmpty" &&
                  condition.type !== "isNotEmpty" && (
                    <TextInput
                      label="Value"
                      value={condition.value}
                      onChange={(e) =>
                        handleValueChange(e.currentTarget.value, index)
                      }
                      placeholder="Value to compare against"
                    />
                  )}
              </Stack>
            </Paper>
          ))}
          <Button
            leftSection={<IconPlus size={16} />}
            variant="light"
            onClick={handleAddCondition}
          >
            Add Condition
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

// --- Main PipelineBlocksForm ---

type PipelineBlocksFormProps = {
  steps: FlowStep[];
  onChange: (steps: FlowStep[]) => void;
};

const BLOCK_TYPES: Array<{
  type: Action["type"];
  label: string;
  icon: React.ComponentType<{ size: number }>;
}> = [
  { type: "addRequestHeader", label: "Add Request Header", icon: IconCheck },
  {
    type: "removeRequestHeader",
    label: "Remove Request Header",
    icon: IconCheck,
  },
  { type: "setRequestHeader", label: "Set Request Header", icon: IconCheck },
  { type: "addResponseHeader", label: "Add Response Header", icon: IconCheck },
  {
    type: "removeResponseHeader",
    label: "Remove Response Header",
    icon: IconCheck,
  },
  { type: "setResponseHeader", label: "Set Response Header", icon: IconCheck },
  {
    type: "updateResponseBody",
    label: "Update Response Body",
    icon: IconCheck,
  },
  {
    type: "updateResponseStatusCode",
    label: "Update Response Status Code",
    icon: IconCheck,
  },
  { type: "transformData", label: "Transform Data", icon: IconTransform },
  { type: "filter", label: "Filter", icon: IconFilter },
  { type: "delay", label: "Add Delay", icon: IconClock },
  { type: "log", label: "Log Data", icon: IconListDetails },
  { type: "setProvider", label: "Set Provider", icon: IconCheck },
];

// Add SortableBlock component
function SortableBlock({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Group>
        <div {...attributes} {...listeners} style={{ cursor: "grab" }}>
          <IconGripVertical size={16} />
        </div>
        {children}
      </Group>
    </div>
  );
}

export function PipelineBlocksForm({
  steps,
  onChange,
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

  // Edit a block
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

  const handleAdd = (type: Action["type"]) => {
    let action: Action;
    switch (type) {
      case "addRequestHeader":
        action = { type, key: "", value: "" };
        break;
      case "removeRequestHeader":
        action = { type, key: "" };
        break;
      case "setRequestHeader":
        action = { type, key: "", value: "" };
        break;
      case "addResponseHeader":
        action = { type, key: "", value: "" };
        break;
      case "removeResponseHeader":
        action = { type, key: "" };
        break;
      case "setResponseHeader":
        action = { type, key: "", value: "" };
        break;
      case "updateResponseBody":
        action = { type, value: "" };
        break;
      case "updateResponseStatusCode":
        action = { type, value: "" };
        break;
      case "transformData":
        action = { type, expression: "" };
        break;
      case "filter":
        action = { type, expression: "" };
        break;
      case "delay":
        action = { type, ms: 1000 };
        break;
      case "log":
        action = { type, message: "" };
        break;
      case "setProvider":
        action = { type, providerId: "" };
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
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(index)}
                  >
                    <IconTrash />
                  </ActionIcon>
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
                      case "addRequestHeader":
                        return (
                          <AddRequestHeaderBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "removeRequestHeader":
                        return (
                          <RemoveRequestHeaderBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "setRequestHeader":
                        return (
                          <SetRequestHeaderBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "addResponseHeader":
                        return (
                          <AddResponseHeaderBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "removeResponseHeader":
                        return (
                          <RemoveResponseHeaderBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "setResponseHeader":
                        return (
                          <SetResponseHeaderBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "updateResponseBody":
                        return (
                          <UpdateResponseBodyBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "updateResponseStatusCode":
                        return (
                          <UpdateResponseStatusCodeBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "transformData":
                        return (
                          <TransformDataBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "filter":
                        return (
                          <FilterBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "delay":
                        return (
                          <DelayBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "log":
                        return (
                          <LogBlock
                            action={step.action}
                            onChange={(a) => handleBlockChange(index, a)}
                          />
                        );
                      case "setProvider":
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

      <Modal
        opened={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Select Block Type"
        size="md"
      >
        <Stack>
          {BLOCK_TYPES.map((block) => (
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
