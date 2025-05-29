import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

export type EventHandler = {
  id: string;
  type: 'retry';
  eventType: 'requestFailed';
  maxRetries: number;
  retryDelay: number;
  enabled: boolean;
};

type Properties = {
  handlers: EventHandler[];
  onChange: (handlers: EventHandler[]) => void;
};

const EVENT_TYPES = [{ value: 'requestFailed', label: 'Request Failed' }];
const ACTIONS = [{ value: 'retry', label: 'Retry Request' }];

export function EventHandlersForm({ handlers, onChange }: Properties) {
  const handleAdd = () => {
    const newHandler: EventHandler = {
      id: Math.random().toString(36).slice(2),
      type: 'retry',
      eventType: 'requestFailed',
      maxRetries: 3,
      retryDelay: 1000,
      enabled: true,
    };
    onChange([...handlers, newHandler]);
  };

  const handleDelete = (idx: number) => {
    onChange(handlers.filter((_, i) => i !== idx));
  };

  const handleChange = (idx: number, update: Partial<EventHandler>) => {
    onChange(handlers.map((h, i) => (i === idx ? { ...h, ...update } : h)));
  };

  return (
    <Stack>
      {handlers.map((handler, idx) => (
        <Paper key={handler.id} p="sm" withBorder>
          <Group justify="space-between" align="center">
            <Group>
              <Text>Event Handler</Text>
              <Switch
                checked={handler.enabled}
                label={handler.enabled ? 'Active' : 'Inactive'}
                onChange={(e) =>
                  handleChange(idx, { enabled: e.currentTarget.checked })
                }
              />
            </Group>
            <ActionIcon color="red" onClick={() => handleDelete(idx)}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
          <Group grow mt="sm">
            <Select
              label="Event Type"
              data={EVENT_TYPES}
              value={handler.eventType}
              onChange={(v) => handleChange(idx, { eventType: v as any })}
            />
            <Select
              label="Action"
              data={ACTIONS}
              value={handler.type}
              onChange={(v) => handleChange(idx, { type: v as any })}
            />
            <NumberInput
              label="Max Retries"
              min={1}
              value={handler.maxRetries}
              onChange={(v) => handleChange(idx, { maxRetries: Number(v) })}
            />
            <NumberInput
              label="Retry Delay (ms)"
              min={0}
              value={handler.retryDelay}
              onChange={(v) => handleChange(idx, { retryDelay: Number(v) })}
            />
          </Group>
        </Paper>
      ))}
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={handleAdd}
        variant="light"
      >
        Add Event Handler
      </Button>
    </Stack>
  );
}
