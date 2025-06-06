import type {
  CollectionEntityWithTenantId,
  LocalBaseEntity,
} from '@genie-nexus/database';
import type { Request, Response } from 'express';
import type { Collection } from 'supersave';

export default function (
  collection: Collection,
  _req: Request,
  _res: Response,
  entity: CollectionEntityWithTenantId
): CollectionEntityWithTenantId {
  // @ts-expect-error tenantId is required according to the type, but we are removing it anyway.
  delete entity.tenantId;

  // Also clear any related collections
  if (collection.relations.length > 0) {
    for (const relation of collection.relations) {
      if (relation.multiple && Array.isArray(entity[relation.field])) {
        entity[relation.field] = entity[relation.field].map(
          (relationEntity: LocalBaseEntity) => {
            delete relationEntity['tenantId'];
            return relationEntity;
          }
        );
      } else if (
        !relation.multiple &&
        typeof entity[relation.field] === 'object' &&
        entity[relation.field] !== null
      ) {
        delete entity[relation.field].tenantId;
      }
    }
  }
  return entity;
}
