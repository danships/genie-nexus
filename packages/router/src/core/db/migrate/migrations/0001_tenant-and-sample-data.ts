import type { SuperSave } from 'supersave';
import type { MigrationDefinition } from '../types';
import type {
  Tenant as TenantType,
  Provider as ProviderType,
  Deployment as DeploymentType,
} from '../../types';
import { Provider, Tenant, Deployment } from '../../entities';
import { DEFAULT_TENANT_ID } from '../../../..';

export const tenantAndSampleData: MigrationDefinition = {
  migrate: async function migration0001(superSave: SuperSave) {
    const tenantRepository = superSave.getRepository<TenantType>(Tenant.name);

    await tenantRepository.create({
      id: DEFAULT_TENANT_ID,
      name: 'Default Tenant',
    });

    const providerRepository = superSave.getRepository<ProviderType>(
      Provider.name,
    );
    const createdProvider = await providerRepository.create({
      name: 'Static Echo Provider',
      tenantId: DEFAULT_TENANT_ID,
      type: 'static',
    });

    const deploymentRepository = superSave.getRepository<DeploymentType>(
      Deployment.name,
    );
    await deploymentRepository.create({
      name: 'static-echo',
      tenantId: DEFAULT_TENANT_ID,
      active: true,
      defaultProviderId: createdProvider.id,
      model: 'static',
    });
  },
};
