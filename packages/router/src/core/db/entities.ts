import type { EntityDefinition } from 'supersave';

export const Provider: EntityDefinition = {
  name: 'provider',
  relations: [],
  template: {},
  filterSortFields: {
    name: 'string',
    tenantId: 'string',
  },
};

export const Deployment: EntityDefinition = {
  name: 'deployment',
  relations: [],
  template: {},
  filterSortFields: {
    name: 'string',
    tenantId: 'string',
  },
};

export const ApiKey: EntityDefinition = {
  name: 'apiKey',
  relations: [],
  template: {},
  filterSortFields: {
    key: 'string',
    tenantId: 'string',
  },
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
