import type { Repository } from 'supersave';
import { SuperSave } from 'supersave';
import { ApiKey, Deployment, Migration, Provider, Tenant } from './entities';
import type {
  ApiKey as ApiKeyType,
  Deployment as DeploymentType,
  Provider as ProviderType,
  Tenant as TenantType,
} from './types';
import type { Application } from 'express';
import express from 'express';
import { migrate } from './migrate';
import { checkApiKeyOrUser } from '../../modules/api-key/middleware/check-api-key-or-user';
import { getTenant } from '../../modules/tenants/middleware/get-tenant';
import { getConfiguration } from '../configuration/get';

let superSavePromise: Promise<SuperSave> | undefined;
let superSave!: SuperSave;

export async function initialize(connectionString: string, app: Application) {
  superSavePromise = SuperSave.create(connectionString);
  const db = await superSavePromise;

  await db.addCollection(Provider);
  await db.addCollection(Deployment);
  await db.addCollection(ApiKey);
  await db.addCollection(Tenant);
  await db.addCollection(Migration);

  await migrate(db);

  // TODO validate the tenant for requests, does the api key tenant match the request tenant?
  // TODO for management api keys, we should check the scopes
  const collectionRouter = await db.getRouter();

  if (getConfiguration().devMode) {
    const { default: cors } = await import('cors');
    app.use('/api/v1/collections', cors());
  }

  app.use(
    '/api/v1/collections',
    express.json(),
    checkApiKeyOrUser('management-key'),
    getTenant,
    collectionRouter,
  );

  superSave = db;
  return db;
}

export async function getDB() {
  await superSavePromise;
  return superSave;
}

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
