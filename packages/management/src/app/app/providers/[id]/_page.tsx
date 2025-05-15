'use client';
import { Provider } from '@genie-nexus/database';
import {
  WeaveHttpProxyProvider,
  WeaveHttpStaticProvider,
} from '@genie-nexus/types';
import { ENDPOINT_PROVIDERS_OVERVIEW } from '@lib/api/swr-constants';
import { useCudApi } from '@lib/api/use-api';
import { Loader } from '@lib/components/atoms/loader';
import { ProviderGenericForm } from '@lib/components/molecules/provider-generic-form';
import { ProviderHttpProxyForm } from '@lib/components/molecules/provider-http-proxy-form';
import { ProviderHttpStaticForm } from '@lib/components/molecules/provider-http-static-form';
import { Tabs, Text, Title } from '@mantine/core';
import { useState } from 'react';
import useSWR from 'swr';

const TAB_DETAILS = 'details';
const TAB_STATIC_LLM = 'static-llm';
const TAB_HTTP_STATIC = 'http-static';
const TAB_HTTP_PROXY = 'http-proxy';

const PROVIDER_TYPES_SUMMARY: Record<Provider['type'], string> = {
  openai: 'OpenAI - Provider for connecting to OpenAI API endpoints',
  static: 'Static LLM - Provider that returns static/hardcoded responses',
  'http-proxy':
    'Weave HTTP Proxy - Provider that forwards requests to another HTTP endpoint',
  'http-static':
    'Weave HTTP Static - Provider that returns static HTTP responses with configurable headers and body',
};

type Properties = {
  provider: Provider;
  refreshData: () => Promise<void>;
};

// open ai
// static llm
// weave http proxy
// weave http static

export function ProviderDetailClientPage({
  provider: initialProvider,
}: Properties) {
  const { patch, inProgress } = useCudApi();
  const [provider, setProvider] = useState<Provider>(initialProvider);
  const { mutate } = useSWR(ENDPOINT_PROVIDERS_OVERVIEW);

  const [selectedTab, setSelectedTab] = useState<
    typeof TAB_DETAILS | typeof TAB_STATIC_LLM | typeof TAB_HTTP_STATIC
  >(TAB_DETAILS);

  const handleGenericSubmit = async (values: { name: string }) => {
    const updatedProviderResponse = await patch<{ data: Provider }>(
      `/collections/providers/${provider.id}`,
      values,
    );
    setProvider(updatedProviderResponse.data);
    void mutate(); // Make sure the overview list is updated
  };

  const handleHttpStaticProviderSubmit = async (
    values: Pick<
      WeaveHttpStaticProvider,
      'statusCode' | 'body' | 'responseHeaders'
    >,
  ) => {
    const updatedProviderResponse = await patch<{ data: Provider }>(
      `/collections/providers/${provider.id}`,
      values,
    );
    setProvider(updatedProviderResponse.data);
  };

  const handleHttpProxyProviderSubmit = async (
    values: Pick<
      WeaveHttpProxyProvider,
      'baseUrl' | 'requestHeaders' | 'responseHeaders'
    >,
  ) => {
    const updatedProviderResponse = await patch<{ data: Provider }>(
      `/collections/providers/${provider.id}`,
      values,
    );
    setProvider(updatedProviderResponse.data);
  };

  return (
    <>
      <Title order={1}>Viewing {provider.name}</Title>
      {inProgress && <Loader />}
      {!inProgress && (
        <Tabs
          value={selectedTab}
          onChange={(tab: string | null) =>
            setSelectedTab(
              (tab as
                | typeof TAB_DETAILS
                | typeof TAB_STATIC_LLM
                | typeof TAB_HTTP_STATIC) ?? TAB_DETAILS,
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
        </Tabs>
      )}
    </>
  );
}
