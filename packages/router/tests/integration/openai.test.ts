import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startServer, type Configuration } from '../..';
import { OpenAI } from 'openai';

const CONFIGURATION: Configuration = {
  port: 3030,
  providers: [
    {
      id: 'openai',
      name: 'openai',
      type: 'openai',
      apiKey: 'sk-...',
      baseURL: 'https://api.openai.com/v1',
    },
  ],
  deployments: [
    {
      id: 'default',
      default: {
        name: 'gpt-3.5-turbo',
        provider: 'openai',
        model: 'gpt-3.5-turbo',
      },
    },
  ],
};

describe('OpenAI Compatibility', () => {
  let endServer: (() => void) | undefined;

  beforeAll(async () => {
    endServer = startServer({
      port: 3030,
    });
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
      apiKey: 'abcde',
      baseURL: `http://localhost:${CONFIGURATION.port}/api/v1`,
    });

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello, world!' }],
      model: 'gpt-3.5-turbo',
    });

    expect(response).toBeDefined();
  });
});
