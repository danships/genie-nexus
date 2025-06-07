import type { Collection, EntityDefinition } from 'supersave';
import type { ApiKey as ApiKeyType } from './types.js';

export const Provider: Collection = {
  name: 'provider',
  relations: [],
  template: {},
  filterSortFields: {
    name: 'string',
    tenantId: 'string',
    isDeleted: 'boolean',
    type: 'string',
  },
  hooks: [
    {
      // @ts-expect-error - Type mismatch in
      entityTransform: (_collection, _req, _res, entity) => {
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
    slug: 'string',
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
      entityTransform: (
        // @ts-expect-error - Type mismatch in entity transform function
        _collection,
        // @ts-expect-error - Type mismatch in entity transform function
        _req,
        // @ts-expect-error - Type mismatch in entity transform function
        _res,
        entity: ApiKeyType
      ): Omit<ApiKeyType, 'hash'> => {
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

export const Flow: Collection = {
  name: 'flow',
  relations: [],
  template: {},
  filterSortFields: {
    deploymentId: 'string',
    tenantId: 'string',
    isDeleted: 'boolean',
  },
};
