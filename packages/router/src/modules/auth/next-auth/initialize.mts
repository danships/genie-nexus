import { getNextAuthUserRepository } from '@genie-nexus/database';
import { getConfiguration } from '../../configuration/get-configuration.js';
import { logger } from '../../../core/logger.js';
import { saltAndHashPassword } from '@genie-nexus/auth';
import { generatePassword } from './generate-password.js';
import { DEFAULT_USER_EMAIL, DEFAULT_USER_ID } from '../constants.js';
import { DEFAULT_TENANT_ID } from '../../tenants/constants.js';

const DEV_PASSWORD = 'Tester01';

export async function initialize() {
  const userRepository = await getNextAuthUserRepository();
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

  if (users.length === 0 && !getConfiguration().multiTenant) {
    logger.info('No users found, creating default user');
    const password = getConfiguration().devMode
      ? DEV_PASSWORD
      : generatePassword();
    await userRepository.create({
      email: DEFAULT_USER_EMAIL,
      password: await saltAndHashPassword(password),
      created: new Date().toISOString(),
      lastLogin: null,
      tenantId: DEFAULT_TENANT_ID,
    });
    logger.info('Default user created', {
      email: DEFAULT_USER_EMAIL,
      password,
    });
  }
}
