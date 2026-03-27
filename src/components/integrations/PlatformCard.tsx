'use client';

import styles from './PlatformCard.module.scss';
import PlatformIcon from '@/components/ui/PlatformIcon';
import Loader from '@/components/ui/Loader';
import type { Platform, ConnectedAccount } from '@/types';

interface PlatformCardProps {
  platform: Platform;
  connection?: ConnectedAccount;
  isLoading?: boolean;
  onConnect: (provider: string) => void;
  onDisconnect: (provider: string) => void;
}

export default function PlatformCard({
  platform,
  connection,
  isLoading,
  onConnect,
  onDisconnect,
}: PlatformCardProps) {
  const isConnected = !!connection;

  return (
    <div className={`${styles.card} ${isConnected ? styles.connected : ''}`}>
      <div className={styles.top}>
        <PlatformIcon id={platform.id} color={platform.color} size={40} />
        <div className={styles.info}>
          <div className={styles.name}>{platform.name}</div>
          <div className={styles.desc}>
            {isConnected ? `Connected as ${connection!.name}` : platform.description}
          </div>
        </div>
        {isConnected && <span className={styles.badge}>✓ Connected</span>}
      </div>

      {platform.maxChars && (
        <div className={styles.meta}>
          <span className={styles.metaItem}>Max {platform.maxChars.toLocaleString()} chars</span>
          {platform.supportsImages && <span className={styles.metaItem}>📷 Images</span>}
          {platform.supportsVideo  && <span className={styles.metaItem}>🎬 Video</span>}
        </div>
      )}

      <div className={styles.actions}>
        {isConnected ? (
          <button
            type="button"
            className={styles.disconnectBtn}
            onClick={() => onDisconnect(platform.provider)}
            disabled={isLoading}
          >
            {isLoading ? <Loader size="sm" /> : 'Disconnect'}
          </button>
        ) : (
          <button
            type="button"
            className={styles.connectBtn}
            style={{ '--color': platform.color } as React.CSSProperties}
            onClick={() => onConnect(platform.provider)}
            disabled={isLoading}
          >
            {isLoading ? <Loader size="sm" /> : `Connect ${platform.name}`}
          </button>
        )}
      </div>
    </div>
  );
}
