'use client';
import styles from './third-party.module.scss';

const PLATFORMS = [
  { id: 'twitter', name: 'X (Twitter)', color: '#000', connected: true, username: '@autolaunch' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', connected: true, username: 'AutoLaunch Inc.' },
  { id: 'instagram', name: 'Instagram', color: '#e4405f', connected: false, username: '' },
  { id: 'facebook', name: 'Facebook', color: '#1877f2', connected: false, username: '' },
  { id: 'youtube', name: 'YouTube', color: '#ff0000', connected: false, username: '' },
  { id: 'reddit', name: 'Reddit', color: '#ff4500', connected: false, username: '' },
  { id: 'discord', name: 'Discord', color: '#5865f2', connected: false, username: '' },
  { id: 'telegram', name: 'Telegram', color: '#0088cc', connected: false, username: '' },
];

export function ThirdPartyComponent() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.intro}>
          <h3 className={styles.introTitle}>Connect Your Social Accounts</h3>
          <p className={styles.introText}>Link your social media accounts to start scheduling posts across all platforms.</p>
        </div>
        <div className={styles.grid}>
          {PLATFORMS.map((p) => (
            <div key={p.id} className={styles.card}>
              <div className={styles.platformColor} data-platform={p.id} />
              <div className={styles.cardBody}>
                <div className={styles.platformName}>{p.name}</div>
                {p.connected && <div className={styles.username}>{p.username}</div>}
              </div>
              <button
                type="button"
                className={p.connected ? styles.disconnectBtn : styles.connectBtn}
              >
                {p.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
