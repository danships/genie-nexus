import { Deployment } from '@genie-nexus/database';
import { getEntity } from '@lib/api/server-api';
import { DeploymentLlmDetailClientPage } from './_page-llm';
import { DeploymentWeaveDetailClientPage } from './_page-weave';

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

  const deployment = await getDeployment(id);

  return (
    <>
      {deployment.type === 'llm' && (
        <DeploymentLlmDetailClientPage deployment={deployment} />
      )}
      {deployment.type === 'weave' && (
        <DeploymentWeaveDetailClientPage deployment={deployment} />
      )}
    </>
  );
}
