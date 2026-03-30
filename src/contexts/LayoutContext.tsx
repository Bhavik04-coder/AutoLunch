'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useVariables } from './VariableContext';
import { useRouter } from 'next/navigation';
import { mockAuth, mockPosts } from '@/lib/mockAuth';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  useMock?: boolean;
}

interface LayoutContextType {
  fetch: (url: string, options?: FetchOptions) => Promise<Response>;
  apiUrl: (path: string) => string;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const variables = useVariables();
  const router = useRouter();

  const apiUrl = useCallback((path: string) => {
    const base = variables.backendUrl;
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }, [variables.backendUrl]);

  const customFetch = useCallback(async (url: string, options: FetchOptions = {}) => {
    const { skipAuth, useMock = true, ...fetchOptions } = options;

    // Mock API responses for development
    if (useMock && typeof window !== 'undefined') {
      try {
        const urlPath = url.replace(variables.backendUrl, '');
        const body = fetchOptions.body ? JSON.parse(fetchOptions.body as string) : {};

        // Mock auth endpoints
        if (urlPath === '/auth/login' && fetchOptions.method === 'POST') {
          const result = await mockAuth.login(body.email, body.password);
          document.cookie = `auth-token=${result.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
          return new Response(JSON.stringify(result), { status: 200 });
        }

        if (urlPath === '/auth/register' && fetchOptions.method === 'POST') {
          const result = await mockAuth.register(body.name, body.email, body.password);
          document.cookie = `auth-token=${result.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
          return new Response(JSON.stringify(result), { status: 200 });
        }

        // Route /auth/me and /posts/* to real Next.js API routes (Supabase-backed)
        if (urlPath === '/auth/me') {
          return fetch('/api/auth/me', { credentials: 'include' });
        }

        if (urlPath === '/posts' && (!fetchOptions.method || fetchOptions.method === 'GET')) {
          return fetch('/api/posts', { credentials: 'include' });
        }

        if (urlPath === '/posts' && fetchOptions.method === 'POST') {
          return fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include',
          });
        }

        if (urlPath.match(/^\/posts\/[^/]+$/) && fetchOptions.method === 'PATCH') {
          const id = urlPath.split('/')[2];
          return fetch(`/api/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include',
          });
        }

        if (urlPath.match(/^\/posts\/[^/]+$/) && fetchOptions.method === 'DELETE') {
          const id = urlPath.split('/')[2];
          return fetch(`/api/posts/${id}`, { method: 'DELETE', credentials: 'include' });
        }

        if (urlPath.match(/^\/posts\/[^/]+\/schedule$/) && fetchOptions.method === 'POST') {
          const id = urlPath.split('/')[2];
          return fetch(`/api/posts/${id}/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include',
          });
        }

        if (urlPath === '/integrations' && (!fetchOptions.method || fetchOptions.method === 'GET')) {
          return fetch('/api/integrations', { credentials: 'include' });
        }

        if (urlPath.match(/^\/integrations\/[^/]+\/disconnect$/) && fetchOptions.method === 'POST') {
          const provider = urlPath.split('/')[2];
          return fetch(`/api/integrations/${provider}/disconnect`, {
            method: 'POST',
            credentials: 'include',
          });
        }

        if (urlPath === '/media' && (!fetchOptions.method || fetchOptions.method === 'GET')) {
          return fetch('/api/media', { credentials: 'include' });
        }

        if (urlPath.match(/^\/media\/[^/]+$/) && fetchOptions.method === 'DELETE') {
          const id = urlPath.split('/')[2];
          return fetch(`/api/media/${id}`, { method: 'DELETE', credentials: 'include' });
        }

        // If no mock handler, try real API
      } catch (mockError: any) {
        return new Response(JSON.stringify({ error: mockError.message }), { status: 400 });
      }
    }

    // Real API call
    const headers = new Headers(fetchOptions.headers);
    
    if (!skipAuth && typeof window !== 'undefined') {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      });

      const newAuthToken = response.headers.get('x-auth-token');
      if (newAuthToken && typeof document !== 'undefined') {
        document.cookie = `auth-token=${newAuthToken}; path=/; max-age=${30 * 24 * 60 * 60}`;
      }

      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-token=; path=/; max-age=0';
          document.cookie = 'refresh-token=; path=/; max-age=0';
          router.push('/auth/login');
        }
      } else if (response.status === 402) {
        if (typeof window !== 'undefined') {
          router.push('/billing');
        }
      } else if (response.status === 406) {
        if (typeof window !== 'undefined' && response.headers.get('x-reload') === 'true') {
          window.location.reload();
        }
      }

      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }, [router, variables.backendUrl]);

  return (
    <LayoutContext.Provider value={{ fetch: customFetch, apiUrl }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
