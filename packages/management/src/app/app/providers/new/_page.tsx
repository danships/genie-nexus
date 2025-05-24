'use client';

import { Provider } from '@genie-nexus/database';
import {
  OpenAIProviderApi,
  StaticLlmProviderApi,
  WeaveHttpProxyProviderApi,
  WeaveHttpStaticProviderApi,
  GoogleProviderApi,
} from '@genie-nexus/types';
import { ENDPOINT_PROVIDERS_OVERVIEW } from '@lib/api/swr-constants';
import { useApi, useCudApi } from '@lib/api/use-api';
import { Loader } from '@lib/components/atoms/loader';
import { ProviderGenericForm } from '@lib/components/molecules/provider-generic-form';
import {
  PROVIDER_TYPES_SUMMARY,
  PROVIDER_TYPES_TITLES,
} from '@lib/constants/providers';
import { Card, Grid, Title, Text, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export default function NewProviderClientPage() {
  const [selectedType, setSelectedType] = useState<Provider['type'] | null>(
    null,
  );
  const { post, inProgress } = useCudApi();
  const router = useRouter();

  const { mutate } = useApi(ENDPOINT_PROVIDERS_OVERVIEW);

  const handleSubmit = useCallback(
    async (values: { name: string }) => {
      let createdProvider: Provider | null = null;
      switch (selectedType) {
        case 'openai':
          const openaiProvider: OpenAIProviderApi = {
            type: 'openai',
            name: values.name,
            apiKey: 'sk-',
            baseURL: 'https://api.openai.com/v1',
          };
          const openaiCreateResponse = await post<
            { data: Provider },
            OpenAIProviderApi
          >(ENDPOINT_PROVIDERS_OVERVIEW, openaiProvider);
          createdProvider = openaiCreateResponse.data;
          break;
        case 'static':
          const staticProvider: StaticLlmProviderApi = {
            type: 'static',
            name: values.name,
          };
          const response = await post<{ data: Provider }, StaticLlmProviderApi>(
            ENDPOINT_PROVIDERS_OVERVIEW,
            staticProvider,
          );
          createdProvider = response.data;
          break;
        case 'http-proxy':
          const httpProxyProvider: WeaveHttpProxyProviderApi = {
            type: 'http-proxy',
            name: values.name,
            baseUrl: 'https://',
          };
          const httpProxyCreateResponse = await post<
            { data: Provider },
            WeaveHttpProxyProviderApi
          >(ENDPOINT_PROVIDERS_OVERVIEW, httpProxyProvider);
          createdProvider = httpProxyCreateResponse.data;
          break;
        case 'http-static':
          const httpStaticProvider: WeaveHttpStaticProviderApi = {
            type: 'http-static',
            name: values.name,
          };
          const httpStaticCreateResponse = await post<
            { data: Provider },
            WeaveHttpStaticProviderApi
          >(ENDPOINT_PROVIDERS_OVERVIEW, httpStaticProvider);
          createdProvider = httpStaticCreateResponse.data;
          break;
        case 'google':
          const googleProvider: GoogleProviderApi = {
            type: 'google',
            name: values.name,
            apiKey: '',
          };
          const googleCreateResponse = await post<
            { data: Provider },
            GoogleProviderApi
          >(ENDPOINT_PROVIDERS_OVERVIEW, googleProvider);
          createdProvider = googleCreateResponse.data;
          break;
      }

      if (createdProvider) {
        void router.push(`/app/providers/${createdProvider.id}?created=1`);
      }
      await mutate();
    },
    [selectedType],
  );

  return (
    <>
      <Title mb="xl">Select the type of provider to create</Title>
      {!selectedType && (
        <Grid gutter="xl">
          {Object.entries(PROVIDER_TYPES_SUMMARY).map(([type, summary]) => (
            <Grid.Col key={type} span={{ base: 6, md: 6, xs: 12 }}>
              <Card
                onClick={() => setSelectedType(type as Provider['type'])}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
              >
                <Group justify="space-between">
                  <div>
                    <Text fw={500} size="lg">
                      {PROVIDER_TYPES_TITLES[type as Provider['type']]}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {summary}
                    </Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
      {selectedType && (
        <>
          <Title order={2}>{PROVIDER_TYPES_TITLES[selectedType]}</Title>
          {inProgress && <Loader />}
          {!inProgress && <ProviderGenericForm name="" submit={handleSubmit} />}
        </>
      )}
    </>
  );
}
