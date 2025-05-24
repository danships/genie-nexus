import type { Collection, EntityDefinition } from 'supersave';
import type { ApiKey as ApiKeyType } from './types';

export const Provider: Collection = {
  name: 'provider',
  relations: [],
  template: {},
  filterSortFields: {
    name: 'string',
    tenantId: 'string',
    isDeleted: 'boolean',
  },
  hooks: [
    {
      // @ts-expect-error - Type mismatch in entity transform function
      entityTransform: (_collection, _req, _res, entity) => {
        // @ts-expect-error - Type mismatch in entity transform function
        if ('apiKey' in entity) {
          entity.apiKey = '';
        }
        return entity;
      },
    },
  ],
};

export const Deployment: Collection = {
  name: 'deployment',
  relations: [],
  template: {},
  filterSortFields: {
    name: 'string',
    tenantId: 'string',
    isDeleted: 'boolean',
    type: 'string',
  },
};

export const ApiKey: Collection = {
  name: 'apiKey',
  relations: [],
  template: {},
  filterSortFields: {
    label: 'string',
    key: 'string',
    tenantId: 'string',
  },
  hooks: [
    {
      // @ts-expect-error - Type mismatch in entity transform function
      entityTransform: (
        _collection,
        _req,
        _res,
        entity: ApiKeyType,
      ): Omit<ApiKeyType, 'hash'> => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hash, ...rest } = entity;
        return rest;
      },
    },
  ],
};

export const Tenant: EntityDefinition = {
  name: 'tenant',
  relations: [],
  template: {},
  filterSortFields: {
    name: 'string',
  },
};

export const Migration: EntityDefinition = {
  name: 'migration',
  namespace: 'internal',
  relations: [],
  template: {},
  filterSortFields: {
    version: 'string',
  },
};

export const NextAuthUser: EntityDefinition = {
  name: 'user',
  namespace: 'nextauth',
  relations: [],
  template: {},
  filterSortFields: {
    email: 'string',
  },
};
