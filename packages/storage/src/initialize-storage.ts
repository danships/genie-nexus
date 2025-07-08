import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { cwd } from 'node:process';
import { Lifecycle, scoped } from '@genie-nexus/container';

@singleton()
export class InitializeStorage {
  private getPathForDocker() {
    return '/gnxs-data';
  }

  private getPathForCli() {
    return path.join(cwd(), 'gnxs-data');
  }

  public async initialize(docker: boolean): Promise<string> {
    const storagePath = docker ? this.getPathForDocker() : this.getPathForCli();

    try {
      await mkdir(storagePath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create storage directory at ${storagePath}: ${error}`);
    }

    return storagePath;
  }
}
