import { isProduction } from './core/utils/is-production.js';
import {
  generateManagementApiKey as generateManagementApiKeyFunction,
  generateLlmApiKey as generatePublicApiKeyFunction,
} from './modules/api-key/generate-api-key.js';
import { GenieNexusServer as GenieNexusServerClass } from './server.js';

export type { StartServerOptions } from './server.js';
export * from '@genie-nexus/database';
export { DEFAULT_TENANT_ID } from './modules/tenants/constants.js';

export const GenieNexusServer = isProduction() ? null : GenieNexusServerClass;

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
