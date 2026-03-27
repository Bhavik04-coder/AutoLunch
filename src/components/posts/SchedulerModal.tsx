'use client';

import { useState } from 'react';
import styles from './SchedulerModal.module.scss';
import Modal from '@/components/ui/Modal';
import PlatformSelector from './PlatformSelector';
import SchedulePicker from './SchedulePicker';
import HashtagSuggestions from './HashtagSuggestions';
import PostPreview from './PostPreview';
import MediaUploader from '@/components/media/MediaUploader';
import Loader from '@/components/ui/Loader';
import type { PlatformId, CreatePostPayload } from '@/types';

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePostPayload) => Promise<void>;
  initialContent?: string;
  authorName?: string;
}

export default function SchedulerModal({
  isOpen,
  onClose,
  onSubmit,
  initialContent = '',
  authorName,
}: SchedulerModalProps) {
  const [content,   setContent]   = useState(initialContent);
  const [platforms, setPlatforms] = useState<PlatformId[]>([]);
  const [hashtags,  setHashtags]  = useState<string[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [date,      setDate]      = useState('');
  const [time,      setTime]      = useState('');
  const [timezone,  setTimezone]  = useState('UTC');
  const [tab,       setTab]       = useState<'compose' | 'preview'>('compose');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) { setError('Post content is required.'); return; }
    if (!platforms.length) { setError('Select at least one platform.'); return; }
    setError('');
    setLoading(true);
    try {
      const scheduledAt = date && time ? `${date}T${time}:00` : undefined;
      await onSubmit({ content, platforms, hashtags, mediaUrls, scheduledAt, timezone });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Post" size="lg">
      <div className={styles.wrap}>
        {/* Tab switcher */}
        <div className={styles.tabs}>
          <button type="button" className={`${styles.tab} ${tab === 'compose' ? styles.tabActive : ''}`} onClick={() => setTab('compose')}>✏️ Compose</button>
          <button type="button" className={`${styles.tab} ${tab === 'preview' ? styles.tabActive : ''}`} onClick={() => setTab('preview')}>👁 Preview</button>
        </div>

        {tab === 'compose' ? (
          <div className={styles.compose}>
            {/* Content */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="sm-content">Content</label>
              <textarea
                id="sm-content"
                className={styles.textarea}
                rows={5}
                placeholder="What do you want to share?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <PlatformSelector selected={platforms} onChange={setPlatforms} />
            <SchedulePicker
              date={date} time={time} timezone={timezone}
              onDateChange={setDate} onTimeChange={setTime} onTimezoneChange={setTimezone}
            />
            <HashtagSuggestions selected={hashtags} onChange={setHashtags} />

            <div className={styles.field}>
              <div className={styles.label}>Media</div>
              <MediaUploader onFilesChange={setMediaUrls} />
            </div>
          </div>
        ) : (
          <div className={styles.preview}>
            <PostPreview
              content={content}
              platforms={platforms}
              hashtags={hashtags}
              mediaUrls={mediaUrls}
              authorName={authorName}
            />
          </div>
        )}

        {error && <div className={styles.error}>⚠ {error}</div>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader size="sm" /> : (date && time ? '📅 Schedule Post' : '🚀 Publish Now')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
