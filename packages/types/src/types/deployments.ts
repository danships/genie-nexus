import type { z } from 'zod';
import type {
  deploymentLLMSchema,
  deploymentLLMSchemaApi,
  deploymentSchema,
  deploymentSchemaApi,
  deploymentWeaveSchema,
  deploymentWeaveSchemaApi,
} from '../schemas/deployments.js';
import type { WithId } from './api.js';

// API Types (without id and tenantId)
export type DeploymentLLMApi = WithId<z.infer<typeof deploymentLLMSchemaApi>>;
export type DeploymentLLMApiCreate = z.infer<typeof deploymentLLMSchemaApi>;
export type DeploymentWeaveApi = WithId<
  z.infer<typeof deploymentWeaveSchemaApi>
>;
export type DeploymentWeaveApiCreate = z.infer<typeof deploymentWeaveSchemaApi>;
export type DeploymentApi = WithId<z.infer<typeof deploymentSchemaApi>>;

// DB Types (with id and tenantId)
export type DeploymentLLM = z.infer<typeof deploymentLLMSchema>;
export type DeploymentWeave = z.infer<typeof deploymentWeaveSchema>;
export type Deployment = z.infer<typeof deploymentSchema>;
