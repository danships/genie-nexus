import type { Repository } from 'supersave';
import type {
  Provider as ProviderType,
  ApiKey as ApiKeyType,
  Tenant as TenantType,
  Deployment as DeploymentType,
  NextAuthUser as NextAuthUserType,
} from './types';
import { Provider, ApiKey, Tenant, Deployment, NextAuthUser } from './entities';
import { getDB } from './initialize';

export * from './initialize';
export * from './types';

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
    NextAuthUser.namespace,
  );
}
