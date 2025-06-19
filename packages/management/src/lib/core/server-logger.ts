import { TypeSymbols } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import 'server-only';
import { getContainer } from './get-container';

export const serverLogger = getContainer().resolve<Logger>(TypeSymbols.LOGGER);
