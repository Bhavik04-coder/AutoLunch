'use client';

import { useState } from 'react';
import styles from './new.post.modal.module.scss';

const PLATFORMS = [
  { id: 'twitter', name: 'X (Twitter)' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'bluesky', name: 'Bluesky' },
  { id: 'mastodon', name: 'Mastodon' },
];

export function NewPostModal({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');

  const toggle = (id: string) =>
    setPlatforms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Post</h2>
          <button type="button" aria-label="Close modal" className={styles.closeBtn} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <label className={styles.label}>Platforms</label>
            <div className={styles.platforms}>
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-platform={p.id}
                  data-selected={platforms.includes(p.id) ? 'true' : undefined}
                  className={`${styles.platformBtn} ${platforms.includes(p.id) ? styles.selected : ''}`}
                  onClick={() => toggle(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label htmlFor="post-content" className={styles.label}>Content</label>
            <textarea
              id="post-content"
              className={styles.textarea}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
            <div className={styles.charCount}>{content.length} / 280</div>
          </div>

          <div className={styles.section}>
            <label htmlFor="post-schedule" className={styles.label}>Schedule (optional)</label>
            <input
              id="post-schedule"
              type="datetime-local"
              className={styles.dateInput}
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="button" className={styles.aiBtn}>✨ AI Enhance</button>
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!content || platforms.length === 0}
          >
            {scheduleDate ? 'Schedule Post' : 'Post Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
