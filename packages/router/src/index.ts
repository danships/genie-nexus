import { isProduction } from './core/utils/is-production.js';
import {
  generateLlmApiKey as generatePublicApiKeyFunction,
  generateManagementApiKey as generateManagementApiKeyFunction,
} from './modules/api-key/generate-api-key.js';
import { startServer as startServerFunction } from './server.js';

export type { StartServerOptions } from './server.js';
export * from '@genie-nexus/database';
export { DEFAULT_TENANT_ID } from './modules/tenants/constants.js';

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
