'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import type { Post } from '@/types';

export type { Post };

interface PostsContextType {
  posts: Post[];
  isLoading: boolean;
  addPost: (post: { content: string; platforms: string[]; scheduledAt?: string; mediaUrls?: string[]; linkedInQueued?: boolean }) => void;
  updatePostStatus: (id: string, status: Post['status']) => void;
  refetch: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      // silently fail — user may not be signed in yet
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchPosts();
    else if (status === 'unauthenticated') setIsLoading(false);
  }, [status, fetchPosts]);

  const addPost = useCallback(async (data: {
    content: string;
    platforms: string[];
    scheduledAt?: string;
    mediaUrls?: string[];
    linkedInQueued?: boolean;
  }) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: data.content,
          platforms: data.platforms,
          scheduledAt: data.scheduledAt,
          mediaUrls: data.mediaUrls ?? [],
          linkedInQueued: data.linkedInQueued ?? false,
        }),
      });
      if (!res.ok) return;
      const { post } = await res.json();
      setPosts((prev) => [post, ...prev]);
    } catch {
      // optimistic fallback
      const post: Post = {
        id: Date.now().toString(),
        content: data.content,
        platforms: data.platforms,
        scheduledAt: data.scheduledAt ?? new Date().toISOString(),
        status: data.scheduledAt ? 'scheduled' : 'published',
        mediaUrls: data.mediaUrls,
        linkedInQueued: data.linkedInQueued,
      };
      setPosts((prev) => [post, ...prev]);
    }
  }, []);

  const updatePostStatus = useCallback(async (id: string, status: Post['status']) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status, linkedInQueued: false } : p)));
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
    } catch { /* ignore */ }
  }, []);

  return (
    <PostsContext.Provider value={{ posts, isLoading, addPost, updatePostStatus, refetch: fetchPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}
