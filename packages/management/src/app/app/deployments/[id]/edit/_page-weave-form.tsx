'use client';

import type { Deployment, Provider } from '@genie-nexus/database';
import type { DeploymentWeaveApi } from '@genie-nexus/types';
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
  MultiSelect,
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

export function DeploymentWeaveFormClientPage({ deployment }: Properties) {
  const form = useForm<
    Omit<DeploymentWeaveApi, 'id' | 'createdAt' | 'updatedAt'>
  >({
    initialValues: {
      type: 'weave',
      name: deployment.name,
      slug: deployment.slug,
      active: deployment.active,
      defaultProviderId: deployment.defaultProviderId,
      requiresApiKey:
        deployment.type === 'weave' ? deployment.requiresApiKey : false,
      supportedMethods:
        deployment.type === 'weave' ? deployment.supportedMethods : [],
    },
    validate: {
      name: (value: string) => {
        if (!value.trim()) {
          return 'Name is required';
        }
        return null;
      },
      slug: (value: string) => {
        if (!value.trim()) {
          return 'Slug is required';
        }
        if (!/^[a-zA-Z0-9-]+$/.test(value)) {
          return 'Slug can only contain letters, numbers, and dashes';
        }
        return null;
      },
      defaultProviderId: (value: string) =>
        !value ? 'Default provider is required' : null,
    },
  });

  const { patch, inProgress } = useCudApi();
  const { mutate } = useSWRConfig();

  const { data: providers } = useApi<Provider[]>(ENDPOINT_PROVIDERS_OVERVIEW);
  const filteredProviders = useMemo(() => {
    return (
      providers?.filter(
        (provider) =>
          provider.type === 'http-proxy' || provider.type === 'http-static'
      ) || []
    );
  }, [providers]);

  const handleSubmit = async (
    values: Omit<DeploymentWeaveApi, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await patch<
        { data: Deployment },
        Omit<DeploymentWeaveApi, 'id' | 'createdAt'>
      >(`/collections/deployments/${deployment.id}`, {
        ...values,
        updatedAt: new Date().toISOString(),
      });
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
      <Title order={1}>Weave Deployment Details</Title>
      <Group>
        <Button
          leftSection={<IconArrowLeft size={16} />}
          component={Link}
          href={`/app/deployments/${deployment.id}`}
          variant="subtle"
          size="sm"
          data-umami-event="deployment-weave-edit-back"
        >
          Back to Details
        </Button>
      </Group>
      <Text c="dimmed" mb="lg">
        Configure your Weave deployment settings
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

            {!filteredProviders && <Loader />}
            {Array.isArray(filteredProviders) && (
              <Select
                label="Default Provider"
                placeholder="Select a provider"
                description={
                  <>
                    {deployment.defaultProviderId && (
                      <Link
                        href={`/app/providers/${deployment.defaultProviderId}`}
                        target="_blank"
                      >
                        Open provider
                      </Link>
                    )}
                  </>
                }
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

            <Switch
              label="Requires API Key"
              {...form.getInputProps('requiresApiKey', { type: 'checkbox' })}
            />

            <MultiSelect
              label="Supported HTTP Methods"
              placeholder="Select supported methods"
              description="If you select no methods, all methods will be supported"
              {...form.getInputProps('supportedMethods')}
              data={[
                { value: 'get', label: 'GET' },
                { value: 'post', label: 'POST' },
                { value: 'put', label: 'PUT' },
                { value: 'delete', label: 'DELETE' },
                { value: 'patch', label: 'PATCH' },
                { value: 'options', label: 'OPTIONS' },
              ]}
            />

            <Button
              type="submit"
              loading={inProgress}
              data-umami-event="deployment-weave-edit-save"
            >
              Save Changes
            </Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
