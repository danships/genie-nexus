import { Condition } from '@genie-nexus/types';
import {
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

type ConditionEditorProps = {
  conditions: Condition[] | undefined;
  onChange: (conditions: Condition[] | undefined) => void;
};

export function ConditionEditor({
  conditions = [],
  onChange,
}: ConditionEditorProps) {
  const [showConditions, setShowConditions] = useState(!!conditions?.length);

  const handleTypeChange = (type: string, index: number) => {
    const newConditions = [...(conditions || [])];
    switch (type) {
      case 'equals':
        newConditions[index] = {
          type: 'equals' as const,
          field: '',
          value: '',
        };
        break;
      case 'notEquals':
        newConditions[index] = {
          type: 'notEquals' as const,
          field: '',
          value: '',
        };
        break;
      case 'contains':
        newConditions[index] = {
          type: 'contains' as const,
          field: '',
          value: '',
        };
        break;
      case 'doesNotContain':
        newConditions[index] = {
          type: 'doesNotContain' as const,
          field: '',
          value: '',
        };
        break;
      case 'isEmpty':
        newConditions[index] = { type: 'isEmpty' as const, field: '' };
        break;
      case 'isNotEmpty':
        newConditions[index] = { type: 'isNotEmpty' as const, field: '' };
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
      condition.type === 'isEmpty' ||
      condition.type === 'isNotEmpty'
    )
      return;
    newConditions[index] = { ...condition, value };
    onChange(newConditions);
  };

  const handleAddCondition = () => {
    const newConditions = [
      ...(conditions || []),
      { type: 'equals' as const, field: '', value: '' },
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
                    { value: 'equals', label: 'Equals' },
                    { value: 'notEquals', label: 'Not Equals' },
                    { value: 'contains', label: 'Contains' },
                    { value: 'doesNotContain', label: 'Does Not Contain' },
                    { value: 'isEmpty', label: 'Is Empty' },
                    { value: 'isNotEmpty', label: 'Is Not Empty' },
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
                {condition.type !== 'isEmpty' &&
                  condition.type !== 'isNotEmpty' && (
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
