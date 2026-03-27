'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import type { ConnectedAccount, PlatformId } from '@/types';

const STORAGE_KEY = 'al_connected_platforms';

function loadFromStorage(): Record<string, ConnectedAccount> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveToStorage(data: Record<string, ConnectedAccount>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useIntegrations() {
  const { data: session } = useSession();
  const [connected, setConnected] = useState<Record<string, ConnectedAccount>>(loadFromStorage);
  const [loading, setLoading] = useState<string | null>(null);

  // Merge newly completed OAuth into local state
  useEffect(() => {
    const provider = (session as any)?.provider as string | undefined;
    const sessionConnected: Record<string, { accessToken: string; connectedAt: number }> =
      (session as any)?.connected ?? {};
    if (!provider || !sessionConnected[provider]) return;

    setConnected((prev) => {
      const next = {
        ...prev,
        [provider]: {
          provider: provider as PlatformId,
          name: session?.user?.name ?? provider,
          connectedAt: sessionConnected[provider].connectedAt,
          accessToken: sessionConnected[provider].accessToken,
        },
      };
      saveToStorage(next);
      return next;
    });
  }, [session]);

  const connect = useCallback(async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: '/third-party' });
    // loading cleared on redirect return
  }, []);

  const disconnect = useCallback((provider: string) => {
    setConnected((prev) => {
      const next = { ...prev };
      delete next[provider];
      saveToStorage(next);
      return next;
    });
  }, []);

  const isConnected = useCallback(
    (provider: string) => !!connected[provider],
    [connected],
  );

  return {
    connected,
    loading,
    connect,
    disconnect,
    isConnected,
    connectedList: Object.values(connected),
  };
}
