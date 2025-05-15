import { Provider } from '@genie-nexus/database';
import { getEntity } from '@lib/api/server-api';
import { ProviderDetailClientPage } from './_page';

async function getProvider(id: string) {
  const provider = await getEntity<Provider>('providers', id);
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
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const provider = await getProvider(id);

  const refreshData = async () => {
    'use server';
    await getProvider(id);
  };

  return (
    <ProviderDetailClientPage provider={provider} refreshData={refreshData} />
  );
}
