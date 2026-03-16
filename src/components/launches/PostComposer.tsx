'use client';

import { useState } from 'react';
import styles from './PostComposer.module.scss';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

interface PostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: PostData) => void;
}

interface PostData {
  content: string;
  platforms: string[];
  scheduledDate?: Date;
  media: File[];
}

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: '#000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: '#0077b5' },
  { id: 'facebook', name: 'Facebook', icon: 'f', color: '#1877f2' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: '#e4405f' },
  { id: 'tiktok', name: 'TikTok', icon: '♪', color: '#000' },
  { id: 'youtube', name: 'YouTube', icon: '▶', color: '#ff0000' },
];

export default function PostComposer({ isOpen, onClose, onSubmit }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [media, setMedia] = useState<File[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>('');

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        content,
        platforms: selectedPlatforms,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        media,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setContent('');
    setSelectedPlatforms([]);
    setMedia([]);
    setScheduledDate('');
    onClose();
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(Array.from(e.target.files));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Post">
      <div className={styles.composer}>
        {/* Platform Selection */}
        <div className={styles.section}>
          <label className={styles.label}>Select Platforms</label>
          <div className={styles.platforms}>
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                className={`${styles.platformBtn} ${
                  selectedPlatforms.includes(platform.id) ? styles.active : ''
                }`}
                onClick={() => togglePlatform(platform.id)}
                style={{
                  borderColor: selectedPlatforms.includes(platform.id)
                    ? platform.color
                    : undefined,
                }}
              >
                <span className={styles.platformIcon}>{platform.icon}</span>
                <span className={styles.platformName}>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div className={styles.section}>
          <label className={styles.label}>Post Content</label>
          <textarea
            className={styles.textarea}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
          <div className={styles.charCount}>
            {content.length} / 280 characters
          </div>
        </div>

        {/* Media Upload */}
        <div className={styles.section}>
          <label className={styles.label}>Media</label>
          <div className={styles.mediaUpload}>
            <input
              type="file"
              id="media-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className={styles.fileInput}
            />
            <label htmlFor="media-upload" className={styles.uploadBtn}>
              <span>📎</span>
              <span>Add Photos or Videos</span>
            </label>
            {media.length > 0 && (
              <div className={styles.mediaPreview}>
                {media.map((file, index) => (
                  <div key={index} className={styles.mediaItem}>
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className={styles.section}>
          <label className={styles.label}>Schedule (Optional)</label>
          <input
            type="datetime-local"
            className={styles.dateInput}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="ai"
            onClick={() => {
              setContent(content + '\n\n✨ AI-generated content here...');
            }}
          >
            ✨ AI Enhance
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!content || selectedPlatforms.length === 0}
          >
            {scheduledDate ? 'Schedule Post' : 'Post Now'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
