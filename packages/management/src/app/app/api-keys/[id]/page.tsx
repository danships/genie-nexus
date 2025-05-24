import { getEntities, getEntity } from '@lib/api/server-api';
import { ApiKeyLlmDetailClientPage } from './_page-llm';
import { ApiKeyApi, DeploymentApi } from '@genie-nexus/types';
import { ApiKeyWeaveDetailClientPage } from './_page-weave';

async function getApiKey(id: string) {
  const apiKey = await getEntity<ApiKeyApi>('apikeys', id);
  return apiKey;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apiKey = await getApiKey(id);

  return {
    title: `API Key ${apiKey.label}`,
  };
}

export default async function ApiKeyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [apiKey, deployments] = await Promise.all([
    getApiKey(id),
    getEntities<DeploymentApi>(
      'deployments',
      `limit=-1&sort=name&isDeleted=false`,
    ),
  ]);

  return (
    <>
      {apiKey.type === 'llm-api-key' && (
        <ApiKeyLlmDetailClientPage
          apiKey={apiKey}
          deployments={deployments.filter(
            (deployment) => deployment.type === 'llm',
          )}
        />
      )}
      {apiKey.type === 'weave-api-key' && (
        <ApiKeyWeaveDetailClientPage
          apiKey={apiKey}
          deployments={deployments.filter(
            (deployment) => deployment.type === 'weave',
          )}
        />
      )}
    </>
  );
}
