'use client';

import { useRef, useState } from 'react';
import styles from './MediaUploader.module.scss';
import clsx from 'clsx';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: string;
}

interface MediaUploaderProps {
  onFilesChange?: (urls: string[]) => void;
  maxFiles?: number;
  accept?: string;
}

export default function MediaUploader({
  onFilesChange,
  maxFiles = 4,
  accept = 'image/*,video/*',
}: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const remaining = maxFiles - files.length;
    const toAdd = Array.from(list).slice(0, remaining).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type.startsWith('video') ? 'video' as const : 'image' as const,
      size: f.size > 1_000_000
        ? `${(f.size / 1_000_000).toFixed(1)} MB`
        : `${Math.round(f.size / 1000)} KB`,
    }));
    const next = [...files, ...toAdd];
    setFiles(next);
    onFilesChange?.(next.map((f) => f.url));
  };

  const remove = (id: string) => {
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    onFilesChange?.(next.map((f) => f.url));
  };

  return (
    <div className={styles.wrap}>
      {/* Drop zone */}
      {files.length < maxFiles && (
        <div
          className={clsx(styles.dropZone, dragging && styles.dragging)}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Upload media files"
        >
          <span className={styles.dropIcon}>☁️</span>
          <span className={styles.dropText}>
            {dragging ? 'Drop files here' : 'Drag & drop or click to upload'}
          </span>
          <span className={styles.dropHint}>
            Images & videos · Max {maxFiles} files
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className={styles.hidden}
        aria-label="File upload input"
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* Preview grid */}
      {files.length > 0 && (
        <div className={styles.grid}>
          {files.map((f) => (
            <div key={f.id} className={styles.thumb}>
              {f.type === 'image'
                ? <img src={f.url} alt={f.name} className={styles.img} />
                : (
                  <div className={styles.videoThumb}>
                    <span className={styles.videoIcon}>🎬</span>
                    <span className={styles.videoName}>{f.name}</span>
                  </div>
                )
              }
              <div className={styles.thumbMeta}>
                <span className={styles.thumbName}>{f.name}</span>
                <span className={styles.thumbSize}>{f.size}</span>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => remove(f.id)}
                aria-label={`Remove ${f.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
