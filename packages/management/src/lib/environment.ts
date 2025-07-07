import 'server-only';
import { bool, cleanEnv, str } from 'envalid';

export const environment = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  DB: str({ default: 'sqlite://db.sqlite' }),
  MULTI_TENANT: bool({
    default: false,
  }),
  AUTH_METHOD: str({
    choices: ['none', 'credentials'],
    default: 'credentials',
  }),
  GNXS_RUNTIME_ENVIRONMENT: str({
    default: 'cli',
    choices: ['cli', 'docker'],
  }),
  LOG_LEVEL: str({
    choices: ['debug', 'info', 'warn', 'error', 'fatal'],
    default: 'info',
  }),
  HOST_PREFIX: str({ default: 'http://localhost:3000' }),
});
