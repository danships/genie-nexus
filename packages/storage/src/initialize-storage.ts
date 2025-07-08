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
    const path = docker ? this.getPathForDocker() : this.getPathForCli();

    await mkdir(path, { recursive: true });

    return path;
  }
}
