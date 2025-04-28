import type { Hooks } from 'supersave';
import get from './implementations/get';
import getById from './implementations/get-by-id';
import entityTransform from './implementations/entity-transform';
import updateBefore from './implementations/update-before';
import createBefore from './implementations/create-before';
import deleteBefore from './implementations/delete-before';

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
