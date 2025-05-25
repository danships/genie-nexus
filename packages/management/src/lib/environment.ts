import 'server-only';
import { str, cleanEnv, bool } from 'envalid';

export const environment = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  BETTER_AUTH_SECRET: str({ default: '' }),
  DB: str({ default: 'sqlite://db.sqlite' }),
  MULTI_TENANT: bool({
    default: false,
  }),
  AUTH_METHOD: str({
    choices: ['none', 'credentials'],
    default: 'credentials',
  }),
  LOG_LEVEL: str({
    choices: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'],
    default: 'INFO',
  }),
});
