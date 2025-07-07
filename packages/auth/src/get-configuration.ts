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

  public async getConfiguration() {
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
      this.configuration = { secret: String(secret) };
      return this.configuration;
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

    this.configuration = { secret: generatedSecret };
    return this.configuration;
  }
}
