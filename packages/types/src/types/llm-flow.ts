import type { z } from 'zod';
import type {
  llmActionSchema,
  llmEventSchema,
  llmFlowSchema,
  llmFlowStepSchema,
  llmPipelineSchema,
  llmUpdateModelActionSchema,
  llmUpdatePromptActionSchema,
} from '../schemas/llm-flow.js';

export type LlmUpdateModelAction = z.infer<typeof llmUpdateModelActionSchema>;
export type LlmUpdatePromptAction = z.infer<typeof llmUpdatePromptActionSchema>;
export type LlmAction = z.infer<typeof llmActionSchema>;
export type LlmFlowStep = z.infer<typeof llmFlowStepSchema>;
export type LlmEvent = z.infer<typeof llmEventSchema>;

export type LlmRequestContext = {
  model: string;
  user?: string;
  providerId: string;
  systemPrompt?: string | undefined;
  prompt?: string | undefined;
  responseMessage: string;
};

export type LlmPipeline = z.infer<typeof llmPipelineSchema>;
export type LlmFlow = z.infer<typeof llmFlowSchema>;

export type LlmFlowCreate = Omit<LlmFlow, 'id'>;
