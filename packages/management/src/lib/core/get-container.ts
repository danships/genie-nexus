import { TypeSymbols, container } from '@genie-nexus/container';
import {
  type NextAuthUser,
  type StoredConfiguration,
  entities,
} from '@genie-nexus/database';
import { initialize as initializeDb } from '@genie-nexus/database';
import { LoggerImplementation } from '@genie-nexus/logger/winston';
import { InitializeStorage } from '@genie-nexus/storage';
import { environment } from '@lib/environment';

let initialized = false;
let initializing: Promise<typeof container> | null = null;

export async function getContainer(): Promise<typeof container> {
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
      } else if (
        environment.DB.startsWith('sqlite') &&
        environment.DB === 'sqlite://db.sqlite'
      ) {
        // The default db, we write that to a specific path. We cannot use DI yet to set up the storage path,
        // as that has not been initialized yet.
        const initializeStorage = new InitializeStorage();
        const storagePath = await initializeStorage.initialize(
          environment.GNXS_RUNTIME_ENVIRONMENT === 'docker'
        );
        dbConnectionString = `sqlite://${storagePath}/db.sqlite`;
      }

      const db = await initializeDb({
        connectionString: dbConnectionString,
        executeMigrations: false,
      });
      container.register(TypeSymbols.DB, {
        useValue: db,
      });
      container.register(TypeSymbols.STORED_CONFIGURATION_REPOSITORY, {
        useValue: db.getRepository<StoredConfiguration>(
          entities.StoredConfiguration.name
        ),
      });
      container.register(TypeSymbols.NEXT_AUTH_USER_REPOSITORY, {
        useValue: db.getRepository<NextAuthUser>(
          entities.NextAuthUser.name,
          entities.NextAuthUser.namespace
        ),
      });
    }
    initialized = true;
    return container;
  })();
  return await initializing;
}
