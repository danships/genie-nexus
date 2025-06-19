import { TypeSymbols, container } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';

export function getLogger(): Logger {
  return container.resolve<Logger>(TypeSymbols.LOGGER);
}
