import { environment } from '@lib/environment';

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

const LOG_LEVEL_PRIORITY = {
  [LogLevel.DEBUG]: 10,
  [LogLevel.INFO]: 20,
  [LogLevel.WARN]: 30,
  [LogLevel.ERROR]: 40,
  [LogLevel.FATAL]: 50,
} as const;

const getMinLogLevel = () => {
  const envLevel = environment.LOG_LEVEL.toUpperCase();
  if (envLevel && Object.values(LogLevel).includes(envLevel as LogLevel)) {
    return envLevel as LogLevel;
  }
  return LogLevel.INFO; // This should never be reached.
};

const shouldLog = (level: LogLevel) => {
  const minLevel = getMinLogLevel();
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[minLevel];
};

const createLogMessage =
  (level: LogLevel) =>
  (message: string, attrs: Record<string, unknown> = {}) => {
    if (!shouldLog(level)) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(level, message, attrs);
  };

export const serverLogger = {
  debug: createLogMessage(LogLevel.DEBUG),
  info: createLogMessage(LogLevel.INFO),
  warn: createLogMessage(LogLevel.WARN),
  error: createLogMessage(LogLevel.ERROR),
};
