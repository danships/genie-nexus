'use server';

import { TypeSymbols } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import { getConfiguration } from '@lib/api/server-api';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';

type GitHubRelease = {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
};

export type VersionInfo = {
  currentVersion: string;
  hasUpdates: boolean;
  latestRelease?: GitHubRelease | undefined;
  newerReleases: GitHubRelease[];
};

type CacheEntry = {
  releases: GitHubRelease[];
  timestamp: number;
};

let releasesCache: CacheEntry | null = null;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function compareVersions(current: string, latest: string): boolean {
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (
    let iter = 0;
    iter < Math.max(currentParts.length, latestParts.length);
    iter++
  ) {
    const currentPart = currentParts[iter] || 0;
    const latestPart = latestParts[iter] || 0;

    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }

  return false;
}

function isCacheValid(): boolean {
  if (!releasesCache) {
    return false;
  }
  return Date.now() - releasesCache.timestamp < CACHE_DURATION_MS;
}

function processRelease(release: GitHubRelease): GitHubRelease {
  const lines = release.body.split('\n');
  let selectedLine = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      selectedLine = trimmedLine;
      break;
    }
  }

  return {
    ...release,
    body: selectedLine,
  };
}

export async function checkForUpdates(): Promise<VersionInfo> {
  const logger = (await getContainer()).resolve<Logger>(TypeSymbols.LOGGER);

  try {
    const configuration = await getConfiguration();
    const currentVersion = configuration.version;

    let releases: GitHubRelease[];

    if (isCacheValid()) {
      releases = releasesCache!.releases;
      logger.debug('Using cached GitHub releases');
    } else {
      const response = await fetch(environment.GITHUB_RELEASES_URL, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': `Genie-Nexus-Update-Checker v${currentVersion}`,
        },
      });

      if (!response.ok) {
        logger.warning('Failed to fetch GitHub releases', {
          status: response.status,
          statusText: response.statusText,
        });
        return {
          currentVersion,
          hasUpdates: false,
          newerReleases: [],
        };
      }

      releases = await response.json();
      releasesCache = {
        releases,
        timestamp: Date.now(),
      };
      logger.debug('Cached GitHub releases');
    }

    const stableReleases = releases.filter(
      (release) => !release.draft && !release.prerelease
    );

    if (stableReleases.length === 0) {
      return {
        currentVersion,
        hasUpdates: false,
        newerReleases: [],
      };
    }

    const newerReleases = stableReleases
      .filter((release) =>
        compareVersions(currentVersion, release.tag_name.replace('v', ''))
      )
      .map(processRelease);

    const hasUpdates = newerReleases.length > 0;
    const latestRelease = hasUpdates ? newerReleases[0] : undefined;

    return {
      currentVersion,
      hasUpdates,
      latestRelease,
      newerReleases,
    };
  } catch (error) {
    logger.error('Error checking for updates', { error });
    return {
      currentVersion: 'unknown',
      hasUpdates: false,
      newerReleases: [],
    };
  }
}
