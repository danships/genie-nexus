import { getDeploymentRepository } from '../../core/db';
import type { Deployment } from '../../core/db/types';

export async function getDeploymentByName(
  tenantId: string,
  name: string,
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

  if (!deployment.active) {
    throw new Error('Deployment is not active');
  }

  return deployment;
}
