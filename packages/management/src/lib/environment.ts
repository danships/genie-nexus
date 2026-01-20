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
  NEWSLETTER_HOST: str({ default: 'https://www.gnxs.io' }),
  GITHUB_RELEASES_URL: str({
    default: 'https://api.github.com/repos/danships/genie-nexus/releases',
  }),
  TELEMETRY_SITE_ID: str({
    default: '09eab260-0866-4cbc-b2d7-5914d7136066',
  }),
  TELEMETRY_HOST_URL: str({
    default: 'https://a.debuggingdan.com',
  }),
  BETTER_AUTH_SECRET: str(),
  BETTER_AUTH_URL: str({
    default: 'http://localhost:3000',
  }),
  NEXT_PUBLIC_BETTER_AUTH_URL: str({
    default: 'http://localhost:3000',
  }),
});
