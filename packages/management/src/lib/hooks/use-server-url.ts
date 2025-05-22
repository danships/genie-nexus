'use client';

export function useServerUrl(path = '') {
  return `${globalThis.location.protocol}//${globalThis.location.host}${path}`;
}
