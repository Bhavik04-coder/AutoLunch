'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLayout } from '@/contexts/LayoutContext';
import { PostizLogo } from '@/components/layout/PostizLogo';
import styles from '../auth.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetch: customFetch, apiUrl } = useLayout();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await customFetch(apiUrl('/auth/login'), {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        router.push(searchParams.get('redirect') || '/launches');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.leftInner}>
          <div className={styles.logo}>
            <PostizLogo />
            AutoLaunch
          </div>

          <div className={styles.card}>
            <div className={styles.header}>
              <h1>Sign In</h1>
            </div>

            <div className={styles.demoInfo}>
              ✨ Demo Mode — enter any email and password to login
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.field}>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>

              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>

              <div className={styles.forgot}>
                <Link href="#">Forgot password?</Link>
              </div>

              <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className={styles.footer}>
              Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightTitle}>
          Over <span className={styles.highlight}>20,000+</span> Entrepreneurs use
          <br />AutoLaunch To Grow Their Social Presence
        </div>
      </div>
    </div>
  );
}
