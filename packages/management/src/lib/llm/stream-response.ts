import type { ChatCompletionChunk } from './types';

export async function* createOpenAIStreamFromAiSdk(
  model: string,
  // biome-ignore lint/suspicious/noExplicitAny: AI SDK types are complex
  aiResponse: { textStream: AsyncIterable<string>; response: Promise<any> }
): AsyncGenerator<string> {
  const { textStream, response: responsePromise } = aiResponse;

  const index = 0;
  for await (const textPart of textStream) {
    const chunk: ChatCompletionChunk = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index,
          delta: { content: textPart },
          finish_reason: null,
        },
      ],
    };
    yield `data: ${JSON.stringify(chunk)}\n\n`;
  }

  const finalResponse = await responsePromise;
  const finalChunk: ChatCompletionChunk = {
    id: finalResponse.id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: 'stop',
      },
    ],
  };
  yield `data: ${JSON.stringify(finalChunk)}\n\n`;
  yield 'data: [DONE]\n\n';
}

export async function* createOpenAIStreamFromStatic(
  model: string,
  id: string,
  textGenerator: AsyncGenerator<{ delta: string }, void, unknown>
): AsyncGenerator<string> {
  let index = 0;
  for await (const { delta } of textGenerator) {
    const chunk: ChatCompletionChunk = {
      id: `${id}-${Date.now()}`,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index,
          delta: { content: delta },
          finish_reason: null,
        },
      ],
    };
    yield `data: ${JSON.stringify(chunk)}\n\n`;
    index++;
  }

  const finalChunk: ChatCompletionChunk = {
    id: `chatcmpl-${Date.now()}`,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: index - 1,
        delta: {},
        finish_reason: 'stop',
      },
    ],
  };
  yield `data: ${JSON.stringify(finalChunk)}\n\n`;
  yield 'data: [DONE]\n\n';
}
