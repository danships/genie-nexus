import { getAuthUserRepository } from '@genie-nexus/database';
import { getConfiguration } from '../../configuration/get-configuration.js';
import { logger } from '../../../core/logger.js';
import { DEFAULT_USER_EMAIL, DEFAULT_USER_ID } from '../constants.js';
import { DEFAULT_TENANT_ID } from '../../tenants/constants.js';
import { getAuth } from '@genie-nexus/auth';

export async function initialize() {
  const userRepository = await getAuthUserRepository();
  const users = await userRepository.getByQuery(
    userRepository.createQuery().limit(1),
  );

  if (getConfiguration().authentication.type === 'none') {
    logger.info('Authentication is disabled');
    if (users.length === 0) {
      await userRepository.create({
        // @ts-expect-error superSave support providing an ID, but the typings don't expose it.
        id: DEFAULT_USER_ID,
        email: DEFAULT_USER_EMAIL,
        password: '', // Nobody needs to sign in with this user
        created: new Date().toISOString(),
        lastLogin: null,
      });
    }
    return;
  }

  logger.info('Initializing auth');
  getAuth({
    connectionString: getConfiguration().dbConnectionString,
    authenticationMethod: 'credentials',
    defaultTenantId: DEFAULT_TENANT_ID,
    debug: getConfiguration().devMode,
  });
}
