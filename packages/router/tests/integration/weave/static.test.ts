import 'reflect-metadata';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { type StartServerOptions, startServer } from '../../../dist/index.js';

const OPTIONS: StartServerOptions = {
  port: 3031,
  dbConnectionString: 'sqlite://:memory:',
  multiTenant: false,
  logLevel: 'error',
  integrateManagementInterface: false,
  devMode: false,
  authentication: {
    type: 'none',
  },
};

describe('Static HTTP Provider', () => {
  let endServer: (() => void) | undefined;

  beforeAll(async () => {
    endServer = await startServer(OPTIONS);
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
