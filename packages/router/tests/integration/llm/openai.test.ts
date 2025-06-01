import 'reflect-metadata';
import { OpenAI } from 'openai';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  DEFAULT_TENANT_ID,
  type StartServerOptions,
  generateManagementApiKey,
  generatePublicApiKey,
  startServer,
} from '../../../dist/index.js';

const OPTIONS: StartServerOptions = {
  port: 3030,
  dbConnectionString: 'sqlite://:memory:',
  devMode: false,
  authentication: { type: 'none' },
  integrateManagementInterface: false,
  logLevel: 'error',
  multiTenant: false,
};

describe('OpenAI Compatibility', () => {
  let endServer: (() => void) | undefined;
  let publicApiKey: string = '';

  beforeAll(async () => {
    endServer = await startServer(OPTIONS);
    publicApiKey = await generatePublicApiKey(DEFAULT_TENANT_ID, 'test');
  });

  afterAll(() => {
    if (!endServer) {
      return;
    }
    endServer();
    endServer = undefined;
  });

  it('should be able to use the OpenAI API', async () => {
    const openai = new OpenAI({
      apiKey: publicApiKey,
      baseURL: `http://localhost:${OPTIONS.port}/api/v1/static-echo`,
    });

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello, world!' }],
      model: 'static-echo',
    });

    expect(response).toBeDefined();
  });

  it('should be able to stream responses from the OpenAI API', async () => {
    const openai = new OpenAI({
      apiKey: publicApiKey,
      baseURL: `http://localhost:${OPTIONS.port}/api/v1/static-echo`,
    });

    const stream = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello, world!' }],
      model: 'static-echo',
      stream: true,
    });

    const chunks: string[] = [];
    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        chunks.push(chunk.choices[0].delta.content);
      }
    }

    const fullResponse = chunks.join('');
    expect(chunks.length).toBeGreaterThan(0);
    expect(fullResponse).toBeDefined();
    expect(typeof fullResponse).toBe('string');
    expect(fullResponse.length).toBeGreaterThan(0);
  });
});
