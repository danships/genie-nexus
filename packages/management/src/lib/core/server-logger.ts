import { TYPE_SYMBOLS, container } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import 'server-only';

export const serverLogger = container.resolve<Logger>(TYPE_SYMBOLS.LOGGER);
