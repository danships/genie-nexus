import { WeaveEvent } from '@genie-nexus/types';
import { Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconCheck,
  IconClockHour4,
  IconFilter,
  IconListDetails,
  IconTransform,
} from '@tabler/icons-react';

type EmptyFlowStateProps = {
  onAddEvent: (type: WeaveEvent['type']) => void;
};

export function EmptyWeaveFlowState({ onAddEvent }: EmptyFlowStateProps) {
  const eventTypes = [
    {
      label: 'Incoming Request',
      icon: IconArrowRight,
      type: 'incomingRequest' as const,
      description: 'Handle incoming HTTP requests before they are processed',
    },
    {
      label: 'Response',
      icon: IconCheck,
      type: 'response' as const,
      description: 'Modify responses before they are sent back to the client',
    },
    {
      label: 'Request Failed',
      icon: IconFilter,
      type: 'requestFailed' as const,
      description: 'Handle cases where the request processing fails',
    },
    {
      label: 'Timeout',
      icon: IconClockHour4,
      type: 'timeout' as const,
      description: 'Handle cases where the request times out',
    },
  ];

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stack gap="xs" ta="center">
          <Title order={2}>Welcome to the Flow Editor</Title>
          <Text c="dimmed" size="lg">
            Create a flow to transform and process requests and responses
          </Text>
        </Stack>

        <Card withBorder p="xl" className="is-transparent">
          <Stack gap="xl">
            <Stack gap="xs">
              <Title order={3}>What can you do?</Title>
              <Text>
                The Flow Editor allows you to create powerful request and
                response transformations using a visual interface. You can:
              </Text>
              <Stack gap="xs" mt="md">
                <Group>
                  <IconTransform size={20} />
                  <Text>Transform request and response data</Text>
                </Group>
                <Group>
                  <IconFilter size={20} />
                  <Text>Filter requests based on conditions</Text>
                </Group>
                <Group>
                  <IconListDetails size={20} />
                  <Text>Add logging and monitoring</Text>
                </Group>
              </Stack>
            </Stack>

            <Stack gap="xs">
              <Title order={3}>Get Started</Title>
              <Text>Choose an event type to start building your flow:</Text>
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
