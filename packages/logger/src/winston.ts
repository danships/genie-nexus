import {
  type Logger as WinstonLogger,
  createLogger,
  format,
  transports,
} from 'winston';
import type { Logger } from './index.js';

export const internalLogger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()],
});

export class LoggerImplementation implements Logger {
  private logger: WinstonLogger;

  constructor(
    private fixedMetadata: Record<string, unknown> = {},
    logger?: WinstonLogger
  ) {
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = internalLogger;
    }
  }

  public debug(message: string, ...meta: unknown[]) {
    internalLogger.debug(message, { ...this.fixedMetadata, ...meta });
  }

  public info(message: string, ...meta: unknown[]) {
    internalLogger.info(message, { ...this.fixedMetadata, ...meta });
  }

  public error(message: string, ...meta: unknown[]) {
    internalLogger.error(message, { ...this.fixedMetadata, ...meta });
  }

  public warning(message: string, ...meta: unknown[]) {
    internalLogger.warn(message, { ...this.fixedMetadata, ...meta });
  }

  public setLogLevel(level: string): void {
    internalLogger.level = level;
  }

  public setFixedMetadata(metadata: Record<string, unknown>): void {
    this.fixedMetadata = metadata;
  }

  public child(metadata?: Record<string, unknown>): Logger {
    return new LoggerImplementation(
      {
        ...this.fixedMetadata,
        ...metadata,
      },
      this.logger.child({})
    );
  }

  public appendFixedMetadata(metadata: Record<string, unknown>): void {
    this.fixedMetadata = { ...this.fixedMetadata, ...metadata };
  }
}
