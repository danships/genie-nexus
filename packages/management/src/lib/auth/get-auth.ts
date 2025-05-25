import { getAuth as getGenieNexusAuth, isInitialized } from '@genie-nexus/auth';
import { environment } from '@lib/environment';
import { DEFAULT_TENANT_ID } from './constants';
import 'server-only';

export async function getAuth() {
  if (environment.AUTH_METHOD === 'none') {
    throw new Error('Authentication is disabled');
  }

  if (isInitialized()) {
    return getGenieNexusAuth();
  }

  return getGenieNexusAuth({
    connectionString: environment.DB,
    authenticationMethod: environment.AUTH_METHOD,
    defaultTenantId: DEFAULT_TENANT_ID,
    debug: environment.isDevelopment,
  });
}
