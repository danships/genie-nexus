'use client';

import type { Deployment } from '@genie-nexus/database';
import { useApi, useCudApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { Loader } from '@lib/components/atoms/loader';
import {
  Table,
  Badge,
  Group,
  Text,
  Select,
  Stack,
  Title,
  Button,
  Modal,
} from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ENDPOINT_DEPLOYMENTS_OVERVIEW } from '@lib/api/swr-constants';
import { notifications } from '@mantine/notifications';

export const DeploymentsClientPage = disableSSR(function () {
  const router = useRouter();
  const [filterType, setFilterType] = useState<string | null>(null);
  const { data, isLoading, mutate } = useApi<Deployment[]>(
    ENDPOINT_DEPLOYMENTS_OVERVIEW,
  );
  const { patch } = useCudApi();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deploymentToDelete, setDeploymentToDelete] =
    useState<Deployment | null>(null);

  if (isLoading) {
    return <Loader />;
  }

  // Filter deployments by type if filterType is set
  const filteredData = filterType
    ? data?.filter((deployment) => deployment.type === filterType)
    : data;

  const handleDelete = async () => {
    if (!deploymentToDelete) return;

    try {
      await patch<{ data: Deployment }>(
        `/collections/deployments/${deploymentToDelete.id}`,
        {
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        },
      );
      void mutate();
      notifications.show({
        title: 'Success',
        message: 'Deployment deleted successfully',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete deployment',
        color: 'red',
      });
    } finally {
      setDeleteModalOpen(false);
      setDeploymentToDelete(null);
    }
  };

  const openDeleteModal = (deployment: Deployment, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeploymentToDelete(deployment);
    setDeleteModalOpen(true);
  };

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={1}>Deployments</Title>
        <Button onClick={() => router.push('/app/deployments/new')}>
          New Deployment
        </Button>
      </Group>
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
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData?.map((deployment) => (
            <Table.Tr
              key={deployment.id}
              onClick={() => router.push(`/app/deployments/${deployment.id}`)}
              className="is-clickable"
            >
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
              <Table.Td>
                <Button
                  variant="light"
                  color="red"
                  size="xs"
                  onClick={(e) => openDeleteModal(deployment, e)}
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
          setDeploymentToDelete(null);
        }}
        title="Delete Deployment"
      >
        <Text>Are you sure you want to delete {deploymentToDelete?.name}?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" size="xs" onClick={() => void handleDelete()}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
});
