'use client';

import type { Deployment, Provider } from '@genie-nexus/database';
import type { DeploymentLLMApi } from '@genie-nexus/types';
import {
  ENDPOINT_DEPLOYMENTS_OVERVIEW,
  ENDPOINT_PROVIDERS_OVERVIEW,
} from '@lib/api/swr-constants';
import { useApi, useCudApi } from '@lib/api/use-api';
import { Loader } from '@lib/components/atoms/loader';
import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useSWRConfig } from 'swr';

type Properties = {
  deployment: Deployment;
};

export function DeploymentLlmFormClientPage({ deployment }: Properties) {
  const form = useForm<Omit<DeploymentLLMApi, 'id'>>({
    initialValues: {
      type: 'llm',
      name: deployment.name,
      slug: deployment.slug,
      active: deployment.active,
      defaultProviderId: deployment.defaultProviderId,
      model: deployment.type === 'llm' ? deployment.model : '',
    },
    validate: {
      name: (value) => {
        if (!value.trim()) {
          return 'Name is required';
        }

        return null;
      },
      slug: (value) => {
        if (!value.trim()) {
          return 'Slug is required';
        }
        if (!/^[a-zA-Z0-9-]+$/.test(value)) {
          return 'Slug can only contain letters, numbers, and dashes';
        }
        return null;
      },
      defaultProviderId: (value) =>
        !value ? 'Default provider is required' : null,
    },
  });

  const { patch, inProgress } = useCudApi();
  const { mutate } = useSWRConfig();

  const { data: providers } = useApi<Provider[]>(ENDPOINT_PROVIDERS_OVERVIEW);
  const filteredProviders = useMemo(() => {
    // Supersave does not allow yet to filter with an OR on a attribute
    return (
      providers?.filter(
        (provider) =>
          provider.type === 'openai' ||
          provider.type === 'static' ||
          provider.type === 'google'
      ) || []
    );
  }, [providers]);

  const handleSubmit = async (values: Omit<DeploymentLLMApi, 'id'>) => {
    try {
      await patch<{ data: Deployment }, Omit<DeploymentLLMApi, 'id'>>(
        `/collections/deployments/${deployment.id}`,
        values
      );
      void mutate(ENDPOINT_DEPLOYMENTS_OVERVIEW);
      notifications.show({
        title: 'Success',
        message: 'Deployment updated successfully',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to update deployment',
        color: 'red',
      });
    }
  };

  return (
    <Stack>
      <Title order={1}>LLM Deployment Details</Title>
      <Group>
        <Button
          leftSection={<IconArrowLeft size={16} />}
          component={Link}
          href={`/app/deployments/${deployment.id}`}
          variant="subtle"
          size="sm"
        >
          Back to Details
        </Button>
      </Group>
      <Text c="dimmed" mb="lg">
        Configure your LLM deployment settings
      </Text>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Enter deployment name"
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Slug"
              placeholder="Enter the slug for this deployment"
              required
              description="The slug is used to identify the deployment in the URL. It can only contain letters, numbers, and dashes."
              {...form.getInputProps('slug')}
            />

            <TextInput
              label="Model"
              placeholder="Enter model name"
              required
              {...form.getInputProps('model')}
            />

            {!filteredProviders && <Loader />}
            {Array.isArray(filteredProviders) && (
              <Select
                label="Default Provider"
                placeholder="Select a provider"
                required
                {...form.getInputProps('defaultProviderId')}
                data={
                  filteredProviders.map((provider) => ({
                    value: provider.id,
                    label: provider.name,
                  })) || []
                }
              />
            )}

            <Switch
              label="Active"
              {...form.getInputProps('active', { type: 'checkbox' })}
            />

            <Button type="submit" loading={inProgress}>
              Save Changes
            </Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
