import type { Hooks } from 'supersave';
import get from './implementations/get.js';
import getById from './implementations/get-by-id.js';
import entityTransform from './implementations/entity-transform.js';
import updateBefore from './implementations/update-before.js';
import createBefore from './implementations/create-before.js';
import deleteBefore from './implementations/delete-before.js';

export function getHooksForCollection(): Hooks {
  return {
    get,
    // @ts-expect-error Ignore types here because we require a tenantId in the hook.
    getById,
    // @ts-expect-error Ignore types here because we require a tenantId in the hook.
    entityTransform,
    // @ts-expect-error Ignore types here because we require a tenantId in the hook.
    updateBefore,
    // @ts-expect-error Ignore types here because we require a tenantId in the hook.
    createBefore,
    // @ts-expect-error Ignore types here because we require a tenantId in the hook.
    deleteBefore,
  };
}
