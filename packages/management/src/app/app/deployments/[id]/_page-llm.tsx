'use client';

import { Provider } from '@genie-nexus/database';
import { DeploymentLLMApi, TenantApi } from '@genie-nexus/types';
import { useApi } from '@lib/api/use-api';
import { CodeHighlight } from '@lib/components/atoms/code-highlight';
import { Loader } from '@lib/components/atoms/loader';
import { PageTitle } from '@lib/components/atoms/page-title';
import { DetailCard } from '@lib/components/molecules/detail-card';
import { useServerUrl } from '@lib/hooks/use-server-url';
import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Grid,
  Group,
  Modal,
  Stack,
  Table,
  Tabs,
  Text,
} from '@mantine/core';
import {
  IconApi,
  IconBrain,
  IconClipboard,
  IconClipboardCheckFilled,
  IconCode,
  IconEdit,
  IconKey,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

type Properties = {
  deployment: DeploymentLLMApi & { id: string };
  tenant: TenantApi | null;
};

export function DeploymentLlmDetailClientPage({
  deployment,
  tenant,
}: Properties) {
  const { data: defaultProvider, isLoading: isLoadingDefaultProvider } =
    useApi<Provider>(() =>
      deployment.defaultProviderId
        ? `/collections/providers/${deployment.defaultProviderId}`
        : false
    );

  const serverUrl = useServerUrl(
    `/api/v1/${tenant ? `${tenant.id}/` : ''}${deployment.name}`
  );
  const [sdkModalOpen, setSdkModalOpen] = useState(false);

  const jsExample = `import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: '${serverUrl}',
  apiKey: 'your-api-key-here'
});

const completion = await openai.chat.completions.create({
  model: '${deployment.name}',
  messages: [
    { role: 'user', content: 'Hello, how are you?' }
  ]
});

console.log(completion.choices[0].message);`;

  const tsExample = `import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

const openai = new OpenAI({
  baseURL: '${serverUrl}',
  apiKey: 'your-api-key-here'
});

const messages: ChatCompletionMessageParam[] = [
  { role: 'user', content: 'Hello, how are you?' }
];

const completion = await openai.chat.completions.create({
  model: '${deployment.name}',
  messages
});

console.log(completion.choices[0].message);`;

  const pythonExample = `from openai import OpenAI

client = OpenAI(
    base_url='${serverUrl}',
    api_key='your-api-key-here'
)

completion = client.chat.completions.create(
    model='${deployment.name}',
    messages=[
        {'role': 'user', 'content': 'Hello, how are you?'}
    ]
)

print(completion.choices[0].message)`;

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
          <DetailCard icon={IconBrain} title="Endpoint Details">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Td>OpenAI Base URL</Table.Td>
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
                <Table.Tr>
                  <Table.Td>Default Model</Table.Td>
                  <Table.Td>{deployment.model}</Table.Td>
                </Table.Tr>
              </Table.Thead>
            </Table>
            <Button
              leftSection={<IconCode size={16} />}
              onClick={() => setSdkModalOpen(true)}
              variant="light"
              mt="md"
            >
              View SDK Examples
            </Button>
          </DetailCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailCard icon={IconKey} title="Model Details">
            <Text size="sm" c="dimmed">
              Model: {deployment.model}
            </Text>
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

      <Modal
        opened={sdkModalOpen}
        onClose={() => setSdkModalOpen(false)}
        title="SDK Examples"
        size="xl"
      >
        <Tabs defaultValue="typescript">
          <Tabs.List>
            <Tabs.Tab value="typescript">TypeScript</Tabs.Tab>
            <Tabs.Tab value="javascript">JavaScript</Tabs.Tab>
            <Tabs.Tab value="python">Python</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="typescript" pt="md">
            <CodeHighlight language="typescript" code={tsExample} />
            <CopyButton value={tsExample}>
              {({ copied, copy }) => (
                <Button
                  variant="light"
                  leftSection={
                    copied ? <IconClipboardCheckFilled /> : <IconClipboard />
                  }
                  onClick={copy}
                  mt="md"
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              )}
            </CopyButton>
          </Tabs.Panel>

          <Tabs.Panel value="javascript" pt="md">
            <CodeHighlight language="js" code={jsExample} />
            <CopyButton value={jsExample}>
              {({ copied, copy }) => (
                <Button
                  variant="light"
                  leftSection={
                    copied ? <IconClipboardCheckFilled /> : <IconClipboard />
                  }
                  onClick={copy}
                  mt="md"
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              )}
            </CopyButton>
          </Tabs.Panel>

          <Tabs.Panel value="python" pt="md">
            <CodeHighlight language="python" code={pythonExample} />
            <CopyButton value={pythonExample}>
              {({ copied, copy }) => (
                <Button
                  variant="light"
                  leftSection={
                    copied ? <IconClipboardCheckFilled /> : <IconClipboard />
                  }
                  onClick={copy}
                  mt="md"
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              )}
            </CopyButton>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </Stack>
  );
}
