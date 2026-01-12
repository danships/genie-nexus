import { TypeSymbols } from '@genie-nexus/container';
import type { Deployment, DeploymentRepository } from '@genie-nexus/database';
import { getContainer } from '@lib/core/get-container';

export async function getDeploymentBySlug(
  tenantId: string,
  slug: string,
  expectedType: Deployment['type']
): Promise<Deployment> {
  const container = await getContainer();
  const deploymentRepository = container.resolve<DeploymentRepository>(
    TypeSymbols.DEPLOYMENT_REPOSITORY
  );

  const deployment = await deploymentRepository.getOneByQuery(
    deploymentRepository.createQuery().eq('tenantId', tenantId).eq('slug', slug)
  );

  if (deployment === null) {
    throw new Error('Deployment not found');
  }

  if (!deployment.active || deployment.isDeleted) {
    throw new Error('Deployment is not active');
  }

  if (deployment.type !== expectedType) {
    throw new Error(`Deployment is not of type ${expectedType}`);
  }

  return deployment;
}
