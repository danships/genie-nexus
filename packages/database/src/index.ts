import type { Repository } from 'supersave';
import {
  ApiKey,
  Deployment,
  LlmFlow,
  NextAuthUser,
  Provider,
  Tenant,
  WeaveFlow,
} from './entities.js';
import { getDB } from './initialize.js';
import type {
  ApiKey as ApiKeyType,
  Deployment as DeploymentType,
  LlmFlow as LlmFlowType,
  NextAuthUser as NextAuthUserType,
  Provider as ProviderType,
  Tenant as TenantType,
  WeaveFlow as WeaveFlowType,
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

export type WeaveFlowRepository = Repository<WeaveFlowType>;
export async function getWeaveFlowRepository(): Promise<WeaveFlowRepository> {
  const db = await getDB();
  return db.getRepository<WeaveFlowType>(WeaveFlow.name);
}

export type LlmFlowRepository = Repository<LlmFlowType>;
export async function getLlmFlowRepository(): Promise<LlmFlowRepository> {
  const db = await getDB();
  return db.getRepository<LlmFlowType>(LlmFlow.name);
}
