import { TypeSymbols } from '@genie-nexus/container';
import type { DeploymentRepository } from '@genie-nexus/database';
import type { DeploymentWeaveApi } from '@genie-nexus/types';
import { getContainer } from '@lib/core/get-container';

export async function getWeaveDeploymentBySlug(
  tenantId: string,
  slug: string
): Promise<(DeploymentWeaveApi & { tenantId: string }) | null> {
  const container = await getContainer();
  const deploymentRepository = container.resolve<DeploymentRepository>(
    TypeSymbols.DEPLOYMENT_REPOSITORY
  );

  const deployment = await deploymentRepository.getOneByQuery(
    deploymentRepository
      .createQuery()
      .eq('tenantId', tenantId)
      .eq('slug', slug)
      .eq('type', 'weave')
      .eq('isDeleted', false)
  );

  if (!deployment || deployment.type !== 'weave') {
    return null;
  }

  return deployment as DeploymentWeaveApi & { tenantId: string };
}
