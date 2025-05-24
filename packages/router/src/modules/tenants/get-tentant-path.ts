import { getConfiguration } from '../configuration/get-configuration.js';
import { URL_PARAM_TENANT_ID } from './constants.js';

export function getTenantPath() {
  return getConfiguration().multiTenant ? `:${URL_PARAM_TENANT_ID}/` : '';
}
