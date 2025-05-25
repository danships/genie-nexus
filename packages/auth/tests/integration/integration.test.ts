import { SuperSave } from 'supersave';
import { getAuth } from '../../dist';
import { describe, it } from 'vitest';

describe('getAuth', () => {
  it('should work for credentials', async () => {
    const superSave = await SuperSave.create('sqlite://:memory:');
    const auth = getAuth({
      debug: true,
      defaultTenantId: 'default',
      superSave,
      authenticationMethod: 'credentials',
    });

    const ctx = await auth.api.signUpEmail({
        
    });
    ctx.
  });
});
