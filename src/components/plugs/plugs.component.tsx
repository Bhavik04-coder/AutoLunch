'use client';
import styles from './plugs.module.scss';

const PLUGS = [
  { id: '1', name: 'RSS Feed', description: 'Auto-post from any RSS feed', icon: '📡', connected: true },
  { id: '2', name: 'Zapier', description: 'Connect with 5000+ apps via Zapier', icon: '⚡', connected: false },
  { id: '3', name: 'Make.com', description: 'Automate workflows with Make', icon: '🔧', connected: false },
  { id: '4', name: 'Webhook', description: 'Receive data from any source', icon: '🔗', connected: true },
  { id: '5', name: 'N8N', description: 'Open-source workflow automation', icon: '🔄', connected: false },
  { id: '6', name: 'API', description: 'Direct API integration', icon: '🛠️', connected: false },
];

export function PlugsComponent() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.grid}>
          {PLUGS.map((plug) => (
            <div key={plug.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}>{plug.icon}</div>
                <div className={`${styles.badge} ${plug.connected ? styles.connected : ''}`}>
                  {plug.connected ? 'Connected' : 'Not connected'}
                </div>
              </div>
              <div className={styles.name}>{plug.name}</div>
              <div className={styles.desc}>{plug.description}</div>
              <button type="button" className={plug.connected ? styles.disconnectBtn : styles.connectBtn}>
                {plug.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
