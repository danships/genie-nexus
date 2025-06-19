import type { z } from 'zod';
import type {
  weaveActionSchema,
  weaveAddRequestHeaderActionSchema,
  weaveAddResponseHeaderActionSchema,
  weaveDelayActionSchema,
  llmEventSchema,
  weaveFilterActionSchema,
  weaveFlowSchema,
  weaveFlowStepSchema,
  weavePipelineSchema,
  weaveRemoveRequestHeaderActionSchema,
  weaveRemoveResponseHeaderActionSchema,
  weaveSetRequestHeaderActionSchema,
  weaveSetResponseHeaderActionSchema,
  weaveTransformDataActionSchema,
  weaveUpdateResponseBodyActionSchema,
  weaveUpdateResponseStatusCodeActionSchema,
} from '../schemas/weave-flow.js';

export type WeaveAddRequestHeaderAction = z.infer<
  typeof weaveAddRequestHeaderActionSchema
>;
export type WeaveRemoveRequestHeaderAction = z.infer<
  typeof weaveRemoveRequestHeaderActionSchema
>;
export type WeaveSetRequestHeaderAction = z.infer<
  typeof weaveSetRequestHeaderActionSchema
>;
export type WeaveAddResponseHeaderAction = z.infer<
  typeof weaveAddResponseHeaderActionSchema
>;
export type WeaveRemoveResponseHeaderAction = z.infer<
  typeof weaveRemoveResponseHeaderActionSchema
>;
export type WeaveSetResponseHeaderAction = z.infer<
  typeof weaveSetResponseHeaderActionSchema
>;
export type WeaveUpdateResponseBodyAction = z.infer<
  typeof weaveUpdateResponseBodyActionSchema
>;
export type WeaveUpdateResponseStatusCodeAction = z.infer<
  typeof weaveUpdateResponseStatusCodeActionSchema
>;
export type WeaveTransformDataAction = z.infer<
  typeof weaveTransformDataActionSchema
>;
export type WeaveFilterAction = z.infer<typeof weaveFilterActionSchema>;
export type WeaveDelayAction = z.infer<typeof weaveDelayActionSchema>;
export type WeaveAction = z.infer<typeof weaveActionSchema>;

export type WeaveFlowStep = z.infer<typeof weaveFlowStepSchema>;
export type WeaveFlow = z.infer<typeof weaveFlowSchema>;

export type WeaveRequestContext = {
  path: string;
  method: string;
  requestHeaders: Record<string, string>;
  requestBody: unknown;
  responseHeaders: Record<string, string>;
  responseBody: unknown;
  responseStatusCode: number;
  providerId: string;
};

export type WeavePipeline = z.infer<typeof weavePipelineSchema>;
export type WeaveEvent = z.infer<typeof llmEventSchema>;

export type WeaveFlowCreate = Omit<WeaveFlow, 'id'>;
