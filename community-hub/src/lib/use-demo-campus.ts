'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { SetStateAction } from 'react';
import type { ContentReport } from '@/types';
import {
  MOCK_IDEAS, MOCK_HACKATHONS, MOCK_TEAMS, MOCK_MESSAGES, MOCK_PROJECTS,
  MOCK_FILES, MOCK_NOTIFICATIONS, MOCK_JOIN_REQUESTS,
} from './mock-data';
import {
  createCampusStorage, decodeDemoSnapshot, encodeDemoSnapshot, validateDemoCampus,
  parseCampusStoreSnapshot, EMPTY_CAMPUS_STORE_SNAPSHOT, DEMO_STORAGE_KEY,
} from './demo-storage';

const seed = {
  ideas: MOCK_IDEAS,
  hackathons: MOCK_HACKATHONS,
  teams: MOCK_TEAMS,
  messages: MOCK_MESSAGES,
  projects: MOCK_PROJECTS,
  files: MOCK_FILES,
  notifications: MOCK_NOTIFICATIONS,
  joinRequests: MOCK_JOIN_REQUESTS,
  reports: [] as ContentReport[],
};
type Campus = typeof seed;
function restore(raw: string | null): Campus {
  return decodeDemoSnapshot(raw, seed, validateDemoCampus);
}
const changedEvent = 'buildspace:campus-changed';
const storage = createCampusStorage(() => window.localStorage);

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === DEMO_STORAGE_KEY || event.key === null) callback();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(changedEvent, callback);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(changedEvent, callback);
  };
}

export function useDemoCampus(demo: boolean) {
  const getSnapshot = useCallback(() => storage.getSnapshot(demo), [demo]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_CAMPUS_STORE_SNAPSHOT);
  const { raw, storageFailed } = useMemo(() => parseCampusStoreSnapshot(snapshot), [snapshot]);
  const campus = useMemo(() => restore(raw), [raw]);

  const updateField = useCallback(<K extends keyof Campus>(key: K, action: SetStateAction<Campus[K]>) => {
    const previous = restore(parseCampusStoreSnapshot(storage.getSnapshot(demo)).raw);
    const next = typeof action === 'function'
      ? (action as (value: Campus[K]) => Campus[K])(previous[key])
      : action;
    const serialized = encodeDemoSnapshot({ ...previous, [key]: next });
    storage.writeRaw(serialized, demo);
    window.dispatchEvent(new Event(changedEvent));
  }, [demo]);

  return { campus, updateField, storageFailed: demo && storageFailed };
}
