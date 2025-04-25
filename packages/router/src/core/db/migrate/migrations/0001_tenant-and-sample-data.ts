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
    } satisfies Omit<TenantType, 'id'>);

    const providerRepository = superSave.getRepository<ProviderType>(
      Provider.name,
    );
    const createdLlmProvider = await providerRepository.create({
      name: 'Static Echo Provider',
      tenantId: DEFAULT_TENANT_ID,
      type: 'static',
    } satisfies Omit<ProviderType, 'id'>);

    const deploymentRepository = superSave.getRepository<DeploymentType>(
      Deployment.name,
    );
    await deploymentRepository.create({
      name: 'static-echo',
      tenantId: DEFAULT_TENANT_ID,
      active: true,
      defaultProviderId: createdLlmProvider.id,
      model: 'static',
      type: 'llm',
    } satisfies Omit<DeploymentType, 'id'>);

    const staticHttpProvider = await providerRepository.create({
      name: 'Static HTTP Provider',
      tenantId: DEFAULT_TENANT_ID,
      type: 'http-static',
      statusCode: 200,
      body: 'Hello World',
      responseHeaders: [
        {
          key: 'Content-Type',
          operation: 'set',
          value: 'text/plain',
        },
        {
          key: 'x-nexus-response',
          operation: 'set',
          value: 'it is done.',
        },
      ],
    } satisfies Omit<ProviderType, 'id'>);

    await deploymentRepository.create({
      name: `static-http`,
      tenantId: DEFAULT_TENANT_ID,
      active: true,
      defaultProviderId: staticHttpProvider.id,
      type: 'weave',
      requiresApiKey: false,
      supportedMethods: ['get'],
    } satisfies Omit<DeploymentType, 'id'>);

    const proxyHttpProvider = await providerRepository.create({
      name: 'Proxy HTTP Provider',
      tenantId: DEFAULT_TENANT_ID,
      type: 'http-proxy',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      responseHeaders: [
        {
          key: 'Content-Type',
          operation: 'set',
          value: 'application/json',
        },
      ],
    } satisfies Omit<ProviderType, 'id'>);

    await deploymentRepository.create({
      name: `proxy-http`,
      tenantId: DEFAULT_TENANT_ID,
      active: true,
      defaultProviderId: proxyHttpProvider.id,
      type: 'weave',
      requiresApiKey: false,
      supportedMethods: ['get'],
    } satisfies Omit<DeploymentType, 'id'>);
  },
};
