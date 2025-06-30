import { TypeSymbols, container } from '@genie-nexus/container';
import { getStoredConfigurationRepository } from '@genie-nexus/database';
import { initialize as initializeDb } from '@genie-nexus/database';
import { LoggerImplementation } from '@genie-nexus/logger/winston';
import { environment } from '@lib/environment';

export async function getContainer() {
  if (!container.isRegistered(TypeSymbols.LOGGER)) {
    const logger = new LoggerImplementation({ app: 'gnxs-m' });
    logger.setLogLevel(process.env['LOG_LEVEL'] ?? 'info');

    container.register(TypeSymbols.LOGGER, {
      useValue: logger,
    });

    const db = await initializeDb({
      connectionString: environment.DB,
      executeMigrations: false,
    });
    container.register(TypeSymbols.DB, {
      useValue: db,
    });
    container.register(TypeSymbols.STORED_CONFIGURATION_REPOSITORY, {
      useValue: await getStoredConfigurationRepository(),
    });
  }
  return container;
}
