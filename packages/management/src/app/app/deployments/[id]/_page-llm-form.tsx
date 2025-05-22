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
} from '@mantine/core';
import { useApi, useCudApi } from '@lib/api/use-api';
import { useMemo, useState } from 'react';
import {
  ENDPOINT_DEPLOYMENTS_OVERVIEW,
  ENDPOINT_PROVIDERS_OVERVIEW,
} from '@lib/api/swr-constants';
import { Deployment, Provider } from '@genie-nexus/database';
import { DeploymentLLMApi } from '@genie-nexus/types';
import { notifications } from '@mantine/notifications';
import { Loader } from '@lib/components/atoms/loader';

type Properties = {
  deployment: Deployment;
};

export function DeploymentLlmFormClientPage({ deployment }: Properties) {
  const [formData, setFormData] = useState<DeploymentLLMApi>({
    type: 'llm',
    name: deployment.name,
    active: deployment.active,
    defaultProviderId: deployment.defaultProviderId,
    model: deployment.type === 'llm' ? deployment.model : '',
  });

  const { patch, inProgress } = useCudApi();
  const { mutate } = useApi(ENDPOINT_DEPLOYMENTS_OVERVIEW);

  const { data: providers } = useApi<Provider[]>(ENDPOINT_PROVIDERS_OVERVIEW);
  const filteredProviders = useMemo(() => {
    // Supersave does not allow yet to filter with an OR on a attribute
    return (
      providers?.filter(
        (provider) => provider.type === 'openai' || provider.type === 'static',
      ) || []
    );
  }, [providers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patch<{ data: Deployment }, DeploymentLLMApi>(
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
      <Title order={1}>LLM Deployment Details</Title>
      <Text c="dimmed" mb="lg">
        Configure your LLM deployment settings
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

            <TextInput
              label="Model"
              placeholder="Enter model name"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
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

            <Button type="submit" loading={inProgress}>
              Save Changes
            </Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
