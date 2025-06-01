import { logger } from '@genie-nexus/logger';
import { container as tsyringeContainer } from 'tsyringe';
import { TYPE_SYMBOLS } from './type-symbols.js';

export * from './type-symbols.js';
export { container } from 'tsyringe';

tsyringeContainer.register(TYPE_SYMBOLS.LOGGER, { useValue: logger });
