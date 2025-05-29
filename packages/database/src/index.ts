import type { Repository } from 'supersave';
import {
  ApiKey,
  Deployment,
  Flow,
  NextAuthUser,
  Provider,
  Tenant,
} from './entities.js';
import { getDB } from './initialize.js';
import type {
  ApiKey as ApiKeyType,
  Deployment as DeploymentType,
  Flow as FlowType,
  NextAuthUser as NextAuthUserType,
  Provider as ProviderType,
  Tenant as TenantType,
} from './types.js';

export * from './initialize.js';
export * from './types.js';

export async function getProviderRepository(): Promise<
  Repository<ProviderType>
> {
  const db = await getDB();
  return db.getRepository<ProviderType>(Provider.name);
}

export async function getDeploymentRepository(): Promise<
  Repository<DeploymentType>
> {
  const db = await getDB();
  return db.getRepository<DeploymentType>(Deployment.name);
}

export async function getApiKeyRepository(): Promise<Repository<ApiKeyType>> {
  const db = await getDB();
  return db.getRepository<ApiKeyType>(ApiKey.name);
}

export async function getTenantRepository(): Promise<Repository<TenantType>> {
  const db = await getDB();
  return db.getRepository<TenantType>(Tenant.name);
}

export async function getNextAuthUserRepository(): Promise<
  Repository<NextAuthUserType>
> {
  const db = await getDB();
  return db.getRepository<NextAuthUserType>(
    NextAuthUser.name,
    NextAuthUser.namespace
  );
}

export async function getFlowRepository() {
  const db = await getDB();
  return db.getRepository<FlowType>(Flow.name);
}
