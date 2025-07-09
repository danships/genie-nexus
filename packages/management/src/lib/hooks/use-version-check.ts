import { type VersionInfo, checkForUpdates } from '@app/app/updates/_actions';
import { useRetrieveData } from '@lib/hooks/use-retrieve-data';
import { useCallback, useEffect, useMemo, useState } from 'react';

const DISMISSED_KEY_PREFIX = 'genie-nexus-update-dismissed';

function getDismissedKey(
  currentVersion: string,
  latestVersion: string
): string {
  return `${DISMISSED_KEY_PREFIX}-${currentVersion}-${latestVersion}`;
}

function isUpdateDismissed(
  currentVersion: string,
  latestVersion: string
): boolean {
  if (typeof window === 'undefined') return false;
  const dismissedKey = getDismissedKey(currentVersion, latestVersion);
  const stored = localStorage.getItem(dismissedKey);
  return stored === 'true';
}

function dismissUpdate(currentVersion: string, latestVersion: string): void {
  if (typeof window === 'undefined') return;
  const dismissedKey = getDismissedKey(currentVersion, latestVersion);
  localStorage.setItem(dismissedKey, 'true');
}

export function useVersionCheck() {
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  const fetchUpdates = useCallback(async () => {
    return await checkForUpdates();
  }, []);

  const options = useMemo(
    () => ({
      autoStart: true,
    }),
    []
  );

  const {
    data: versionInfo,
    loading,
    error,
    refresh: checkForUpdatesNow,
  } = useRetrieveData<VersionInfo>(fetchUpdates, options);

  useEffect(() => {
    if (versionInfo?.hasUpdates && versionInfo.latestRelease) {
      const currentVersion = versionInfo.currentVersion;
      const latestVersion = versionInfo.latestRelease.tag_name.replace('v', '');
      const isDismissed = isUpdateDismissed(currentVersion, latestVersion);
      setShowUpdateIndicator(!isDismissed);
    } else {
      setShowUpdateIndicator(false);
    }
  }, [versionInfo]);

  const dismissUpdateHandler = () => {
    if (versionInfo?.latestRelease) {
      const currentVersion = versionInfo.currentVersion;
      const latestVersion = versionInfo.latestRelease.tag_name.replace('v', '');
      dismissUpdate(currentVersion, latestVersion);
      setShowUpdateIndicator(false);
    }
  };

  return {
    versionInfo,
    loading,
    error,
    showUpdateIndicator,
    checkForUpdatesNow,
    dismissUpdate: dismissUpdateHandler,
  };
}
