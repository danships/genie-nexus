import type { Repository } from 'supersave';
import {
  ApiKey,
  Deployment,
  NextAuthUser,
  Provider,
  Tenant,
  WeaveFlow,
} from './entities.js';
import { getDB } from './initialize.js';
import type {
  ApiKey as ApiKeyType,
  Deployment as DeploymentType,
  WeaveFlow as FlowType,
  NextAuthUser as NextAuthUserType,
  Provider as ProviderType,
  Tenant as TenantType,
} from './types.js';

export * from './initialize.js';
export * from './types.js';

export type ProviderRepository = Repository<ProviderType>;
export async function getProviderRepository(): Promise<
  Repository<ProviderType>
> {
  const db = await getDB();
  return db.getRepository<ProviderType>(Provider.name);
}

export type DeploymentRepository = Repository<DeploymentType>;
export async function getDeploymentRepository(): Promise<
  Repository<DeploymentType>
> {
  const db = await getDB();
  return db.getRepository<DeploymentType>(Deployment.name);
}

export type ApiKeyRepository = Repository<ApiKeyType>;
export async function getApiKeyRepository(): Promise<Repository<ApiKeyType>> {
  const db = await getDB();
  return db.getRepository<ApiKeyType>(ApiKey.name);
}

export type TenantRepository = Repository<TenantType>;
export async function getTenantRepository(): Promise<Repository<TenantType>> {
  const db = await getDB();
  return db.getRepository<TenantType>(Tenant.name);
}

export type NextAuthUserRepository = Repository<NextAuthUserType>;
export async function getNextAuthUserRepository(): Promise<
  Repository<NextAuthUserType>
> {
  const db = await getDB();
  return db.getRepository<NextAuthUserType>(
    NextAuthUser.name,
    NextAuthUser.namespace
  );
}

export type WeaveFlowRepository = Repository<FlowType>;
export async function getWeaveFlowRepository() {
  const db = await getDB();
  return db.getRepository<FlowType>(WeaveFlow.name);
}
