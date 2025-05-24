import { getConfiguration } from '../configuration/get-configuration';
import { URL_PARAM_TENANT_ID } from './constants';

export function getTenantPath() {
  return getConfiguration().multiTenant ? `:${URL_PARAM_TENANT_ID}/` : '';
}
