import { z } from 'zod';

export const ConfigSchema = z.object({
  port: z.number().optional().default(3000),
  providers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      apiKey: z.string(),
      baseURL: z.string().url(),
    }),
  ),
  deployments: z.array(
    z.object({
      id: z.string(),
      default: z.object({
        name: z.string(),
        provider: z.string(),
        model: z.string(),
      }),
    }),
  ),
});

export type Configuration = z.infer<typeof ConfigSchema>;
