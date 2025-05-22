import { Deployment } from '@genie-nexus/database';
import { getEntity } from '@lib/api/server-api';
import { DeploymentWeaveFormClientPage } from '../_page-weave-form';

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
    title: `Edit ${deployment.name}`,
  };
}

export default async function DeploymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const deployment = await getDeployment(id);
  if (deployment.type !== 'weave') {
    throw new Error('Deployment is not a weave deployment.');
  }

  return <DeploymentWeaveFormClientPage deployment={deployment} />;
}
