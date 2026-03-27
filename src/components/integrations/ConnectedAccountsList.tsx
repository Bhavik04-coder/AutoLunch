'use client';

import styles from './ConnectedAccountsList.module.scss';
import PlatformCard from './PlatformCard';
import EmptyState from '@/components/ui/EmptyState';
import { PLATFORMS } from '@/constants/platforms';
import { useIntegrations } from '@/hooks/useIntegrations';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';

export default function ConnectedAccountsList() {
  const { connected, loading, connect, disconnect } = useIntegrations();
  const { toasts, toast, removeToast } = useToast();

  const handleDisconnect = (provider: string) => {
    const name = PLATFORMS.find((p) => p.provider === provider)?.name ?? provider;
    disconnect(provider);
    toast.success(`${name} disconnected`);
  };

  const connectedCount = Object.keys(connected).length;

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Connected Accounts</h3>
            <p className={styles.desc}>
              Authorize platforms so AutoLaunch can publish posts on your behalf.
            </p>
          </div>
          {connectedCount > 0 && (
            <span className={styles.count}>{connectedCount} connected</span>
          )}
        </div>

        {PLATFORMS.length === 0 ? (
          <EmptyState
            icon="🔌"
            title="No platforms available"
            description="Check back later for supported platforms."
          />
        ) : (
          <div className={styles.grid}>
            {PLATFORMS.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                connection={connected[platform.provider]}
                isLoading={loading === platform.provider}
                onConnect={connect}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
