import 'server-only';
import { bool, cleanEnv, str } from 'envalid';

export const environment = cleanEnv(
  process.env,
  {
    NODE_ENV: str({
      choices: ['development', 'production', 'test'],
      default: 'development',
    }),
    AUTH_SECRET: str(),
    DB: str({ default: 'sqlite://db.sqlite' }),
    MULTI_TENANT: bool({
      default: false,
    }),
    AUTH_METHOD: str({
      choices: ['none', 'next-auth'],
      default: 'next-auth',
    }),
    LOG_LEVEL: str({
      choices: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'],
      default: 'INFO',
    }),
  },
  {
    reporter: ({ errors }) => {
      if (process.env['NEXT_BUILD']) {
        return;
      }
      throw new Error(`Environment variables are not set: ${errors}.`);
    },
  }
);
