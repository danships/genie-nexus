import { DeploymentWeave } from '@genie-nexus/types';
import { PageTitle } from '@lib/components/atoms/page-title';
import { Stack } from '@mantine/core';
import { redirect } from 'next/navigation';
import { getDeployment } from '../page';
import { FlowEditorClientPage } from './_page';

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

  const deployment = await getDeployment(id);

  if (deployment.type !== 'weave') {
    redirect('/app/deployments/' + id);
  }

  return <FlowEditorClientPage />;
}
