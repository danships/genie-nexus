import { TypeSymbols, inject, singleton } from '@genie-nexus/container';
import type {
  DeploymentRepository,
  NextAuthUserRepository,
  ProviderRepository,
} from '@genie-nexus/database';
import { SendTelemetryEvent } from './send-event.js';

@singleton()
export class SendPingEvent {
  constructor(
    @inject(TypeSymbols.DEPLOYMENT_REPOSITORY)
    private readonly deploymentRepository: DeploymentRepository,
    @inject(TypeSymbols.PROVIDER_REPOSITORY)
    private readonly providerRepository: ProviderRepository,
    @inject(TypeSymbols.NEXT_AUTH_USER_REPOSITORY)
    private readonly nextAuthUserRepository: NextAuthUserRepository,
    @inject(SendTelemetryEvent)
    private readonly sendTelemetryEvent: SendTelemetryEvent
  ) {}

  private groupPerType<T extends { type: string }>(
    items: T[]
  ): Record<string, number> {
    const grouped = items.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return grouped;
  }

  public async sendEvent(): Promise<void> {
    // TODO replace this with a count query when supersave supports it
    const deployments = await this.deploymentRepository.getAll();
    const providers = await this.providerRepository.getAll();
    const users = await this.nextAuthUserRepository.getAll();

    void this.sendTelemetryEvent.sendEvent({
      type: 'ping',
      stats: {
        deployments: this.groupPerType(deployments),
        providers: this.groupPerType(providers),
        users: users.length,
      },
    });
  }
}
