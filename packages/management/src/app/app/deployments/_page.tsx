'use client';

import type { Deployment } from '@genie-nexus/database';
import { useApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { Loader } from '@lib/components/atoms/loader';
import { Table, Badge, Group, Text, Select, Stack, Title } from '@mantine/core';
import { useState } from 'react';

export const DeploymentsClientPage = disableSSR(function () {
  const [filterType, setFilterType] = useState<string | null>(null);

  const { data, isLoading } = useApi<Deployment[]>(
    '/collections/deployments?sort=name',
  );

  if (isLoading) {
    return <Loader />;
  }

  // Filter deployments by type if filterType is set
  const filteredData = filterType
    ? data?.filter((deployment) => deployment.type === filterType)
    : data;

  return (
    <Stack>
      <Title order={1} mb="md">
        Deployments
      </Title>
      <Select
        label="Filter by Type"
        placeholder="All Types"
        data={[
          { value: 'llm', label: 'LLM' },
          { value: 'weave', label: 'Weave' },
        ]}
        clearable
        value={filterType}
        onChange={setFilterType}
        maw={200}
      />
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Details</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData?.map((deployment) => (
            <Table.Tr key={deployment.id}>
              <Table.Td>
                <Text fw={500}>{deployment.name}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Badge variant="light" color="blue">
                    {deployment.type}
                  </Badge>
                  {deployment.type === 'llm' && (
                    <Badge variant="light" color="violet">
                      {deployment.model}
                    </Badge>
                  )}
                </Group>
              </Table.Td>
              <Table.Td>
                <Badge color={deployment.active ? 'green' : 'gray'}>
                  {deployment.active ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {deployment.type === 'weave' && deployment.requiresApiKey && (
                    <Badge variant="light" color="orange">
                      Requires API Key
                    </Badge>
                  )}
                  {deployment.type === 'weave' &&
                    deployment.supportedMethods && (
                      <Text size="sm" c="dimmed">
                        Methods: {deployment.supportedMethods.join(', ')}
                      </Text>
                    )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
});
