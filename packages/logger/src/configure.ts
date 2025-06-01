import { logger } from './index.js';

export function configureLogger(logLevel: string) {
  logger.level = logLevel;

  return logger;
}
