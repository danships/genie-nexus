'use client';

import { ApiKey } from '@genie-nexus/database';
import { ENDPOINT_APIKEYS_OVERVIEW } from '@lib/api/swr-constants';
import { useCudApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { Loader } from '@lib/components/atoms/loader';
import {
  ActionIcon,
  Button,
  Code,
  CopyButton,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconClipboard, IconClipboardCheckFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

type ApiKeyFormValues = {
  label: string;
  type: ApiKey['type'];
};

export const NewApiKeyPage = disableSSR(function () {
  const router = useRouter();
  const { post, inProgress } = useCudApi();

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const { mutate } = useSWRConfig();

  const form = useForm<ApiKeyFormValues>({
    initialValues: {
      label: '',
      type: 'llm-api-key',
    },
    validate: {
      label: (value) =>
        value.trim().length < 2 ? 'Label must be at least 2 characters' : null,
      type: (value) => (!value ? 'Type is required' : null),
    },
  });

  const handleSubmit = async (values: ApiKeyFormValues) => {
    try {
      const response = await post<{ data: { apiKey: string } }>('/api-keys', {
        label: values.label,
        type: values.type,
      });
      void mutate(ENDPOINT_APIKEYS_OVERVIEW);
      setCreatedKey(response.data.apiKey);
      setShowKeyModal(true);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to create API key',
        color: 'red',
      });
    }
  };

  const handleCloseModal = () => {
    setShowKeyModal(false);
    setCreatedKey(null);
    void router.push('/app/api-keys');
  };

  return (
    <Stack>
      <Title order={1}>Create New API Key</Title>
      <Text c="dimmed" mb="lg">
        Create a new API key for accessing the Genie Nexus API or its management
        interface.
      </Text>

      {inProgress && <Loader />}
      {!inProgress && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Label"
              placeholder="Enter a label for this API key"
              description="This label will help you identify the key's purpose"
              required
              {...form.getInputProps('label')}
            />

            <Select
              label="Type"
              placeholder="Select the type of API key"
              description="Choose whether this is a management key or an API key"
              required
              data={[
                { value: 'management-key', label: 'Management Key' },
                { value: 'llm-api-key', label: 'LLM API Key' },
                { value: 'weave-api-key', label: 'Weave API Key' },
              ]}
              {...form.getInputProps('type')}
            />

            <Button type="submit">Create API Key</Button>
          </Stack>
        </form>
      )}

      <Modal
        opened={showKeyModal}
        onClose={handleCloseModal}
        title="API Key Created"
        size="lg"
      >
        <Stack>
          <Text>
            Your API key has been created successfully. Please copy it now as
            you won't be able to see it again.
          </Text>

          {createdKey && (
            <Group gap="xs">
              <Code fw={500} style={{ flex: 1 }}>
                {createdKey}
              </Code>
              <CopyButton value={createdKey}>
                {({ copied, copy }) => (
                  <ActionIcon color="dimmed" onClick={copy} size="lg">
                    {copied ? <IconClipboardCheckFilled /> : <IconClipboard />}
                  </ActionIcon>
                )}
              </CopyButton>
            </Group>
          )}

          <Text size="sm" c="dimmed">
            Make sure to store this key in a secure location. You won't be able
            to see it again after closing this dialog.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button onClick={handleCloseModal}>I've copied the key</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
});
