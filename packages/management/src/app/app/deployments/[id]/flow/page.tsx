import type { WeaveFlow, WeaveFlowCreate } from "@genie-nexus/types";
import { createEntity, getEntityByQuery } from "@lib/api/server-api";
import { redirect } from "next/navigation";
import { getDeployment } from "../page";
import { FlowEditorClientPage } from "./_page";

async function getOrCreateFlow(deploymentId: string): Promise<WeaveFlow> {
  const flow = await getEntityByQuery<WeaveFlow>(
    "weaveflows",
    `deploymentId=${deploymentId}&isDeleted=false`
  );
  if (flow) {
    return flow;
  }
  return createFlow(deploymentId);
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

async function createFlow(deploymentId: string): Promise<WeaveFlow> {
  const flow = await createEntity<WeaveFlowCreate, WeaveFlow>("weaveflows", {
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
  const { id } = await params;

  const [deployment, flow] = await Promise.all([
    getDeployment(id),
    getOrCreateFlow(id),
  ]);

  if (deployment.type !== "weave") {
    redirect(`/app/deployments/${id}`);
  }

  return <FlowEditorClientPage deployment={deployment} flow={flow} />;
}
