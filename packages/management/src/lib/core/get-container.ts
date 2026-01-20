import { TypeSymbols, container } from '@genie-nexus/container';
import {
  type ApiKey,
  type Deployment,
  type LlmFlow,
  type NextAuthUser,
  type Provider,
  type StoredConfiguration,
  type Tenant,
  type WeaveFlow,
  entities,
} from '@genie-nexus/database';
import { initialize as initializeDb } from '@genie-nexus/database';
import { LoggerImplementation } from '@genie-nexus/logger/winston';
import { InitializeStorage } from '@genie-nexus/storage';
import { environment } from '@lib/environment';
import { connection } from 'next/server';

let initialized = false;
let initializing: Promise<typeof container> | null = null;

export async function getContainer(): Promise<typeof container> {
  await connection();
  if (initialized) {
    return container;
  }
  if (initializing) {
    return initializing;
  }

  initializing = (async () => {
    if (!container.isRegistered(TypeSymbols.LOGGER)) {
      const logger = new LoggerImplementation({ app: 'gnxs-m' });
      logger.setLogLevel(environment.LOG_LEVEL ?? 'info');

      container.register(TypeSymbols.LOGGER, {
        useValue: logger,
      });

      let dbConnectionString = environment.DB;
      if (environment.isDevelopment && process.env['DB_DEV']) {
        // When developing, we want to point to the dev db at the router package
        dbConnectionString = process.env['DB_DEV'];
      } else if (environment.DB === 'sqlite://db.sqlite') {
        // The default db, we write that to a specific path. We cannot use DI yet to set up the storage path,
        // as that has not been initialized yet.
        try {
          const initializeStorage = new InitializeStorage();
          const storagePath = await initializeStorage.initialize(
            environment.GNXS_RUNTIME_ENVIRONMENT === 'docker'
          );
          dbConnectionString = `sqlite://${storagePath}/db.sqlite`;
        } catch (error) {
          logger.error('Failed to initialize storage path', { error });
          throw new Error('Storage initialization failed');
        }
      }

      const db = await initializeDb({
        connectionString: dbConnectionString,
        executeMigrations: false,
      });
      container.register(TypeSymbols.DB, {
        useValue: db,
      });

      container.register(TypeSymbols.PROVIDER_REPOSITORY, {
        useValue: db.getRepository<Provider>(entities.Provider.name),
      });
      container.register(TypeSymbols.DEPLOYMENT_REPOSITORY, {
        useValue: db.getRepository<Deployment>(entities.Deployment.name),
      });
      container.register(TypeSymbols.API_KEY_REPOSITORY, {
        useValue: db.getRepository<ApiKey>(entities.ApiKey.name),
      });
      container.register(TypeSymbols.TENANT_REPOSITORY, {
        useValue: db.getRepository<Tenant>(entities.Tenant.name),
      });
      container.register(TypeSymbols.NEXT_AUTH_USER_REPOSITORY, {
        useValue: db.getRepository<NextAuthUser>(
          entities.NextAuthUser.name,
          entities.NextAuthUser.namespace
        ),
      });
      container.register(TypeSymbols.WEAVE_FLOW_REPOSITORY, {
        useValue: db.getRepository<WeaveFlow>(entities.WeaveFlow.name),
      });
      container.register(TypeSymbols.LLM_FLOW_REPOSITORY, {
        useValue: db.getRepository<LlmFlow>(entities.LlmFlow.name),
      });
      container.register(TypeSymbols.STORED_CONFIGURATION_REPOSITORY, {
        useValue: db.getRepository<StoredConfiguration>(
          entities.StoredConfiguration.name
        ),
      });
    }
    initialized = true;
    return container;
  })();
  return await initializing;
}
