import { readFile } from 'node:fs/promises';
import { TypeSymbols, inject, singleton } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';

type Information = {
  name: string;
  version: string;
};

@singleton()
export class GetApplicationInformation {
  private fetchedInformation: Information = { name: '', version: '' };

  constructor(@inject(TypeSymbols.LOGGER) private readonly logger: Logger) {}

  public async getApplicationInformation(): Promise<{
    name: string;
    version: string;
  }> {
    if (this.fetchedInformation.name !== '') {
      return this.fetchedInformation;
    }

    try {
      const packagePath = new URL('../../package.json', import.meta.url);
      const packageContent = await readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);

      this.fetchedInformation = {
        version: packageJson.version,
        name: packageJson.name,
      };
      return { version: packageJson.version, name: packageJson.name };
    } catch (error) {
      this.logger.error('Failed to read package.json', { error });
      return { name: 'unknown', version: 'unknown' };
    }
  }
}
