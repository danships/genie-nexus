'use client';

import type { Deployment } from '@genie-nexus/database';
import type {
  DeploymentLLMApiCreate,
  DeploymentWeaveApiCreate,
} from '@genie-nexus/types';
import { ENDPOINT_DEPLOYMENTS_OVERVIEW } from '@lib/api/swr-constants';
import { useCudApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { generateRandomId } from '@lib/core/generate-random-id';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

export const NewDeploymentPage = disableSSR(function () {
  const [creatingType, setCreatingType] = useState<'llm' | 'http' | null>(null);
  const { post, inProgress } = useCudApi();

  const { mutate } = useSWRConfig();
  const router = useRouter();

  const createLlmDeployment = async () => {
    try {
      setCreatingType('llm');
      const llmDeploymentCreated = await post<
        { data: Deployment },
        DeploymentLLMApiCreate
      >('/collections/deployments', {
        type: 'llm',
        name: 'New LLM Deployment',
        slug: `llm-${crypto.randomUUID().split('-')[0]}`,
        active: true,
        defaultProviderId: '', // we accept that it is empty for now
        model: 'to be filled in',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      void mutate(ENDPOINT_DEPLOYMENTS_OVERVIEW);
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
        DeploymentWeaveApiCreate
      >('/collections/deployments', {
        type: 'weave',
        name: 'New Weave Deployment',
        slug: `weave-${generateRandomId()}`,
        active: true,
        defaultProviderId: '', // we accept that it is empty for now
        requiresApiKey: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      void mutate(ENDPOINT_DEPLOYMENTS_OVERVIEW);
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
              data-umami-event="deployments-create-llm"
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
              data-umami-event="deployments-create-weave"
            >
              Create HTTP Deployment
            </Button>
          </Stack>
        </Card>
      </Group>
    </Stack>
  );
});
