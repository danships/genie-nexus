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
