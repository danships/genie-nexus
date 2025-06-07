'use client';
import type { Provider } from '@genie-nexus/database';
import type {
  OpenAIProvider,
  WeaveHttpProxyProvider,
  WeaveHttpStaticProvider,
} from '@genie-nexus/types';
import { ENDPOINT_PROVIDERS_OVERVIEW } from '@lib/api/swr-constants';
import { useApi, useCudApi } from '@lib/api/use-api';
import { Loader } from '@lib/components/atoms/loader';
import { ProviderGenericForm } from '@lib/components/molecules/provider-generic-form';
import { ProviderGoogleForm } from '@lib/components/molecules/provider-google-form';
import { ProviderHttpProxyForm } from '@lib/components/molecules/provider-http-proxy-form';
import { ProviderHttpStaticForm } from '@lib/components/molecules/provider-http-static-form';
import { ProviderOpenAIForm } from '@lib/components/molecules/provider-openai-form';
import { PROVIDER_TYPES_SUMMARY } from '@lib/constants/providers';
import { Notification, Tabs, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TAB_DETAILS = 'details';
const TAB_STATIC_LLM = 'static-llm';
const TAB_HTTP_STATIC = 'http-static';
const TAB_HTTP_PROXY = 'http-proxy';
const TAB_OPENAI = 'openai';
const TAB_GOOGLE = 'google';

type Properties = {
  provider: Provider;
  created?: boolean;
};

// open ai
// static llm
// weave http proxy
// weave http static

export function ProviderDetailClientPage({
  provider: initialProvider,
  created,
}: Properties) {
  const { patch, inProgress } = useCudApi();
  const [provider, setProvider] = useState<Provider>(initialProvider);
  const { mutate } = useApi(ENDPOINT_PROVIDERS_OVERVIEW);
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<
    | typeof TAB_DETAILS
    | typeof TAB_STATIC_LLM
    | typeof TAB_HTTP_STATIC
    | typeof TAB_HTTP_PROXY
    | typeof TAB_OPENAI
    | typeof TAB_GOOGLE
  >(TAB_DETAILS);

  const handleGenericSubmit = async (values: { name: string }) => {
    const updatedProviderResponse = await patch<{ data: Provider }>(
      `/collections/providers/${provider.id}`,
      values
    );
    setProvider(updatedProviderResponse.data);
    void mutate(); // Make sure the overview list is updated
  };

  const handleHttpStaticProviderSubmit = async (
    values: Pick<
      WeaveHttpStaticProvider,
      'statusCode' | 'body' | 'responseHeaders'
    >
  ) => {
    const updatedProviderResponse = await patch<{ data: Provider }>(
      `/collections/providers/${provider.id}`,
      values
    );
    setProvider(updatedProviderResponse.data);
  };

  const handleHttpProxyProviderSubmit = async (
    values: Pick<
      WeaveHttpProxyProvider,
      'baseUrl' | 'requestHeaders' | 'responseHeaders'
    >
  ) => {
    const updatedProviderResponse = await patch<{ data: Provider }>(
      `/collections/providers/${provider.id}`,
      values
    );
    setProvider(updatedProviderResponse.data);
  };

  const handleClose = () => {
    router.push(`/app/providers/${provider.id}`);
  };

  const handleOpenAISubmit = async (values: {
    baseURL: string;
    apiKey?: string;
  }) => {
    const updatedProviderResponse = await patch<{ data: OpenAIProvider }>(
      `/collections/providers/${provider.id}`,
      values
    );
    setProvider({ ...updatedProviderResponse.data, apiKey: '' });
  };

  const handleGoogleSubmit = async (values: { apiKey: string }) => {
    const updatedProviderResponse = await patch<{ data: Provider }>(
      `/collections/providers/${provider.id}`,
      values
    );
    setProvider(updatedProviderResponse.data);
  };

  return (
    <>
      <Title order={1}>Viewing {provider.name}</Title>
      {created && (
        <Notification
          m="md"
          color="green"
          title="Provider created"
          onClose={handleClose}
        >
          Your provider has been created.
        </Notification>
      )}
      {inProgress && <Loader />}
      {!inProgress && (
        <Tabs
          value={selectedTab}
          onChange={(tab: string | null) =>
            setSelectedTab(
              (tab as
                | typeof TAB_DETAILS
                | typeof TAB_STATIC_LLM
                | typeof TAB_HTTP_STATIC
                | typeof TAB_HTTP_PROXY
                | typeof TAB_OPENAI
                | typeof TAB_GOOGLE) ?? TAB_DETAILS
            )
          }
        >
          <Tabs.List>
            <Tabs.Tab value={TAB_DETAILS}>Details</Tabs.Tab>
            {provider.type === 'static' && (
              <Tabs.Tab value={TAB_STATIC_LLM}>Static LLM Details</Tabs.Tab>
            )}
            {provider.type === 'http-static' && (
              <Tabs.Tab value={TAB_HTTP_STATIC}>
                Static Response Details
              </Tabs.Tab>
            )}
            {provider.type === 'http-proxy' && (
              <Tabs.Tab value={TAB_HTTP_PROXY}>HTTP Proxy Details</Tabs.Tab>
            )}
            {provider.type === 'openai' && (
              <Tabs.Tab value={TAB_OPENAI}>OpenAI API details</Tabs.Tab>
            )}
            {provider.type === 'google' && (
              <Tabs.Tab value={TAB_GOOGLE}>Google AI details</Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value={TAB_DETAILS}>
            <Text mb="md">{PROVIDER_TYPES_SUMMARY[provider.type]}</Text>
            <ProviderGenericForm
              name={provider.name}
              submit={handleGenericSubmit}
            />
          </Tabs.Panel>
          <Tabs.Panel value={TAB_STATIC_LLM}>
            <Text>
              There are no configuration options for static LLM providers.
            </Text>
            <Text>
              Use a Static LLM Provider to test your deployments. It will return
              the given prompt, with no delay.
            </Text>
          </Tabs.Panel>

          <Tabs.Panel value={TAB_HTTP_STATIC}>
            <Text mb="md">
              Configure the static response for this provider below. All fields
              are optional.
            </Text>
            <hr />
            {provider.type === 'http-static' && (
              <ProviderHttpStaticForm
                provider={provider}
                submit={handleHttpStaticProviderSubmit}
              />
            )}
          </Tabs.Panel>

          <Tabs.Panel value={TAB_HTTP_PROXY}>
            <Text>Configure the request details for the proxy.</Text>
            <hr />
            {provider.type === 'http-proxy' && (
              <ProviderHttpProxyForm
                provider={provider}
                submit={handleHttpProxyProviderSubmit}
              />
            )}
          </Tabs.Panel>

          <Tabs.Panel value={TAB_OPENAI}>
            <Text>Configure the OpenAI API details for this provider.</Text>
            <hr />
            {provider.type === 'openai' && (
              <ProviderOpenAIForm
                provider={provider}
                submit={handleOpenAISubmit}
              />
            )}
          </Tabs.Panel>

          <Tabs.Panel value={TAB_GOOGLE}>
            <Text>Configure the Google AI API details for this provider.</Text>
            <hr />
            {provider.type === 'google' && (
              <ProviderGoogleForm
                provider={provider}
                submit={handleGoogleSubmit}
              />
            )}
          </Tabs.Panel>
        </Tabs>
      )}
    </>
  );
}
