import { createLogger, format, transports } from 'winston';

export type Logger = typeof logger;

export { configureLogger } from './configure.js';

export const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()],
});
