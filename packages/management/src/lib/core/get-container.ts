import { TypeSymbols, container } from '@genie-nexus/container';
import { LoggerImplementation } from '@genie-nexus/logger/winston';

export function getContainer() {
  if (!container.isRegistered(TypeSymbols.LOGGER)) {
    const logger = new LoggerImplementation({ app: 'gnxs-m' });
    logger.setLogLevel(process.env['LOG_LEVEL'] ?? 'info');

    container.register(TypeSymbols.LOGGER, {
      useValue: logger,
    });
  }
  return container;
}
