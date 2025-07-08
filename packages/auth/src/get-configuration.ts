import crypto from 'node:crypto';
import { Lifecycle, TypeSymbols, inject, scoped } from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type { Logger } from '@genie-nexus/logger';

const CONFIGURATION_KEY = 'auth';

type GeneralConfiguration = {
  secret: string;
};

@scoped(Lifecycle.ContainerScoped)
export class GetConfiguration {
  private configuration: GeneralConfiguration | null = null;
  constructor(
    @inject(TypeSymbols.STORED_CONFIGURATION_REPOSITORY)
    private readonly storedConfigurationRepository: StoredConfigurationRepository,
    @inject(TypeSymbols.LOGGER)
    private readonly logger: Logger
  ) {}

  private getAnonymizedSecret(secret: string) {
    const stringSecret = String(secret);
    return `${stringSecret.slice(0, 2)}...${stringSecret.slice(-1)}`;
  }

  // Add a promise to prevent concurrent initializations
  private initializationPromise: Promise<GeneralConfiguration> | null = null;

  public async getConfiguration(): Promise<GeneralConfiguration> {
    if (this.configuration) {
      return this.configuration;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeConfiguration();
    try {
      this.configuration = await this.initializationPromise;
      return this.configuration;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async initializeConfiguration(): Promise<GeneralConfiguration> {
    try {
      const configuration =
        await this.storedConfigurationRepository.getOneByQuery(
          this.storedConfigurationRepository
            .createQuery()
            .eq('key', CONFIGURATION_KEY)
        );

      const secret = configuration?.values['secret'];
      if (secret) {
        const stringSecret = String(secret);

        this.logger.debug('Using existing secret', {
          secret: this.getAnonymizedSecret(stringSecret),
        });
        return { secret: stringSecret };
      }

      const generatedSecret = crypto.randomBytes(32).toString('hex');

      this.logger.debug('Generating new secret', {
        secret: this.getAnonymizedSecret(generatedSecret),
      });

      await this.storedConfigurationRepository.create({
        key: CONFIGURATION_KEY,
        values: {
          secret: generatedSecret,
        },
      });

      return { secret: generatedSecret };
    } catch (error) {
      this.logger.error(
        'Failed to get or create authentication configuration',
        { error }
      );
      throw new Error('Authentication configuration initialization failed');
    }
  }
}
