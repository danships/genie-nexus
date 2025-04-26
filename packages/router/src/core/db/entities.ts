import type { Collection, EntityDefinition } from 'supersave';
import { getHooksForCollection } from './hooks/get-hooks-for-collection';

export const Provider: Collection = {
  name: 'provider',
  relations: [],
  template: {},
  filterSortFields: {
    name: 'string',
    tenantId: 'string',
  },
  hooks: getHooksForCollection(),
};

export const Deployment: Collection = {
  name: 'deployment',
  relations: [],
  template: {},
  filterSortFields: {
    name: 'string',
    tenantId: 'string',
  },
  hooks: getHooksForCollection(),
};

export const ApiKey: Collection = {
  name: 'apiKey',
  relations: [],
  template: {},
  filterSortFields: {
    key: 'string',
    tenantId: 'string',
  },
  hooks: getHooksForCollection(),
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
