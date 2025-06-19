import { LoggerImplementation } from '@genie-nexus/logger/winston';
import { container, TypeSymbols } from '@genie-nexus/container';

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
