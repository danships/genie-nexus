/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import type { ApiKey } from '@genie-nexus/database';
import { ENDPOINT_APIKEYS_OVERVIEW } from '@lib/api/swr-constants';
import { useApi, useCudApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { Loader } from '@lib/components/atoms/loader';
import { RelativeTime } from '@lib/components/atoms/relative-time';
import {
  Badge,
  Button,
  Code,
  Group,
  Modal,
  Notification,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TYPE_LABELS: Record<ApiKey['type'], string> = {
  'management-key': 'Management',
  'llm-api-key': 'LLM API',
  'weave-api-key': 'Weave API',
};

export const ApiKeysClientPage = disableSSR(function () {
  const router = useRouter();
  const { data, isLoading, mutate } = useApi<ApiKey[]>(
    ENDPOINT_APIKEYS_OVERVIEW
  );
  const { delete: deleteApiKey } = useCudApi();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [apiKeyToDelete, setApiKeyToDelete] = useState<ApiKey | null>(null);

  if (isLoading) {
    return <Loader />;
  }

  const handleDelete = async () => {
    if (!apiKeyToDelete) return;

    try {
      await deleteApiKey<{ data: ApiKey }>(
        `/collections/apikeys/${apiKeyToDelete.id}`
      );
      void mutate();
      notifications.show({
        title: 'Success',
        message: 'API key deleted successfully',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete API key',
        color: 'red',
      });
    } finally {
      setDeleteModalOpen(false);
      setApiKeyToDelete(null);
    }
  };

  const openDeleteModal = (apiKey: ApiKey, e: React.MouseEvent) => {
    e.stopPropagation();
    setApiKeyToDelete(apiKey);
    setDeleteModalOpen(true);
  };

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={1}>API Keys</Title>
        <Button onClick={() => void router.push('/app/api-keys/new')}>
          New API Key
        </Button>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Label</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Key</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Active</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.map((apiKey) => (
            <Table.Tr
              key={apiKey.id}
              onClick={() => void router.push(`/app/api-keys/${apiKey.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Table.Td>
                <Text fw={500}>{apiKey.label}</Text>
              </Table.Td>
              <Table.Td>
                <Badge
                  variant="light"
                  color={apiKey.type === 'management-key' ? 'blue' : 'green'}
                >
                  {TYPE_LABELS[apiKey.type]}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Code>{apiKey.keyPreview}...</Code>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  <RelativeTime date={apiKey.createdAt} />
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge variant="light" color={!apiKey.active ? 'red' : 'green'}>
                  {!apiKey.active ? 'Inactive' : 'Active'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Button
                  variant="light"
                  color="red"
                  size="xs"
                  onClick={(e) => openDeleteModal(apiKey, e)}
                >
                  Delete
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {!isLoading && data?.length === 0 && (
        <Notification color="yellow" withCloseButton={false}>
          There are no API Keys available
        </Notification>
      )}

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete API Key"
      >
        <Text>Are you sure you want to delete this API key?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
});
