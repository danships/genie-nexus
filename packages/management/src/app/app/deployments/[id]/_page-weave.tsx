'use client';

import { Provider } from '@genie-nexus/database';
import { DeploymentWeave } from '@genie-nexus/types';
import { useApi } from '@lib/api/use-api';
import { Loader } from '@lib/components/atoms/loader';
import { PageTitle } from '@lib/components/atoms/page-title';
import { WeaveIcon } from '@lib/components/atoms/weave-icon';
import { DetailCard } from '@lib/components/molecules/detail-card';
import { useServerUrl } from '@lib/hooks/use-server-url';
import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Grid,
  Group,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import {
  IconApi,
  IconClipboard,
  IconClipboardCheckFilled,
  IconEdit,
  IconKey,
  IconWorld,
} from '@tabler/icons-react';
import Link from 'next/link';

type Properties = {
  deployment: DeploymentWeave;
};

export function DeploymentWeaveDetailClientPage({ deployment }: Properties) {
  const supportedMethods = deployment.supportedMethods ?? [];

  const { data: defaultProvider, isLoading: isLoadingDefaultProvider } =
    useApi<Provider>(() =>
      deployment.defaultProviderId
        ? `/collections/providers/${deployment.defaultProviderId}`
        : false
    );

  const serverUrl = useServerUrl(`/weave/${deployment.name}`);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <PageTitle>Deployment {deployment.name}</PageTitle>
        <Badge size="md" color={deployment.active ? 'green' : 'red'}>
          {deployment.active ? 'Active' : 'Inactive'}
        </Badge>
      </Group>
      <Group>
        <Button
          leftSection={<IconEdit size={16} />}
          component={Link}
          href={`/app/deployments/${deployment.id}/edit`}
          variant="light"
        >
          Edit Deployment
        </Button>
      </Group>
      <Grid>
        <Grid.Col span={12}>
          <DetailCard icon={WeaveIcon} title="Endpoint Details">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Td>Endpoint</Table.Td>
                  <Table.Td>
                    {serverUrl}{' '}
                    <CopyButton value={serverUrl}>
                      {({ copied, copy }) => (
                        <ActionIcon color="dimmed" onClick={copy} size="sm">
                          {copied ? (
                            <IconClipboardCheckFilled />
                          ) : (
                            <IconClipboard />
                          )}
                        </ActionIcon>
                      )}
                    </CopyButton>
                  </Table.Td>
                </Table.Tr>
              </Table.Thead>
            </Table>
          </DetailCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailCard icon={IconKey} title="API Key Requirements">
            <Text size="sm" c="dimmed">
              API Key Required: {deployment.requiresApiKey ? 'Yes' : 'No'}
            </Text>
          </DetailCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailCard icon={IconWorld} title="Supported Methods">
            {supportedMethods.length > 0 ? (
              <Group gap="xs">
                {supportedMethods.map((method: string) => (
                  <Badge key={method} variant="light">
                    {method.toUpperCase()}
                  </Badge>
                ))}
              </Group>
            ) : (
              <Text size="sm" c="dimmed">
                All methods allowed.
              </Text>
            )}
          </DetailCard>
        </Grid.Col>

        <Grid.Col span={12}>
          <DetailCard icon={IconApi} title="Default Provider">
            <Text size="sm" c="dimmed">
              {deployment.defaultProviderId && isLoadingDefaultProvider && (
                <Loader />
              )}
              {defaultProvider && defaultProvider.name}
            </Text>
          </DetailCard>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
