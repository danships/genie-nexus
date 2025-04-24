import { isProduction } from './core/utils/is-production';
import {
  generatePublicApiKey as generatePublicApiKeyFunction,
  generateManagementApiKey as generateManagementApiKeyFunction,
} from './modules/api-key/generate-api-key';
import { startServer as startServerFunction } from './server';

export type { StartServerOptions } from './server';
export * from './core/db/types';
export { DEFAULT_TENANT_ID } from './modules/tenants/constants';

export const startServer = isProduction()
  ? () => {
      throw new Error('StartServer is not exposed.');
    }
  : startServerFunction;

export const generatePublicApiKey = isProduction()
  ? () => {
      throw new Error('generatePublicApiKey is not exposed.');
    }
  : generatePublicApiKeyFunction;

export const generateManagementApiKey = isProduction()
  ? () => {
      throw new Error('generateManagementApiKey is not exposed.');
    }
  : generateManagementApiKeyFunction;
