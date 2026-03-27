'use client';

import { useState, useCallback } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { createApi } from '@/lib/api';
import type { Post, CreatePostPayload } from '@/types';

interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (payload: CreatePostPayload) => Promise<Post | null>;
  schedulePost: (id: string, scheduledAt: string, timezone?: string) => Promise<Post | null>;
  deletePost: (id: string) => Promise<boolean>;
}

export function usePostsApi(): UsePostsReturn {
  const { fetch: customFetch, apiUrl } = useLayout();
  const api = createApi(customFetch, apiUrl);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.posts.list();
      setPosts(data.posts ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(async (payload: CreatePostPayload): Promise<Post | null> => {
    setError(null);
    try {
      const data = await api.posts.create(payload);
      setPosts((prev) => [data.post, ...prev]);
      return data.post;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create post');
      return null;
    }
  }, []);

  const schedulePost = useCallback(async (
    id: string,
    scheduledAt: string,
    timezone?: string,
  ): Promise<Post | null> => {
    setError(null);
    try {
      const data = await api.posts.schedule(id, scheduledAt, timezone);
      setPosts((prev) => prev.map((p) => (p.id === id ? data.post : p)));
      return data.post;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to schedule post');
      return null;
    }
  }, []);

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      await api.posts.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete post');
      return false;
    }
  }, []);

  return { posts, isLoading, error, fetchPosts, createPost, schedulePost, deletePost };
}
