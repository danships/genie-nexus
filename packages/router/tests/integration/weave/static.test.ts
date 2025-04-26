import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  startServer,
  type StartServerOptions,
  generateManagementApiKey,
  DEFAULT_TENANT_ID,
  generatePublicApiKey,
} from '../../../src/index.ts';

const OPTIONS: StartServerOptions = {
  port: 3031,
  dbConnectionString: 'sqlite://:memory:',
  multiTenant: false,
  logLevel: 'error',
};

describe('Static HTTP Provider', () => {
  let endServer: (() => void) | undefined;
  let managementApiKey: string = '';
  let publicApiKey: string = '';

  beforeAll(async () => {
    endServer = await startServer(OPTIONS);
    managementApiKey = await generateManagementApiKey(
      DEFAULT_TENANT_ID,
      'test',
      ['admin'],
    );
    publicApiKey = await generatePublicApiKey(DEFAULT_TENANT_ID, 'test');
  });

  afterAll(() => {
    if (!endServer) {
      return;
    }
    endServer();
    endServer = undefined;
  });

  it('should return a static response', async () => {
    const response = await fetch(`http://localhost:3031/weave/static-http`);

    const body = await response.text();
    expect(body).toBe('Hello World');
    expect(response.headers.get('x-nexus-response')).toBe('it is done.');
    expect(response.status).toBe(200);
  });

  it('should not allow a post request', async () => {
    const response = await fetch(`http://localhost:3031/weave/static-http`, {
      method: 'POST',
    });
    expect(response.status).toBe(405);
  });
});
