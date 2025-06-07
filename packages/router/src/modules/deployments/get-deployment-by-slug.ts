import type { Deployment } from '@genie-nexus/database';
import { getDeploymentRepository } from '../../core/db/index.js';

export async function getDeploymentBySlug(
  tenantId: string,
  slug: string,
  expectedType: Deployment['type']
): Promise<Deployment> {
  const deploymentRepository = await getDeploymentRepository();
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
