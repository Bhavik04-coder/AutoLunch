/**
 * API abstraction layer — all calls go through here.
 * Uses the mock-aware customFetch from LayoutContext when called inside React,
 * or falls back to native fetch for server-side usage.
 *
 * Usage inside components:
 *   const { fetch: customFetch, apiUrl } = useLayout();
 *   const api = createApi(customFetch, apiUrl);
 *   const posts = await api.posts.list();
 */

import { ENDPOINTS } from './endpoints';
import type { CreatePostPayload, Post } from '@/types';

type FetchFn = (url: string, options?: RequestInit) => Promise<Response>;
type ApiUrlFn = (path: string) => string;

export function createApi(fetchFn: FetchFn, apiUrl: ApiUrlFn) {
  const json = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const res = await fetchFn(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? `Request failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
  };

  return {
    // ── Auth ────────────────────────────────────────────────────────────────
    auth: {
      me: () => json(apiUrl(ENDPOINTS.auth.me)),
      login: (email: string, password: string) =>
        json(apiUrl(ENDPOINTS.auth.login), {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }),
      register: (name: string, email: string, password: string) =>
        json(apiUrl(ENDPOINTS.auth.register), {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        }),
      logout: () =>
        json(apiUrl(ENDPOINTS.auth.logout), { method: 'POST' }),
    },

    // ── Posts ────────────────────────────────────────────────────────────────
    posts: {
      list: () =>
        json<{ posts: Post[] }>(apiUrl(ENDPOINTS.posts.list)),
      create: (payload: CreatePostPayload) =>
        json<{ post: Post }>(apiUrl(ENDPOINTS.posts.create), {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      update: (id: string, payload: Partial<CreatePostPayload>) =>
        json<{ post: Post }>(apiUrl(ENDPOINTS.posts.update(id)), {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }),
      delete: (id: string) =>
        json(apiUrl(ENDPOINTS.posts.delete(id)), { method: 'DELETE' }),
      schedule: (id: string, scheduledAt: string, timezone?: string) =>
        json<{ post: Post }>(apiUrl(ENDPOINTS.posts.schedule(id)), {
          method: 'POST',
          body: JSON.stringify({ scheduledAt, timezone }),
        }),
    },

    // ── Integrations ─────────────────────────────────────────────────────────
    integrations: {
      list: () => json(apiUrl(ENDPOINTS.integrations.list)),
      disconnect: (provider: string) =>
        json(apiUrl(ENDPOINTS.integrations.disconnect(provider)), { method: 'POST' }),
    },

    // ── Media ────────────────────────────────────────────────────────────────
    media: {
      list: () => json(apiUrl(ENDPOINTS.media.list)),
      delete: (id: string) =>
        json(apiUrl(ENDPOINTS.media.delete(id)), { method: 'DELETE' }),
    },
  };
}

export type Api = ReturnType<typeof createApi>;
