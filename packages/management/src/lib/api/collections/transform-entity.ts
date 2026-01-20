import type { LocalBaseEntity } from '@genie-nexus/database';
import type { CollectionName } from './types';

type EntityWithTenant = LocalBaseEntity & { tenantId?: string };

export function transformEntity<T extends EntityWithTenant>(
  collectionName: CollectionName,
  entity: T
): Omit<T, 'tenantId'> {
  const { tenantId, ...rest } = entity; // eslint-disable-line @typescript-eslint/no-unused-vars
  const result = rest as Record<string, unknown>;

  if (collectionName === 'apiKey' && 'hash' in result) {
    delete result['hash'];
  }

  if (collectionName === 'provider' && 'apiKey' in result) {
    result['apiKey'] = '';
  }

  return result as Omit<T, 'tenantId'>;
}

export function transformEntities<T extends EntityWithTenant>(
  collectionName: CollectionName,
  entities: T[]
): Omit<T, 'tenantId'>[] {
  return entities.map((entity) => transformEntity(collectionName, entity));
}
