function isDevHost() {
  return (
    globalThis['location'] &&
    globalThis.location.hostname === 'localhost' &&
    ['3000', '3001'].includes(globalThis.location.port)
  );
}

export const isDebug = () =>
  isDevHost() || globalThis.localStorage
    ? globalThis.localStorage.getItem('DEBUG') !== null
    : true;
