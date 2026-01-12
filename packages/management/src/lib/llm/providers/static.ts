import type { OpenAIChatCompletionRequest } from '../types';

export type ChatCompletionResponse = {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

export type ChatCompletionStreamResponse = {
  id: string;
  text: AsyncGenerator<{ delta: string }, void, unknown>;
};

export function createChatCompletion(
  request: OpenAIChatCompletionRequest
): ChatCompletionResponse {
  const userMessage = request.messages
    .filter((message) => message.role === 'user')
    .pop();

  const replyText = userMessage?.content ?? 'No user message';
  return {
    text: replyText,
    usage: {
      promptTokens: 42,
      completionTokens: replyText.length,
      totalTokens: 42 + replyText.length,
    },
  };
}

export function createStreamingChatCompletion(
  request: OpenAIChatCompletionRequest
): ChatCompletionStreamResponse {
  const userMessage = request.messages
    .filter((message) => message.role === 'user')
    .pop();

  const replyText = userMessage?.content ?? 'No user message';

  async function* generateStream() {
    for (let i = 0; i < replyText.length; i += 2) {
      const chunk = replyText.slice(i, i + 2);
      yield { delta: chunk };
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return { id: String(Math.random()), text: generateStream() };
}
