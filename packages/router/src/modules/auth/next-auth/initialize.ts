import { getNextAuthUserRepository } from '@genie-nexus/database';
import { getLogger } from '../../../core/get-logger.js';
import { getConfiguration } from '../../configuration/get-configuration.js';
import { DEFAULT_USER_EMAIL, DEFAULT_USER_ID } from '../constants.js';

export async function initialize() {
  const userRepository = await getNextAuthUserRepository();
  const users = await userRepository.getByQuery(
    userRepository.createQuery().limit(1)
  );

  const logger = getLogger();

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
    logger.info('No users found, user should create account first.');
  }
}
