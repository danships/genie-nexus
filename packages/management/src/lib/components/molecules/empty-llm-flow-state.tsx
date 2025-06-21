import { LlmEvent } from '@genie-nexus/types';
import { Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import {
  IconBrain,
  IconMessage,
  IconRobot,
  IconSettings,
  IconTransform,
  IconWand,
} from '@tabler/icons-react';

type EmptyFlowStateProps = {
  onAddEvent: (type: LlmEvent['type']) => void;
};

export function EmptyLlmFlowState({ onAddEvent }: EmptyFlowStateProps) {
  const eventTypes = [
    {
      label: 'Incoming Request',
      icon: IconMessage,
      type: 'incomingRequest' as const,
      description:
        'Process and modify incoming LLM requests before they reach the model',
    },
    {
      label: 'Response',
      icon: IconBrain,
      type: 'response' as const,
      description:
        'Transform and enhance model responses before sending to the client',
    },
    {
      label: 'Request Failed',
      icon: IconRobot,
      type: 'requestFailed' as const,
      description: 'Handle cases where the LLM request processing fails',
    },
    {
      label: 'Timeout',
      icon: IconSettings,
      type: 'timeout' as const,
      description: 'Handle cases where the LLM request times out',
    },
  ];

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stack gap="xs" ta="center">
          <Title order={2}>Welcome to the LLM Flow Editor</Title>
          <Text c="dimmed" size="lg">
            Create intelligent flows to enhance and customize your LLM
            interactions
          </Text>
        </Stack>

        <Card withBorder p="xl" className="is-transparent">
          <Stack gap="xl">
            <Stack gap="xs">
              <Title order={3}>What can you do?</Title>
              <Text>
                The LLM Flow Editor allows you to create intelligent request and
                response transformations for your language models. You can:
              </Text>
              <Stack gap="xs" mt="md">
                <Group>
                  <IconTransform size={20} />
                  <Text>Modify prompts and system messages dynamically</Text>
                </Group>
                <Group>
                  <IconWand size={20} />
                  <Text>
                    Switch between different models based on conditions
                  </Text>
                </Group>
                <Group>
                  <IconBrain size={20} />
                  <Text>Enhance and filter model responses</Text>
                </Group>
                <Group>
                  <IconMessage size={20} />
                  <Text>Add logging and monitoring for LLM interactions</Text>
                </Group>
              </Stack>
            </Stack>

            <Stack gap="xs">
              <Title order={3}>Get Started</Title>
              <Text>Choose an event type to start building your LLM flow:</Text>
              <Group grow mt="md">
                {eventTypes.map((eventType) => (
                  <Card
                    key={eventType.type}
                    withBorder
                    p="md"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onAddEvent(eventType.type)}
                  >
                    <Stack gap="xs">
                      <Group>
                        <eventType.icon size={24} />
                        <Text fw={500}>{eventType.label}</Text>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {eventType.description}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Group>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
