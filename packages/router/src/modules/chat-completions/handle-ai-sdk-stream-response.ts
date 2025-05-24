import type { StreamTextResult } from 'ai';
import type { Response } from 'express';

export async function handleAiSdkStreamResponse(
  model: string,
  expressResponse: Response,
  aiResponse: StreamTextResult<never, never>,
) {
  const { textStream, response: responsePromise } = aiResponse;

  const index = 0;
  for await (const textPart of textStream) {
    // Format each chunk according to OpenAI's streaming format
    const chunk = {
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
    expressResponse.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }

  // Send the final chunk with finish_reason
  const finalResponse = await responsePromise;
  const finalChunk = {
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
  expressResponse.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
  expressResponse.write('data: [DONE]\n\n');
  expressResponse.end();
}
