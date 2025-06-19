export interface Logger {
  debug(message: string, ...meta: unknown[]): void;
  info(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
  warning(message: string, ...meta: unknown[]): void;
  setLogLevel(level: string): void;
  setFixedMetadata(metadata: Record<string, unknown>): void;
  child(metadata?: Record<string, unknown>): Logger;
  appendFixedMetadata(metadata: Record<string, unknown>): void;
}
