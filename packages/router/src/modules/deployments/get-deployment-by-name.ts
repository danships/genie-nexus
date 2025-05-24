import { getDeploymentRepository } from '../../core/db/index.js';
import type { Deployment } from '@genie-nexus/database';

export async function getDeploymentByName(
  tenantId: string,
  name: string,
  expectedType: Deployment['type'],
): Promise<Deployment> {
  const deploymentRepository = await getDeploymentRepository();
  const deployment = await deploymentRepository.getOneByQuery(
    deploymentRepository
      .createQuery()
      .eq('tenantId', tenantId)
      .eq('name', name),
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
