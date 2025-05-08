'use client';

import { Provider } from '@genie-nexus/database';
import { useApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { Loader } from '@lib/components/atoms/loader';
import { Table, Badge, Group, Text, Title, Select } from '@mantine/core';
import { useState } from 'react';

export const ProvidersClientPage = disableSSR(function () {
  const [filterType, setFilterType] = useState<string | null>(null);
  const { data, isLoading } = useApi<Provider[]>(
    '/collections/providers?sort=name',
  );

  if (isLoading) {
    return <Loader />;
  }

  // Filter providers by type if filterType is set
  const filteredData = filterType
    ? data?.filter((provider) => provider.type === filterType)
    : data;

  return (
    <>
      <Title order={1} mb="md">
        Providers
      </Title>
      <Select
        label="Filter by Type"
        placeholder="All Types"
        data={[
          { value: 'openai', label: 'OpenAI' },
          { value: 'static', label: 'Static' },
          { value: 'http-proxy', label: 'HTTP Proxy' },
          { value: 'http-static', label: 'HTTP Static' },
        ]}
        clearable
        value={filterType}
        onChange={setFilterType}
        maw={200}
        mb="md"
      />
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Details</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData?.map((provider) => (
            <Table.Tr key={provider.id}>
              <Table.Td>
                <Text fw={500}>{provider.name}</Text>
              </Table.Td>
              <Table.Td>
                <Badge variant="light" color="blue">
                  {provider.type}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {provider.type === 'openai' && provider.apiKey && (
                    <Badge variant="light" color="orange">
                      API Key Set
                    </Badge>
                  )}
                  {provider.type === 'openai' && provider.baseURL && (
                    <Text size="sm" c="dimmed">
                      Base URL: {provider.baseURL}
                    </Text>
                  )}
                  {provider.type === 'http-proxy' && provider.baseUrl && (
                    <Text size="sm" c="dimmed">
                      Proxy URL: {provider.baseUrl}
                    </Text>
                  )}
                  {provider.type === 'http-static' && provider.statusCode && (
                    <Badge variant="light" color="gray">
                      Status: {provider.statusCode}
                    </Badge>
                  )}
                  {provider.type === 'http-static' && provider.body && (
                    <Text size="sm" c="dimmed">
                      Body: {provider.body.slice(0, 30)}
                      {provider.body.length > 30 ? '...' : ''}
                    </Text>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
});
