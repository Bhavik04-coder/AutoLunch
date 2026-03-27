'use client';

import styles from './PlatformSelector.module.scss';
import PlatformIcon from '@/components/ui/PlatformIcon';
import { PLATFORMS } from '@/constants/platforms';
import type { PlatformId } from '@/types';
import clsx from 'clsx';

interface PlatformSelectorProps {
  selected: PlatformId[];
  onChange: (platforms: PlatformId[]) => void;
  connectedOnly?: boolean;
  connectedProviders?: string[];
}

export default function PlatformSelector({
  selected,
  onChange,
  connectedOnly = false,
  connectedProviders = [],
}: PlatformSelectorProps) {
  const available = connectedOnly
    ? PLATFORMS.filter((p) => connectedProviders.includes(p.provider))
    : PLATFORMS;

  const toggle = (id: PlatformId) => {
    onChange(
      selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id],
    );
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>Platforms</div>
      <div className={styles.list}>
        {available.map((p) => {
          const active = selected.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.chip, active && styles.chipActive)}
              style={{ '--color': p.color } as React.CSSProperties}
              onClick={() => toggle(p.id)}
              data-active={active}
              title={p.name}
            >
              <PlatformIcon id={p.id} color={active ? p.color : 'currentColor'} size={18} />
              <span>{p.name}</span>
            </button>
          );
        })}
        {available.length === 0 && (
          <span className={styles.empty}>No connected accounts — connect platforms first.</span>
        )}
      </div>
    </div>
  );
}
