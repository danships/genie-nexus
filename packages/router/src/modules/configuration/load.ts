import type { Configuration } from './validate';
import { ConfigSchema } from './validate';
import { readFile } from 'fs/promises';

export async function load(configurationFile: string): Promise<Configuration> {
  const configuration = await readFile(configurationFile, 'utf8');
  const parsed = ConfigSchema.parse(JSON.parse(configuration));
  return parsed;
}
