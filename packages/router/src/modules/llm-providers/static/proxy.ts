import type { OpenAIChatCompletionRequest } from '../../chat-completions/types/openai.js';
import type {
  ChatCompletionResponse,
  ChatCompletionStreamResponse,
} from './types.js';

export function createChatCompletion(
  request: OpenAIChatCompletionRequest,
): ChatCompletionResponse {
  // get the list user message from request
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
  request: OpenAIChatCompletionRequest,
): ChatCompletionStreamResponse {
  // get the list user message from request
  const userMessage = request.messages
    .filter((message) => message.role === 'user')
    .pop();

  const replyText = userMessage?.content ?? 'No user message';

  // Create async generator to stream response
  async function* generateStream() {
    // Stream 2 characters at a time
    for (let i = 0; i < replyText.length; i += 2) {
      const chunk = replyText.slice(i, i + 2);
      yield {
        delta: chunk,
      };
      // Add small delay to simulate streaming
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return { id: String(Math.random()), text: generateStream() };
}
