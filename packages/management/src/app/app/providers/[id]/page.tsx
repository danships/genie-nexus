import type { Provider } from '@genie-nexus/database';
import { getEntity } from '@lib/api/server-api';
import { ProviderDetailClientPage } from './_page';

async function getProvider(id: string) {
  const provider = await getEntity<Provider>('providers', id);
  if ('apiKey' in provider) {
    provider.apiKey = '';
  }
  return provider;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = await getProvider(id);

  return {
    title: `Provider ${provider.name}`,
  };
}

export default async function ComponentEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const provider = await getProvider(id);

  return (
    <ProviderDetailClientPage provider={provider} created={created === '1'} />
  );
}
