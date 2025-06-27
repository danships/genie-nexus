'use client';

import type { ApiKey, Deployment, Provider } from '@genie-nexus/database';
import {
  ENDPOINT_APIKEYS_OVERVIEW,
  ENDPOINT_DEPLOYMENTS_OVERVIEW,
  ENDPOINT_PROVIDERS_OVERVIEW,
} from '@lib/api/swr-constants';
import { useApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { PageTitle } from '@lib/components/atoms/page-title';
import { DetailCard } from '@lib/components/molecules/detail-card';
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconActivity,
  IconKey,
  IconPlus,
  IconRocket,
  IconServer,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';

export const DashboardClientPage = disableSSR(function () {
  const { data: deployments, isLoading: deploymentsLoading } = useApi<
    Deployment[]
  >(ENDPOINT_DEPLOYMENTS_OVERVIEW);
  const { data: providers, isLoading: providersLoading } = useApi<Provider[]>(
    ENDPOINT_PROVIDERS_OVERVIEW
  );
  const { data: apiKeys, isLoading: apiKeysLoading } = useApi<ApiKey[]>(
    ENDPOINT_APIKEYS_OVERVIEW
  );

  /** We sort here so that we can re-use the SWR keys for the data, and their grids will load fast when opened. */
  const sortedDeployments = useMemo(
    () =>
      deployments?.sort((a, b) => {
        return b.updatedAt.localeCompare(a.updatedAt);
      }),
    [deployments]
  );

  const sortedProviders = useMemo(
    () =>
      providers?.sort((a, b) => {
        return b.updatedAt.localeCompare(a.updatedAt);
      }),
    [providers]
  );

  const sortedApiKeys = useMemo(
    () =>
      apiKeys?.sort((a, b) => {
        return b.createdAt.localeCompare(a.createdAt);
      }),
    [apiKeys]
  );

  return (
    <Stack gap="lg">
      <PageTitle>Dashboard</PageTitle>

      {/* Summary Stats Cards */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group>
              <IconRocket size={24} color="var(--highlight-color)" />
              <Stack gap={0}>
                {deploymentsLoading ? (
                  <Skeleton height={24} width={40} />
                ) : (
                  <Text size="lg" fw={600}>
                    {sortedDeployments?.length}
                  </Text>
                )}
                <Text size="sm" c="dimmed">
                  Active Deployments
                </Text>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group>
              <IconServer size={24} color="var(--highlight-color)" />
              <Stack gap={0}>
                {providersLoading ? (
                  <Skeleton height={24} width={40} />
                ) : (
                  <Text size="lg" fw={600}>
                    {providers?.length}
                  </Text>
                )}
                <Text size="sm" c="dimmed">
                  Connected Providers
                </Text>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group>
              <IconKey size={24} color="var(--highlight-color)" />
              <Stack gap={0}>
                {apiKeysLoading ? (
                  <Skeleton height={24} width={40} />
                ) : (
                  <Text size="lg" fw={600}>
                    {apiKeys?.length}
                  </Text>
                )}
                <Text size="sm" c="dimmed">
                  API Keys Available
                </Text>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>

        {/*<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group>
              <IconActivity size={24} color="var(--highlight-color)" />
              <Stack gap={0}>
                <Text size="lg" fw={600}>
                  -
                </Text>
                <Text size="sm" c="dimmed">
                  Requests Routed
                </Text>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>*/}
      </Grid>

      {/* Main Sections */}
      <Grid>
        {/* Deployments Section */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailCard icon={IconRocket} title="Deployments">
            <Stack gap="md">
              {deploymentsLoading ? (
                <Stack gap="xs">
                  {[1, 2, 3].map((i) => (
                    <Group key={i} justify="space-between">
                      <Stack gap={4}>
                        <Skeleton height={16} width={120} />
                        <Group gap="xs">
                          <Skeleton height={16} width={60} />
                          <Skeleton height={16} width={50} />
                        </Group>
                      </Stack>
                      <Skeleton height={24} width={40} />
                    </Group>
                  ))}
                </Stack>
              ) : sortedDeployments && sortedDeployments.length > 0 ? (
                <Stack gap="xs">
                  {sortedDeployments.slice(0, 3).map((deployment) => (
                    <Group key={deployment.id} justify="space-between">
                      <Stack gap={0}>
                        <Text fw={500} size="sm">
                          {deployment.name}
                        </Text>
                        <Group gap="xs">
                          <Badge size="xs" variant="light" color="blue">
                            {deployment.type}
                          </Badge>
                          <Badge
                            size="xs"
                            color={deployment.active ? 'green' : 'gray'}
                          >
                            {deployment.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </Group>
                      </Stack>
                      <Button
                        component={Link}
                        href={`/app/deployments/${deployment.id}`}
                        variant="light"
                        size="xs"
                      >
                        View
                      </Button>
                    </Group>
                  ))}
                  {sortedDeployments && sortedDeployments?.length > 3 && (
                    <Text size="xs" c="dimmed">
                      +{sortedDeployments?.length - 3} more deployments
                    </Text>
                  )}
                </Stack>
              ) : (
                <Text size="sm" c="dimmed">
                  No active deployments
                </Text>
              )}
              <Button
                component={Link}
                href="/app/deployments/new"
                leftSection={<IconPlus size={16} />}
                variant="light"
                fullWidth
              >
                New Deployment
              </Button>
            </Stack>
          </DetailCard>
        </Grid.Col>

        {/* Providers Section */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailCard icon={IconServer} title="Providers">
            <Stack gap="md">
              {providersLoading ? (
                <Stack gap="xs">
                  {[1, 2, 3].map((i) => (
                    <Group key={i} justify="space-between">
                      <Stack gap={4}>
                        <Skeleton height={16} width={120} />
                        <Skeleton height={16} width={80} />
                      </Stack>
                      <Skeleton height={24} width={40} />
                    </Group>
                  ))}
                </Stack>
              ) : sortedProviders && sortedProviders.length > 0 ? (
                <Stack gap="xs">
                  {sortedProviders.slice(0, 3).map((provider) => (
                    <Group key={provider.id} justify="space-between">
                      <Stack gap={0}>
                        <Text fw={500} size="sm">
                          {provider.name}
                        </Text>
                        <Badge size="xs" variant="light" color="blue">
                          {provider.type}
                        </Badge>
                      </Stack>
                      <Button
                        component={Link}
                        href={`/app/providers/${provider.id}`}
                        variant="light"
                        size="xs"
                      >
                        View
                      </Button>
                    </Group>
                  ))}
                  {sortedProviders.length > 3 && (
                    <Text size="xs" c="dimmed">
                      +{sortedProviders.length - 3} more providers
                    </Text>
                  )}
                </Stack>
              ) : (
                <Text size="sm" c="dimmed">
                  No connected providers
                </Text>
              )}
              <Button
                component={Link}
                href="/app/providers/new"
                leftSection={<IconPlus size={16} />}
                variant="light"
                fullWidth
              >
                Connect Provider
              </Button>
            </Stack>
          </DetailCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailCard icon={IconKey} title="API Keys">
            <Stack gap="md">
              {apiKeysLoading ? (
                <Stack gap="xs">
                  {[1, 2, 3].map((i) => (
                    <Group key={i} justify="space-between">
                      <Stack gap={4}>
                        <Skeleton height={16} width={120} />
                        <Group gap="xs">
                          <Skeleton height={16} width={80} />
                          <Skeleton height={16} width={50} />
                        </Group>
                      </Stack>
                      <Skeleton height={24} width={40} />
                    </Group>
                  ))}
                </Stack>
              ) : sortedApiKeys && sortedApiKeys.length > 0 ? (
                <Stack gap="xs">
                  {sortedApiKeys.slice(0, 3).map((apiKey) => (
                    <Group key={apiKey.id} justify="space-between">
                      <Stack gap={0}>
                        <Text fw={500} size="sm">
                          {apiKey.label}
                        </Text>
                        <Group gap="xs">
                          <Badge size="xs" variant="light" color="green">
                            {apiKey.type === 'management-key'
                              ? 'Management'
                              : apiKey.type === 'llm-api-key'
                                ? 'LLM API'
                                : 'Weave API'}
                          </Badge>
                          <Badge size="xs" color="green">
                            Active
                          </Badge>
                        </Group>
                      </Stack>
                      <Button
                        component={Link}
                        href={`/app/api-keys/${apiKey.id}`}
                        variant="light"
                        size="xs"
                      >
                        View
                      </Button>
                    </Group>
                  ))}
                  {sortedApiKeys.length > 3 && (
                    <Text size="xs" c="dimmed">
                      +{sortedApiKeys.length - 3} more API keys
                    </Text>
                  )}
                </Stack>
              ) : (
                <Text size="sm" c="dimmed">
                  No active API keys
                </Text>
              )}
              <Button
                component={Link}
                href="/app/api-keys/new"
                leftSection={<IconPlus size={16} />}
                variant="light"
                fullWidth
              >
                Create API Key
              </Button>
            </Stack>
          </DetailCard>
        </Grid.Col>

        {/* Quick Actions Section */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailCard icon={IconActivity} title="Quick Actions">
            <Stack gap="md">
              <Button
                component={Link}
                href="/app/deployments"
                variant="light"
                fullWidth
              >
                View All Deployments
              </Button>
              <Button
                component={Link}
                href="/app/providers"
                variant="light"
                fullWidth
              >
                Manage Providers
              </Button>
              <Button
                component={Link}
                href="/app/api-keys"
                variant="light"
                fullWidth
              >
                Manage API Keys
              </Button>
              <Button
                component={Link}
                href="/app/settings"
                variant="light"
                fullWidth
              >
                Settings
              </Button>
            </Stack>
          </DetailCard>
        </Grid.Col>
      </Grid>
    </Stack>
  );
});
