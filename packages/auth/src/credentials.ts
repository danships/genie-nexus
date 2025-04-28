import { z, ZodError } from 'zod';
import { logger, verifyUsingHashedPassword } from './utils';
import type { NextAuthUser } from '@genie-nexus/database';
import type { Repository } from 'supersave';

export const credentialsSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
  name: z.string().optional(),
});

export const getCredentialsAuthorize =
  (userRepository: Repository<NextAuthUser>) =>
  async (credentials: Partial<Record<'email' | 'password', unknown>>) => {
    try {
      const input = await credentialsSchema.parseAsync(credentials);

      const user = await userRepository.getOneByQuery(
        userRepository.createQuery().eq('email', input.email),
      );
      if (!user) {
        logger('User not found', { email: input.email });
        return null;
      }

      if (!(await verifyUsingHashedPassword(input.password, user.password))) {
        logger('Invalid password', { email: input.email });
        return null;
      }

      logger('User signed in', { email: input.email });
      return user;
    } catch (error) {
      if (error instanceof ZodError) {
        // Return `null` to indicate that the credentials are invalid
        return null;
      }
      logger('Error during sign in', { error });
      throw error;
    }
  };
