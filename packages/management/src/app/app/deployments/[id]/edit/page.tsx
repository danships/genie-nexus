import type { Deployment } from '@genie-nexus/database';
import { getEntity } from '@lib/api/server-api';
import { UserRequired } from '@lib/components/molecules/user-required';
import { connection } from 'next/server';
import { DeploymentLlmFormClientPage } from './_page-llm-form';
import { DeploymentWeaveFormClientPage } from './_page-weave-form';

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
  await connection();
  const { id } = await params;

  const deployment = await getDeployment(id);

  return (
    <UserRequired>
      {deployment.type === 'weave' && (
        <DeploymentWeaveFormClientPage deployment={deployment} />
      )}
      {deployment.type === 'llm' && (
        <DeploymentLlmFormClientPage deployment={deployment} />
      )}
    </UserRequired>
  );
}
