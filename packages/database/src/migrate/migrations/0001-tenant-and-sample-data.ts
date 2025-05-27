import type {
  DeploymentLLM,
  DeploymentWeave,
  WeaveHttpProxyProvider,
  WeaveHttpStaticProvider,
} from '@genie-nexus/types';
import type { SuperSave } from 'supersave';
import { Deployment, Provider, Tenant } from '../../entities.js';
import type {
  Deployment as DeploymentType,
  Provider as ProviderType,
  Tenant as TenantType,
} from '../../types.js';
import type { MigrationDefinition } from '../types.js';

// TODO duplicate from the constant in the router package
const DEFAULT_TENANT_ID = 'default';

export const tenantAndSampleData: MigrationDefinition = {
  migrate: async function migration0001(superSave: SuperSave) {
    const tenantRepository = superSave.getRepository<TenantType>(Tenant.name);

    await tenantRepository.create({
      // @ts-expect-error - Supersave allows specifying the id, but does not reflect that in the typings.
      id: DEFAULT_TENANT_ID,
      name: 'Default Tenant',
    } satisfies Omit<TenantType, 'id'>);

    const providerRepository = superSave.getRepository<ProviderType>(
      Provider.name
    );
    const createdLlmProvider = await providerRepository.create({
      name: 'Static Echo Provider',
      tenantId: DEFAULT_TENANT_ID,
      type: 'static',
    } satisfies Omit<ProviderType, 'id'>);

    const deploymentRepository = superSave.getRepository<DeploymentType>(
      Deployment.name
    );
    const staticEchoDeployment: Omit<DeploymentLLM, 'id'> = {
      name: 'static-echo',
      tenantId: DEFAULT_TENANT_ID,
      active: true,
      defaultProviderId: createdLlmProvider.id,
      model: 'static',
      type: 'llm',
    };
    await deploymentRepository.create(staticEchoDeployment);

    const staticHttpProviderToCreate: Omit<WeaveHttpStaticProvider, 'id'> = {
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
    };
    const staticHttpProvider = await providerRepository.create(
      staticHttpProviderToCreate
    );

    await deploymentRepository.create({
      name: `static-http`,
      tenantId: DEFAULT_TENANT_ID,
      active: true,
      defaultProviderId: staticHttpProvider.id,
      type: 'weave',
      // @ts-expect-error TODO the discriminated union does not work with the zod schemas
      requiresApiKey: false,
      supportedMethods: ['get'],
    } satisfies Omit<DeploymentWeave, 'id'>);

    const proxyHttpProviderToCreate: Omit<WeaveHttpProxyProvider, 'id'> = {
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
    };
    const proxyHttpProvider = await providerRepository.create(
      proxyHttpProviderToCreate
    );

    const deploymentToCreate: Omit<DeploymentWeave, 'id'> = {
      name: `proxy-http`,
      tenantId: DEFAULT_TENANT_ID,
      active: true,
      defaultProviderId: proxyHttpProvider.id,
      type: 'weave',
      requiresApiKey: false,
      supportedMethods: ['get'],
    };
    await deploymentRepository.create(deploymentToCreate);
  },
};
