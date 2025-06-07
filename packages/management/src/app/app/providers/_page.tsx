'use client';

import type { Provider } from '@genie-nexus/database';
import { ENDPOINT_PROVIDERS_OVERVIEW } from '@lib/api/swr-constants';
import { useApi, useCudApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { Loader } from '@lib/components/atoms/loader';
import { debugLogger } from '@lib/core/debug-logger';
import {
  Badge,
  Button,
  Group,
  Modal,
  Select,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ProvidersClientPage = disableSSR(function () {
  const router = useRouter();
  const [filterType, setFilterType] = useState<string | null>(null);
  const { data, isLoading, mutate } = useApi<Provider[]>(
    ENDPOINT_PROVIDERS_OVERVIEW
  );
  const { patch } = useCudApi();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(
    null
  );

  if (isLoading) {
    return <Loader />;
  }

  // Filter providers by type if filterType is set
  const filteredData = filterType
    ? data?.filter((provider) => provider.type === filterType)
    : data;

  const handleDelete = async () => {
    if (!providerToDelete) return;

    try {
      await patch<{ data: Provider }>(
        `/collections/providers/${providerToDelete.id}`,
        {
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        }
      );
      void mutate();
      notifications.show({
        title: 'Success',
        message: 'Provider deleted successfully',
        color: 'green',
      });
    } catch (err) {
      debugLogger('Failed to delete provider:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete provider',
        color: 'red',
      });
    } finally {
      setDeleteModalOpen(false);
      setProviderToDelete(null);
    }
  };

  const openDeleteModal = (provider: Provider, e: React.MouseEvent) => {
    e.stopPropagation();
    setProviderToDelete(provider);
    setDeleteModalOpen(true);
  };

  return (
    <>
      <Title order={1} mb="md">
        Providers
      </Title>
      <Group justify="space-between">
        <Select
          label="Filter by Type"
          placeholder="All Types"
          data={[
            { value: 'openai', label: 'OpenAI' },
            { value: 'static', label: 'Static' },
            { value: 'http-proxy', label: 'HTTP Proxy' },
            { value: 'http-static', label: 'HTTP Static' },
            { value: 'google', label: 'Google Generative AI' },
          ]}
          clearable
          value={filterType}
          onChange={setFilterType}
          maw={200}
          mb="md"
        />
        <Button component={Link} href="/app/providers/new" variant="light">
          Create Provider
        </Button>
      </Group>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Details</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData?.map((provider) => (
            <Table.Tr
              key={provider.id}
              onClick={() => router.push(`/app/providers/${provider.id}`)}
              style={{ cursor: 'pointer' }}
            >
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
                  {provider.type === 'google' && provider.apiKey && (
                    <Badge variant="light" color="orange">
                      API Key Set
                    </Badge>
                  )}
                </Group>
              </Table.Td>
              <Table.Td>
                <Button
                  variant="light"
                  color="red"
                  size="xs"
                  onClick={(e) => openDeleteModal(provider, e)}
                >
                  Delete
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProviderToDelete(null);
        }}
        title="Delete Provider"
      >
        <Text>Are you sure you want to delete {providerToDelete?.name}?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" size="xs" onClick={() => void handleDelete()}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
});
