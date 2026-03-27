'use client';

import { useSession, signOut } from 'next-auth/react';
import { useUser } from '@/contexts/UserContext';
import { tokenStorage } from '@/lib/authUtils';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const { user, organization, subscription, isLoading } = useUser();
  const router = useRouter();

  const isAuthenticated =
    status === 'authenticated' || tokenStorage.isPresent();

  const logout = useCallback(async () => {
    tokenStorage.clear();
    await signOut({ callbackUrl: '/auth/login' });
  }, []);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated && status !== 'loading') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, status, router]);

  return {
    user,
    session,
    organization,
    subscription,
    isAuthenticated,
    isLoading: isLoading || status === 'loading',
    logout,
    requireAuth,
  };
}
