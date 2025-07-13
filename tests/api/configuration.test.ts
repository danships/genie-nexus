import { describe, expect, it } from 'vitest';
import { getTestConfig } from '../utils/config.js';

describe('API Configuration', () => {
  it('should return server configuration', async () => {
    const config = getTestConfig();

    const response = await fetch(
      `${config.baseUrl}/api/v1/configuration/server`
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('telemetryEnabled');
    expect(data.data).toHaveProperty('registrationEnabled');
  });
});
