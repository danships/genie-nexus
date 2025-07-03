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
  DEBUG: bool({
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
  TELEMETRY_SITE_ID: str({
    default: '09eab260-0866-4cbc-b2d7-5914d7136066',
  }),
  TELEMETRY_HOST_URL: str({
    default: 'https://a.debuggingdan.com',
  }),
  RUNTIME_ENVIRONMENT: str({
    default: 'cli',
    choices: ['cli', 'docker'],
  }),
});
