import { createAdapter } from 'better-auth/adapters';
import type { Adapter, BetterAuthOptions } from 'better-auth';
import type { Repository, SuperSave } from 'supersave';
import { mapSchemaToEntity } from './map-schema-to-entity.js';

type SuperSaveAdapterConfig = {
  superSave: SuperSave;
  debugLogs?: boolean;
};

export const superSaveAdapter = (
  config: SuperSaveAdapterConfig,
): ((options: BetterAuthOptions) => Adapter) =>
  createAdapter({
    config: {
      adapterId: 'supersave-adapter', // A unique identifier for the adapter.
      adapterName: 'Supersave Adapter', // The name of the adapter.
      usePlural: false, // Whether the table names in the schema are plural.
      debugLogs: !!config.debugLogs,
      supportsJSON: true, // Whether the database supports JSON. (Default: false)
      supportsDates: false, // Whether the database supports dates. (Default: true)
      supportsBooleans: true, // Whether the database supports booleans. (Default: true)
      supportsNumericIds: false, // Whether the database supports auto-incrementing numeric IDs. (Default: true)
    },
    // @ts-expect-error
    adapter: async ({ debugLog, schema }) => {
      // const userRepository = await getAuthUserRepository();
      debugLog('Initializing adapter');
      debugLog('Schema', JSON.stringify(schema, null, 2));

      const repositories = new Map<string, Repository<unknown>>();
      const schemaSyncPromise = (async () => {
        for (const model of Object.values(schema)) {
          debugLog('Mapping schema to entity', model.modelName);
          repositories.set(
            model.modelName,
            await mapSchemaToEntity(config.superSave, model),
          );
        }
      })();

      return {
        // @ts-expect-error'
        create: async ({ model, data, select }) => {
          await schemaSyncPromise;
          debugLog('create', { model, data, select });
          console.log(model, data, select);
          return data;
        },
        // @ts-expect-error
        update: async ({ data, model, select }) => {
          await schemaSyncPromise;
          console.log(data, model, select);
          return data;
        },
        // @ts-expect-error
        updateMany: async ({ data, model, select }) => {
          await schemaSyncPromise;
          console.log(data, model, select);
          return data;
        },
        // @ts-expect-error
        delete: async ({ model, select }) => {
          await schemaSyncPromise;
          console.log(model, select);
        },
        // @ts-expect-error
        findOne: async ({ model, select }) => {
          await schemaSyncPromise;
          debugLog('findOne', { model, select });
          console.log('DDD', model, select);
          return null;
        },
        // @ts-expect-error
        findMany: async ({ model, select }) => {
          await schemaSyncPromise;
          console.log('CCC', model, select);
        },
        // @ts-expect-error
        count: async ({ model }) => {
          await schemaSyncPromise;
        },
      };
    },
  });
