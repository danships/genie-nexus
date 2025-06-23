'use client';

import type {
  DeploymentApi,
  LlmEvent,
  LlmFlow,
  LlmFlowStep,
  LogAction,
  WeaveDelayAction,
  WeaveEvent,
  WeaveFilterAction,
  WeaveFlow,
  WeaveFlowStep,
  WeaveTransformDataAction,
} from '@genie-nexus/types';
import { useCudApi } from '@lib/api/use-api';
import { ErrorNotification } from '@lib/components/atoms/error-notification';
import { EmptyWeaveFlowState } from '@lib/components/molecules/empty-weave-flow-state';
import { EmptyLlmFlowState } from '@lib/components/molecules/empty-llm-flow-state';
import { PipelineBlocksForm } from '@lib/components/molecules/pipeline-blocks-form';
import {
  Button,
  Grid,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconClockHour4,
  IconFilter,
  IconListDetails,
  IconTransform,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { generateRandomId } from '@lib/core/generate-random-id';

type Properties<T extends WeaveFlow | LlmFlow> = {
  deployment: DeploymentApi;
  flow: T;
};

type FormValues<T extends WeaveFlow | LlmFlow> = {
  events: T['events'];
};

const EVENT_LABELS: Record<WeaveEvent['type'] | LlmEvent['type'], string> = {
  incomingRequest: 'Incoming Request',
  response: 'Response',
  requestFailed: 'Request Failed',
  timeout: 'Timeout',
};

export function FlowEditorClientPage<T extends WeaveFlow | LlmFlow>({
  flow: originalFlow,
  deployment,
}: Properties<T>) {
  const router = useRouter();
  const [flow, setFlow] = useState<T>(originalFlow);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const form = useForm<FormValues<T>>({
    initialValues: {
      events: flow.events,
    },
  });

  const { patch, inProgress, error } = useCudApi();

  // Track form changes
  const hasUnsavedChanges = form.isDirty();

  // Handle navigation attempts
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href && !link.href.includes(window.location.pathname)) {
        if (hasUnsavedChanges) {
          e.preventDefault();
          e.stopPropagation();
          setPendingNavigation(link.href);
          setShowConfirmModal(true);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('click', handleClick, true);
    };
  }, [hasUnsavedChanges]);

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      form.reset();
      const url = new URL(pendingNavigation);
      router.push(url.pathname);
    }
    setShowConfirmModal(false);
    setPendingNavigation(null);
  };

  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
    setPendingNavigation(null);
  };

  const handleSave = useCallback(async () => {
    if (deployment.type === 'weave') {
      const updatedFlow = await patch<{ data: WeaveFlow }>(
        `/collections/weaveflows/${flow.id}`,
        {
          ...flow,
          events: form.values.events,
          updatedAt: new Date().toISOString(),
        }
      );
      setFlow(updatedFlow.data as T);
    } else {
      const updatedFlow = await patch<{ data: LlmFlow }>(
        `/collections/llmflows/${flow.id}`,
        {
          ...flow,
          events: form.values.events,
          updatedAt: new Date().toISOString(),
        }
      );
      setFlow(updatedFlow.data as T);
    }
    form.resetDirty();
    return;
  }, [flow, form, deployment, patch]);

  // Modal state
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<string | null>(
    null
  );
  const [modalStep, setModalStep] = useState<'block' | 'pipeline'>('block');

  // Building block definitions
  const buildingBlocks = [
    { label: 'Transform Data', icon: IconTransform, type: 'transform' },
    // { label: "Validate", icon: IconCheck, type: "validate" }, // TODO implement later
    { label: 'Filter', icon: IconFilter, type: 'filter' },
    { label: 'Add Delay', icon: IconClock, type: 'delay' },
    { label: 'Log Data', icon: IconListDetails, type: 'log' },
  ];

  // Event type definitions
  const eventTypes = [
    {
      label: 'Incoming Request',
      icon: IconArrowRight,
      type: 'incomingRequest' as const,
    },
    {
      label: 'Response',
      icon: IconCheck,
      type: 'response' as const,
    },
    {
      label: 'Request Failed',
      icon: IconAlertCircle,
      type: 'requestFailed' as const,
    },
    {
      label: 'Timeout',
      icon: IconClockHour4,
      type: 'timeout' as const,
    },
  ];

  // Update pipeline steps
  const handlePipelineStepsChange = (
    eventId: string,
    steps: WeaveFlowStep[] | LlmFlowStep[]
  ) => {
    form.setFieldValue(
      'events',
      form.values.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              pipeline: { ...event.pipeline, steps },
            }
          : event
      ) as T['events']
    );
  };

  // Add block to a specific pipeline
  const handleAddBlock = (eventId: string, type: string) => {
    let newStep: WeaveFlowStep | LlmFlowStep | undefined;
    switch (type) {
      case 'transform':
        newStep = {
          id: generateRandomId(),
          action: {
            type: 'transformData',
            expression: '',
          } satisfies WeaveTransformDataAction,
        };
        break;
      case 'filter':
        newStep = {
          id: generateRandomId(),
          action: {
            type: 'filter',
            expression: '',
          } satisfies WeaveFilterAction,
        };
        break;
      case 'delay':
        newStep = {
          id: generateRandomId(),
          action: { type: 'delay', ms: 1000 } satisfies WeaveDelayAction,
        };
        break;
      case 'log':
        newStep = {
          id: generateRandomId(),
          action: { type: 'log', message: '' } satisfies LogAction,
        };
        break;
    }

    if (!newStep) {
      return;
    }
    form.setFieldValue(
      'events',
      form.values.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              pipeline: {
                ...event.pipeline,
                steps: [...event.pipeline.steps, newStep],
              },
            }
          : event
      ) as T['events']
    );
  };

  const handleModalConfirm = (eventId: string) => {
    if (selectedBlockType) {
      handleAddBlock(eventId, selectedBlockType);
      setModalOpened(false);
      setSelectedBlockType(null);
      setModalStep('block');
    }
  };

  const handleModalClose = () => {
    setModalOpened(false);
    setSelectedBlockType(null);
    setModalStep('block');
  };

  const handleBlockTypeSelect = (type: string) => {
    setSelectedBlockType(type);
    setModalStep('pipeline');
  };

  const handleAddEvent = (type: WeaveEvent['type'] | LlmEvent['type']) => {
    const newEvent: WeaveEvent | LlmEvent = {
      id: generateRandomId(),
      type,
      name: `${EVENT_LABELS[type]} ${form.values.events.length + 1}`,
      pipeline: {
        id: generateRandomId(),
        steps: [],
        enabled: true,
      },
      enabled: true,
    };
    form.setFieldValue('events', [
      ...form.values.events,
      newEvent,
    ] as T['events']);
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSave)}>
        {form.values.events.length === 0 ? (
          deployment.type === 'weave' ? (
            <EmptyWeaveFlowState onAddEvent={handleAddEvent} />
          ) : (
            <EmptyLlmFlowState onAddEvent={handleAddEvent} />
          )
        ) : (
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 9 }}>
              <Stack gap="xl">
                {/* Events and Pipelines */}
                <Paper p="md" withBorder>
                  <Title order={4} mb="md">
                    Events and Pipelines
                  </Title>
                  <Stack>
                    {form.values.events.map((event, index) => (
                      <Paper key={event.id} p="md" withBorder>
                        <Group justify="space-between" mb="md">
                          <Group>
                            <Text fw={500}>
                              Event: {EVENT_LABELS[event.type]}
                            </Text>
                            <TextInput
                              placeholder="Event name"
                              {...form.getInputProps(`events.${index}.name`)}
                              size="xs"
                              style={{ width: '200px' }}
                            />
                            <Switch
                              checked={event.enabled}
                              label={event.enabled ? 'Active' : 'Inactive'}
                              {...form.getInputProps(
                                `events.${index}.enabled`,
                                { type: 'checkbox' }
                              )}
                            />
                          </Group>
                        </Group>
                        <Paper p="md" withBorder>
                          <Group justify="space-between" mb="md">
                            <Group>
                              <Text fw={500}>Pipeline</Text>
                              <Switch
                                checked={event.pipeline.enabled}
                                label={
                                  event.pipeline.enabled ? 'Active' : 'Inactive'
                                }
                                {...form.getInputProps(
                                  `events.${index}.pipeline.enabled`,
                                  { type: 'checkbox' }
                                )}
                              />
                            </Group>
                          </Group>
                          <PipelineBlocksForm
                            steps={event.pipeline.steps}
                            onChange={(steps) =>
                              handlePipelineStepsChange(
                                event.id,
                                steps as WeaveFlowStep[] | LlmFlowStep[]
                              )
                            }
                            flowType={deployment.type}
                            eventType={
                              event.type === 'incomingRequest'
                                ? 'request'
                                : 'response'
                            }
                          />
                        </Paper>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack gap="xl">
                <Button
                  size="sm"
                  component={Link}
                  href={`/app/deployments/${deployment.id}`}
                  leftSection={<IconArrowLeft size={16} />}
                >
                  {' '}
                  Back
                </Button>
                <Paper p="md" withBorder>
                  <Title order={5}>Add Events</Title>
                  <Stack>
                    {eventTypes.map((eventType) => (
                      <Button
                        key={eventType.type}
                        leftSection={<eventType.icon size={16} />}
                        variant="light"
                        onClick={() => handleAddEvent(eventType.type)}
                      >
                        {eventType.label}
                      </Button>
                    ))}
                  </Stack>
                </Paper>

                {/* Flow Status */}
                <Paper p="md" withBorder>
                  <Title order={5}>Flow Status</Title>
                  <Stack gap={4}>
                    <Group justify="space-between">
                      <span>Total Events:</span>
                      <span>{form.values.events.length}</span>
                    </Group>
                    <Group justify="space-between">
                      <span>Active Events:</span>
                      <span>
                        {
                          form.values.events.filter((event) => event.enabled)
                            .length
                        }
                      </span>
                    </Group>
                    <Group justify="space-between">
                      <span>Active Pipelines:</span>
                      <span>
                        {
                          form.values.events.filter(
                            (event) => event.enabled && event.pipeline.enabled
                          ).length
                        }
                      </span>
                    </Group>
                  </Stack>
                  <Button
                    mt="md"
                    variant="default"
                    fullWidth
                    type="submit"
                    loading={inProgress}
                  >
                    Save
                  </Button>
                  {error && <ErrorNotification>{error}</ErrorNotification>}
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        )}

        {/* Pipeline Selection Modal */}
        <Modal
          opened={modalOpened}
          onClose={handleModalClose}
          title={
            modalStep === 'block' ? 'Select Block Type' : 'Select Pipeline'
          }
          size="md"
        >
          <Stack>
            {modalStep === 'block' ? (
              <>
                <Text size="sm">Select the type of block to add:</Text>
                <Stack>
                  {buildingBlocks.map((block) => (
                    <Button
                      key={block.type}
                      leftSection={<block.icon size={16} />}
                      variant="light"
                      onClick={() => handleBlockTypeSelect(block.type)}
                    >
                      {block.label}
                    </Button>
                  ))}
                </Stack>
              </>
            ) : (
              <>
                <Text size="sm">
                  Select which pipeline to add the block to:
                </Text>
                <Select
                  data={form.values.events.map((event) => ({
                    value: event.id,
                    label: `${event.name} (${event.type})`,
                  }))}
                  placeholder="Select a pipeline"
                  onChange={(value) => {
                    if (value) {
                      handleModalConfirm(value);
                    }
                  }}
                />
                <Group justify="flex-end" mt="md">
                  <Button
                    variant="subtle"
                    onClick={() => setModalStep('block')}
                  >
                    Back
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </Modal>
      </form>

      <Modal
        opened={showConfirmModal}
        onClose={handleCancelNavigation}
        title="Unsaved Changes"
        centered
      >
        <Text size="sm" mb="xl">
          You have unsaved changes. Are you sure you want to leave this page?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={handleCancelNavigation}>
            Stay
          </Button>
          <Button variant="filled" onClick={handleConfirmNavigation}>
            Leave
          </Button>
        </Group>
      </Modal>
    </>
  );
}
