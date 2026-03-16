'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLayout } from '@/contexts/LayoutContext';
import { PostizLogo } from '@/components/layout/PostizLogo';
import styles from '../auth.module.scss';

export default function RegisterPage() {
  const router = useRouter();
  const { fetch: customFetch, apiUrl } = useLayout();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await customFetch(apiUrl('/auth/register'), {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        router.push('/auth/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
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
              <h1>Create Account</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.field}>
                <label htmlFor="name">Full Name</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>

              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" minLength={3} />
              </div>

              <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className={styles.footer}>
              Already have an account? <Link href="/auth/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightTitle}>
          Join <span className={styles.highlight}>20,000+</span> Entrepreneurs
          <br />Growing Their Social Presence
        </div>
      </div>
    </div>
  );
}
