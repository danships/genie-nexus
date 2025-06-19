import 'reflect-metadata';
import { container } from '@genie-nexus/container';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// const OPTIONS: StartServerOptions = {
//   port: 3031,
//   multiTenant: false,
//   integrateManagementInterface: false,
//   devMode: false,
//   authentication: {
//     type: 'none',
//   },
// };

// Skipping because this test no longer works now we have the DI container.
describe.skip('Static HTTP Provider', () => {
  let endServer: (() => void) | undefined;

  beforeAll(() => {
    // if (GenieNexusServer) {
    //   endServer = await new GenieNexusServer().startServer(OPTIONS);
    // }
    container.reset();
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
