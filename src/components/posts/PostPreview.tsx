'use client';

import { useState } from 'react';
import styles from './PostPreview.module.scss';
import PlatformIcon from '@/components/ui/PlatformIcon';
import { PLATFORMS, PLATFORM_MAP } from '@/constants/platforms';
import type { PlatformId } from '@/types';
import clsx from 'clsx';

interface PostPreviewProps {
  content: string;
  platforms: PlatformId[];
  hashtags?: string[];
  mediaUrls?: string[];
  authorName?: string;
  authorAvatar?: string;
}

export default function PostPreview({
  content,
  platforms,
  hashtags = [],
  mediaUrls = [],
  authorName = 'Your Name',
  authorAvatar,
}: PostPreviewProps) {
  const [activePlatform, setActivePlatform] = useState<PlatformId>(platforms[0] ?? 'twitter');
  const platform = PLATFORM_MAP[activePlatform];
  const fullText = [content, ...hashtags].filter(Boolean).join('\n\n');
  const isOverLimit = platform?.maxChars ? fullText.length > platform.maxChars : false;

  if (!platforms.length) {
    return (
      <div className={styles.empty}>
        Select at least one platform to preview your post.
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        {platforms.map((pid) => {
          const p = PLATFORM_MAP[pid];
          if (!p) return null;
          return (
            <button
              key={pid}
              type="button"
              className={clsx(styles.tab, activePlatform === pid && styles.tabActive)}
              onClick={() => setActivePlatform(pid)}
            >
              <PlatformIcon id={pid} color={p.color} size={16} />
              {p.name}
            </button>
          );
        })}
      </div>

      <div className={styles.card} style={{ '--accent': platform?.color ?? '#6366f1' } as React.CSSProperties}>
        {/* Author row */}
        <div className={styles.author}>
          <div className={styles.avatar}>
            {authorAvatar
              ? <img src={authorAvatar} alt={authorName} />
              : <span>{authorName.charAt(0).toUpperCase()}</span>
            }
          </div>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>{authorName}</div>
            <div className={styles.authorHandle}>@{authorName.toLowerCase().replace(/\s+/g, '')}</div>
          </div>
          <PlatformIcon id={activePlatform} color={platform?.color ?? '#6366f1'} size={22} />
        </div>

        {/* Content */}
        <pre className={styles.content}>{fullText || <span className={styles.placeholder}>Your post content will appear here...</span>}</pre>

        {/* Media preview */}
        {mediaUrls.length > 0 && (
          <div className={styles.media}>
            {mediaUrls.slice(0, 4).map((url, i) => (
              <img key={i} src={url} alt={`Media ${i + 1}`} className={styles.mediaImg} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <span className={clsx(styles.charCount, isOverLimit && styles.charOver)}>
            {fullText.length}{platform?.maxChars ? ` / ${platform.maxChars}` : ''} chars
          </span>
          {isOverLimit && (
            <span className={styles.overWarning}>⚠ Exceeds {platform.name} limit</span>
          )}
        </div>
      </div>
    </div>
  );
}
