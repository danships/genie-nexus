import { bool, cleanEnv, num, str } from 'envalid';

export const environment = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  LOG_LEVEL: str({
    default: 'info',
    choices: ['info', 'debug', 'warning', 'error'],
    devDefault: 'debug',
  }),
  DB: str({
    default: 'sqlite://db.sqlite',
  }),
  MULTI_TENANT: bool({
    default: false,
  }),
  INTEGRATE_WEB: bool({
    default: true,
    devDefault: false,
  }),
  AUTH_METHOD: str({
    choices: ['none', 'credentials'],
    default: 'credentials',
  }),
});
