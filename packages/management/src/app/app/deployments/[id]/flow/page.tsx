import type {
  LlmFlow,
  LlmFlowCreate,
  WeaveFlow,
  WeaveFlowCreate,
} from '@genie-nexus/types';
import { createEntity, getEntityByQuery } from '@lib/api/server-api';
import { connection } from 'next/server';
import { getDeployment } from '../page';
import { FlowEditorClientPage } from './_page';

async function getOrCreateWeaveFlow(deploymentId: string): Promise<WeaveFlow> {
  const flow = await getEntityByQuery<WeaveFlow>(
    'weaveflows',
    `deploymentId=${deploymentId}&isDeleted=false`
  );
  if (flow) {
    return flow;
  }
  return createWeaveFlow(deploymentId);
}

async function getOrCreateLlmFlow(deploymentId: string): Promise<LlmFlow> {
  const flow = await getEntityByQuery<LlmFlow>(
    'llmflows',
    `deploymentId=${deploymentId}&isDeleted=false`
  );
  if (flow) {
    return flow;
  }
  return createLlmFlow(deploymentId);
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

async function createWeaveFlow(deploymentId: string): Promise<WeaveFlow> {
  const flow = await createEntity<WeaveFlowCreate, WeaveFlow>('weaveflows', {
    deploymentId,
    events: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return flow;
}

async function createLlmFlow(deploymentId: string): Promise<LlmFlow> {
  const flow = await createEntity<LlmFlowCreate, LlmFlow>('llmflows', {
    deploymentId,
    events: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return flow;
}

export default async function FlowEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;

  const deployment = await getDeployment(id);
  const flow = await (deployment.type === 'weave'
    ? getOrCreateWeaveFlow(id)
    : getOrCreateLlmFlow(id));

  return (
    <FlowEditorClientPage<typeof flow> deployment={deployment} flow={flow} />
  );
}
