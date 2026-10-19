'use client';

import { useCallback, useSyncExternalStore } from 'react';

const CHANGE_EVENT = 'buildspace:hackathon-watchlist';
const LOADING = '__watchlist_loading__';
const UNAVAILABLE = '__watchlist_unavailable__';

export function hackathonWatchlistKey(userId: string): string {
  return `buildspace:hackathon-watchlist:v1:${encodeURIComponent(userId)}`;
}

export function parseHackathonWatchlist(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object' || !('version' in data) || data.version !== 1 ||
      !('ids' in data) || !Array.isArray(data.ids)) return [];
    return [...new Set(data.ids.filter((id): id is string => typeof id === 'string' && id.length > 0))];
  } catch {
    return [];
  }
}

export function updateHackathonWatchlist(ids: string[], hackathonId: string, saved: boolean): string[] {
  const next = new Set(ids);
  if (saved) next.add(hackathonId);
  else next.delete(hackathonId);
  return [...next];
}

export function useHackathonWatchlist(userId: string | null, enabled = true) {
  const key = userId ? hackathonWatchlistKey(userId) : null;
  const subscribe = useCallback((listener: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) listener();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(CHANGE_EVENT, listener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CHANGE_EVENT, listener);
    };
  }, [key]);

  const getSnapshot = useCallback(() => {
    if (!enabled) return LOADING;
    if (!key) return '';
    try {
      return window.localStorage.getItem(key) || '';
    } catch {
      return UNAVAILABLE;
    }
  }, [enabled, key]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, () => LOADING);
  const savedIds = raw === LOADING || raw === UNAVAILABLE ? [] : parseHackathonWatchlist(raw);
  const setSaved = useCallback((hackathonId: string, saved: boolean): boolean => {
    if (!key || !enabled || !hackathonId) return false;
    try {
      const ids = parseHackathonWatchlist(window.localStorage.getItem(key));
      const next = updateHackathonWatchlist(ids, hackathonId, saved);
      window.localStorage.setItem(key, JSON.stringify({ version: 1, ids: next }));
      window.dispatchEvent(new Event(CHANGE_EVENT));
      return true;
    } catch {
      return false;
    }
  }, [enabled, key]);

  return { savedIds, setSaved, isReady: raw !== LOADING, storageAvailable: raw !== UNAVAILABLE };
}
