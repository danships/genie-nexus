import { isDebug } from './is-debug';

export const debugLogger = (...args: unknown[]): void => {
  if (!isDebug()) {
    return;
  }
  // eslint-disable-next-line no-console
  console.info.apply(null, ['GNX', ...args]);
};
