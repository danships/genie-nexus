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
    const metadata =
      meta[0] && typeof meta[0] === 'object' && meta[0] !== null
        ? { ...this.fixedMetadata, ...meta[0] }
        : this.fixedMetadata;
    this.logger.debug(message, metadata);
  }

  public info(message: string, ...meta: unknown[]) {
    const metadata =
      meta[0] && typeof meta[0] === 'object' && meta[0] !== null
        ? { ...this.fixedMetadata, ...meta[0] }
        : this.fixedMetadata;
    this.logger.info(message, metadata);
  }

  public error(message: string, ...meta: unknown[]) {
    const metadata =
      meta[0] && typeof meta[0] === 'object' && meta[0] !== null
        ? { ...this.fixedMetadata, ...meta[0] }
        : this.fixedMetadata;
    this.logger.error(message, metadata);
  }

  public warning(message: string, ...meta: unknown[]) {
    const metadata =
      meta[0] && typeof meta[0] === 'object' && meta[0] !== null
        ? { ...this.fixedMetadata, ...meta[0] }
        : this.fixedMetadata;
    this.logger.warn(message, metadata);
  }

  public setLogLevel(level: string): void {
    this.logger.level = level;
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
