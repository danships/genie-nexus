'use client';

import {
  Card,
  Stack,
  Title,
  Text,
  TextInput,
  Switch,
  Button,
  Select,
  MultiSelect,
} from '@mantine/core';
import { useApi, useCudApi } from '@lib/api/use-api';
import { useMemo, useState } from 'react';
import {
  ENDPOINT_DEPLOYMENTS_OVERVIEW,
  ENDPOINT_PROVIDERS_OVERVIEW,
} from '@lib/api/swr-constants';
import { Deployment, Provider } from '@genie-nexus/database';
import { DeploymentWeaveApi } from '@genie-nexus/types';
import { notifications } from '@mantine/notifications';
import { Loader } from '@lib/components/atoms/loader';

type Properties = {
  deployment: Deployment;
};

export function DeploymentWeaveDetailClientPage({ deployment }: Properties) {
  const [formData, setFormData] = useState<DeploymentWeaveApi>({
    type: 'weave',
    name: deployment.name,
    active: deployment.active,
    defaultProviderId: deployment.defaultProviderId,
    requiresApiKey:
      deployment.type === 'weave' ? deployment.requiresApiKey : false,
    supportedMethods:
      deployment.type === 'weave' ? deployment.supportedMethods : [],
  });

  const { patch, inProgress } = useCudApi();
  const { mutate } = useApi(ENDPOINT_DEPLOYMENTS_OVERVIEW);

  const { data: providers } = useApi<Provider[]>(ENDPOINT_PROVIDERS_OVERVIEW);
  const filteredProviders = useMemo(() => {
    return (
      providers?.filter(
        (provider) =>
          provider.type === 'http-proxy' || provider.type === 'http-static',
      ) || []
    );
  }, [providers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patch<{ data: Deployment }, DeploymentWeaveApi>(
        `/collections/deployments/${deployment.id}`,
        formData,
      );
      void mutate();
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
      <Text c="dimmed" mb="lg">
        Configure your Weave deployment settings
      </Text>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Enter deployment name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            {!filteredProviders && <Loader />}
            {Array.isArray(filteredProviders) && (
              <Select
                label="Default Provider"
                placeholder="Select a provider"
                value={formData.defaultProviderId}
                onChange={(value) =>
                  setFormData({ ...formData, defaultProviderId: value || '' })
                }
                data={
                  filteredProviders.map((provider) => ({
                    value: provider.id,
                    label: provider.name,
                  })) || []
                }
                required
              />
            )}

            <Switch
              label="Active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.currentTarget.checked })
              }
            />

            <Switch
              label="Requires API Key"
              checked={formData.requiresApiKey}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requiresApiKey: e.currentTarget.checked,
                })
              }
            />

            <MultiSelect
              label="Supported HTTP Methods"
              placeholder="Select supported methods"
              value={formData.supportedMethods ?? []}
              description="If you select no methods, all methods will be supported"
              onChange={(value) =>
                setFormData({
                  ...formData,
                  supportedMethods: (value ?? []) as Array<
                    'get' | 'post' | 'put' | 'delete' | 'patch' | 'options'
                  >,
                })
              }
              data={[
                { value: 'get', label: 'GET' },
                { value: 'post', label: 'POST' },
                { value: 'put', label: 'PUT' },
                { value: 'delete', label: 'DELETE' },
                { value: 'patch', label: 'PATCH' },
                { value: 'options', label: 'OPTIONS' },
              ]}
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
