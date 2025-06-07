import type { Deployment } from '@genie-nexus/database';
import { getConfiguration, getEntity } from '@lib/api/server-api';
import { UserRequired } from '@lib/components/molecules/user-required';
import { DeploymentLlmDetailClientPage } from './_page-llm';
import { DeploymentWeaveDetailClientPage } from './_page-weave';

export async function getDeployment(id: string) {
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
    <UserRequired>
      {deployment.type === 'llm' && (
        <DeploymentLlmDetailClientPage
          tenant={configuration.defaultTenant ? null : configuration.tenant}
          deployment={deployment}
        />
      )}
      {deployment.type === 'weave' && (
        <DeploymentWeaveDetailClientPage deployment={deployment} />
      )}
    </UserRequired>
  );
}
