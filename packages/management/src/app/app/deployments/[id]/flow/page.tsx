import { Flow } from '@genie-nexus/types';
import { getEntityByQuery } from '@lib/api/server-api';
import { redirect } from 'next/navigation';
import { getDeployment } from '../page';
import { FlowEditorClientPage } from './_page';

async function getFlow(deploymentId: string): Promise<Flow | null> {
  const flow = await getEntityByQuery<Flow>(
    'flows',
    `deploymentId=${deploymentId}&isDeleted=false`
  );
  return flow;
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

export default async function FlowEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [deployment, flow] = await Promise.all([
    getDeployment(id),
    getFlow(id),
  ]);

  if (deployment.type !== 'weave') {
    redirect('/app/deployments/' + id);
  }

  return <FlowEditorClientPage deployment={deployment} flow={flow} />;
}
