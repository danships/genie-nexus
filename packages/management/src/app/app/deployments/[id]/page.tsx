import { Deployment } from '@genie-nexus/database';
import { getConfiguration, getEntity } from '@lib/api/server-api';
import { DeploymentWeaveDetailClientPage } from './_page-weave';
import { DeploymentLlmDetailClientPage } from './_page-llm';

async function getDeployment(id: string) {
  const deployment = await getEntity<Deployment>('deployments', id);
  return deployment;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deployment = await getDeployment(id);

  return {
    title: `Deployment ${deployment.name}`,
  };
}

export default async function DeploymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [deployment, configuration] = await Promise.all([
    getDeployment(id),
    getConfiguration(),
  ]);

  return (
    <>
      {deployment.type === 'llm' && (
        <DeploymentLlmDetailClientPage
          tenant={configuration.defaultTenant ? null : configuration.tenant}
          deployment={deployment}
        />
      )}
      {deployment.type === 'weave' && (
        <DeploymentWeaveDetailClientPage deployment={deployment} />
      )}
    </>
  );
}
