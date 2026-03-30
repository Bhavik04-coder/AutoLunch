'use client';
import { useState, useEffect } from 'react';
import styles from './plugs.module.scss';

interface Plug {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  docs: string;
  connected: boolean;
}

export function PlugsComponent() {
  const [plugs, setPlugs] = useState<Plug[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch('/api/plugs', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setPlugs(data.plugs ?? []))
      .catch(() => {});
  }, []);

  const toggle = async (plug: Plug) => {
    setLoading(plug.slug);
    const newEnabled = !plug.connected;
    setPlugs((prev) => prev.map((p) => p.slug === plug.slug ? { ...p, connected: newEnabled } : p));
    await fetch('/api/plugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ slug: plug.slug, enabled: newEnabled }),
    });
    setToast(`${plug.name} ${newEnabled ? 'connected' : 'disconnected'}`);
    setTimeout(() => setToast(''), 3000);
    setLoading(null);
  };

  const connectedCount = plugs.filter((p) => p.connected).length;

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}><span>✓</span> {toast}</div>}

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <span className={styles.pageTitle}>Plugins</span>
        </div>
        <div className={styles.summary}>
          <span className={styles.summaryPill}>{connectedCount} active</span>
          of {plugs.length} plugins
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          {plugs.map((plug) => (
            <div key={plug.slug} className={`${styles.card} ${plug.connected ? styles.cardConnected : ''}`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>{plug.icon}</div>
                <div className={`${styles.badge} ${plug.connected ? styles.connected : ''}`}>
                  {plug.connected ? '● Active' : '○ Inactive'}
                </div>
              </div>
              <div className={styles.name}>{plug.name}</div>
              <div className={styles.desc}>{plug.description}</div>
              <div className={styles.cardFooter}>
                <a href={plug.docs} className={styles.docsLink}>View docs →</a>
                <button
                  type="button"
                  className={plug.connected ? styles.disconnectBtn : styles.connectBtn}
                  onClick={() => toggle(plug)}
                  disabled={loading === plug.slug}
                >
                  {loading === plug.slug
                    ? <span className={styles.loadingSpinner} />
                    : plug.connected ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
