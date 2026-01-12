import { TypeSymbols } from '@genie-nexus/container';
import type {
  LocalBaseEntity,
  StoredConfigurationRepository,
} from '@genie-nexus/database';
import type { Logger } from '@genie-nexus/logger';
import type { ConfigurationResponse } from '@genie-nexus/types';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';
import 'server-only';
import type { Repository } from 'supersave';
import { COLLECTION_MAP, normalizeCollectionName } from './collections/types';
import { getAppVersion } from './get-app-version';
import { DEFAULT_TENANT_ID } from './middleware/constants';
import { generateDefaultTenant } from './middleware/generate-default-tenant';

let serverLogger: Logger | null = null;

async function getServerLogger(): Promise<Logger> {
  if (!serverLogger) {
    serverLogger = (await getContainer()).resolve<Logger>(TypeSymbols.LOGGER);
  }
  return serverLogger;
}

function getTenantId(): string {
  return DEFAULT_TENANT_ID;
}

function getRepository<T extends LocalBaseEntity>(
  collection: string
): Promise<Repository<T>> {
  const normalizedName = normalizeCollectionName(collection);
  if (!normalizedName) {
    throw new Error(`Unknown collection: ${collection}`);
  }
  return getContainer().then((container) =>
    container.resolve<Repository<T>>(COLLECTION_MAP[normalizedName])
  );
}

export async function getResponseFromApi<T>(path: string): Promise<T> {
  if (path === '/configuration/server') {
    const { getServerConfiguration } = await import(
      '@genie-nexus/configuration'
    );
    const container = await getContainer();
    const storedConfigurationRepository =
      container.resolve<StoredConfigurationRepository>(
        TypeSymbols.STORED_CONFIGURATION_REPOSITORY
      );
    return (await getServerConfiguration(
      storedConfigurationRepository,
      getTenantId()
    )) as T;
  }
  throw new Error(`Unsupported API path: ${path}`);
}

type EntityWithTenant = LocalBaseEntity & { tenantId?: string };

export async function getEntity<T extends LocalBaseEntity>(
  collection: string,
  id: string
): Promise<T> {
  const repository = await getRepository<EntityWithTenant>(collection);
  const tenantId = getTenantId();

  const entity = await repository.getById(id);

  if (!entity) {
    (await getServerLogger()).error(`Entity not found: ${collection}/${id}`);
    throw new Error(`Entity not found: ${collection}/${id}`);
  }

  if (entity.tenantId !== tenantId) {
    (await getServerLogger()).error(
      `Entity not authorized: ${collection}/${id}`
    );
    throw new Error(`Not authorized to access entity: ${collection}/${id}`);
  }

  return entity as T;
}

export async function createEntity<T, R>(
  collection: string,
  data: T
): Promise<R> {
  const repository = await getRepository<EntityWithTenant>(collection);
  const tenantId = getTenantId();

  const entityToCreate = {
    ...(data as object),
    tenantId,
  } as EntityWithTenant;

  const created = await repository.create(entityToCreate);
  return created as R;
}

function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
}

export async function getEntityByQuery<T extends LocalBaseEntity>(
  collection: string,
  queryString: string
): Promise<T | null> {
  const repository = await getRepository<EntityWithTenant>(collection);
  const tenantId = getTenantId();

  const params = parseQueryString(queryString);
  let query = repository.createQuery().eq('tenantId', tenantId);

  for (const [key, value] of Object.entries(params)) {
    if (value === 'true') {
      query = query.eq(key, true);
    } else if (value === 'false') {
      query = query.eq(key, false);
    } else {
      query = query.eq(key, value);
    }
  }

  const entities = await repository.getByQuery(query);
  if (entities.length === 0) {
    return null;
  }
  return entities[0] as T;
}

export async function getEntities<T extends LocalBaseEntity>(
  collection: string,
  queryString: string
): Promise<T[]> {
  const repository = await getRepository<EntityWithTenant>(collection);
  const tenantId = getTenantId();

  const params = parseQueryString(queryString);
  let query = repository.createQuery().eq('tenantId', tenantId);

  for (const [key, value] of Object.entries(params)) {
    if (value === 'true') {
      query = query.eq(key, true);
    } else if (value === 'false') {
      query = query.eq(key, false);
    } else {
      query = query.eq(key, value);
    }
  }

  const entities = await repository.getByQuery(query);
  return entities as T[];
}

export async function getConfiguration(): Promise<
  ConfigurationResponse['data']
> {
  const tenant = generateDefaultTenant();
  const appInfo = await getAppVersion();

  return {
    tenant,
    defaultTenant: tenant.id === DEFAULT_TENANT_ID,
    authentication: environment.AUTH_METHOD,
    version: appInfo.version,
  };
}
