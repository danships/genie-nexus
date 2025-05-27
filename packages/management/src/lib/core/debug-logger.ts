import { isDebug } from './is-debug';

export const debugLogger = (...args: unknown[]): void => {
  if (!isDebug()) {
    return;
  }

  console.info.apply(null, ['GNX', ...args]);
};
