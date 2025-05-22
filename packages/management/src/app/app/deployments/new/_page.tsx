'use client';

import { Card, Group, Stack, Title, Text, Button } from '@mantine/core';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { useApi, useCudApi } from '@lib/api/use-api';
import { useState } from 'react';
import { ENDPOINT_DEPLOYMENTS_OVERVIEW } from '@lib/api/swr-constants';
import { Deployment } from '@genie-nexus/database';
import { DeploymentLLMApi, DeploymentWeaveApi } from '@genie-nexus/types';
import { useRouter } from 'next/navigation';

export const NewDeploymentPage = disableSSR(function () {
  const [creatingType, setCreatingType] = useState<'llm' | 'http' | null>(null);
  const { post, inProgress } = useCudApi();

  const { mutate } = useApi(ENDPOINT_DEPLOYMENTS_OVERVIEW);
  const router = useRouter();

  const createLlmDeployment = async () => {
    try {
      setCreatingType('llm');
      const llmDeploymentCreated = await post<
        { data: Deployment },
        DeploymentLLMApi
      >('/collections/deployments', {
        type: 'llm',
        name: `new-llm-deployment-${Date.now() % 1000000}`,
        active: true,
        defaultProviderId: '', // we accept that it is empty for now
        model: 'to be filled in',
      });
      void mutate();
      router.push(`/app/deployments/${llmDeploymentCreated.data.id}/edit`);
    } finally {
      setCreatingType(null);
    }
  };

  const createWeaveDeployment = async () => {
    try {
      setCreatingType('http');
      const weaveDeploymentCreated = await post<
        { data: Deployment },
        DeploymentWeaveApi
      >('/collections/deployments', {
        type: 'weave',
        name: `new-weave-deployment-${Date.now() % 10000000}`,
        active: true,
        defaultProviderId: '', // we accept that it is empty for now
        requiresApiKey: true,
      });
      void mutate();
      router.push(`/app/deployments/${weaveDeploymentCreated.data.id}/edit`);
    } finally {
      setCreatingType(null);
    }
  };

  return (
    <Stack>
      <Title order={1}>Create New Deployment</Title>
      <Text c="dimmed" mb="lg">
        Choose the type of deployment you want to create
      </Text>

      <Group grow>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack>
            <Title order={3}>LLM Deployment</Title>
            <Text size="sm" c="dimmed">
              Create a deployment for an LLM model. This allows you to integrate
              with various language models.
            </Text>
            <Button
              variant="light"
              onClick={() => void createLlmDeployment()}
              loading={inProgress && creatingType === 'llm'}
            >
              Create LLM Deployment
            </Button>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack>
            <Title order={3}>HTTP Deployment</Title>
            <Text size="sm" c="dimmed">
              Create a deployment for an HTTP service. This allows you to
              integrate with external APIs and services.
            </Text>
            <Button
              variant="light"
              onClick={() => void createWeaveDeployment()}
              loading={inProgress && creatingType === 'http'}
            >
              Create HTTP Deployment
            </Button>
          </Stack>
        </Card>
      </Group>
    </Stack>
  );
});
