'use client';

import { useState } from 'react';
import styles from './media.module.scss';

const MOCK_MEDIA = [
  { id: '1', name: 'product-launch.jpg', type: 'image', size: '2.4 MB', date: '2026-03-10' },
  { id: '2', name: 'team-photo.png', type: 'image', size: '1.8 MB', date: '2026-03-08' },
  { id: '3', name: 'promo-video.mp4', type: 'video', size: '24.5 MB', date: '2026-03-05' },
  { id: '4', name: 'banner-ad.jpg', type: 'image', size: '890 KB', date: '2026-03-01' },
  { id: '5', name: 'logo-white.svg', type: 'image', size: '12 KB', date: '2026-02-28' },
  { id: '6', name: 'tutorial.mp4', type: 'video', size: '48.2 MB', date: '2026-02-25' },
];

export function MediaComponent() {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = MOCK_MEDIA.filter((m) => filter === 'all' || m.type === filter);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {(['all', 'image', 'video'] as const).map((f) => (
            <button key={f} type="button" className={filter === f ? styles.active : ''} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <div className={styles.viewToggle}>
            <button type="button" aria-label="Grid view" className={view === 'grid' ? styles.active : ''} onClick={() => setView('grid')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button type="button" aria-label="List view" className={view === 'list' ? styles.active : ''} onClick={() => setView('list')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <button type="button" className={styles.uploadBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {view === 'grid' ? (
          <div className={styles.grid}>
            {filtered.map((item) => (
              <div key={item.id} className={styles.gridItem}>
                <div className={styles.thumbnail}>
                  {item.type === 'video' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14M5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M4 16L8.58579 11.4142C9.36683 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemMeta}>{item.size} · {item.date}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th>Name</th><th>Type</th><th>Size</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td><span className={styles.typeBadge} data-type={item.type}>{item.type}</span></td>
                  <td>{item.size}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
