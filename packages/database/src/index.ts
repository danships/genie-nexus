import type { Repository } from 'supersave';
import type {
  Provider as ProviderType,
  ApiKey as ApiKeyType,
  Tenant as TenantType,
  Deployment as DeploymentType,
  AuthUser as AuthUserType,
} from './types.js';
import { Provider, ApiKey, Tenant, Deployment, AuthUser } from './entities.js';
import { getDB } from './initialize.js';

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

export async function getAuthUserRepository(): Promise<
  Repository<AuthUserType>
> {
  const db = await getDB();
  return db.getRepository<AuthUserType>(AuthUser.name, AuthUser.namespace);
}
