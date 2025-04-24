import { str, cleanEnv, num } from 'envalid';

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
});
