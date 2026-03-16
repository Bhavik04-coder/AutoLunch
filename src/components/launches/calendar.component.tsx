'use client';

import { useState } from 'react';
import styles from './Calendar.module.scss';

interface Post {
  id: string;
  content: string;
  scheduledAt: string;
  platforms: string[];
  status: 'scheduled' | 'published' | 'failed';
}

const MOCK_POSTS: Post[] = [
  { id: '1', content: 'Product launch announcement 🚀', scheduledAt: '2026-03-15T10:00:00', platforms: ['twitter'], status: 'published' },
  { id: '2', content: 'Behind the scenes video', scheduledAt: '2026-03-18T14:00:00', platforms: ['instagram'], status: 'scheduled' },
  { id: '3', content: 'Weekly tips thread', scheduledAt: '2026-03-20T09:00:00', platforms: ['twitter', 'linkedin'], status: 'scheduled' },
  { id: '4', content: 'Customer success story', scheduledAt: '2026-03-25T11:00:00', platforms: ['linkedin'], status: 'scheduled' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#1d9bf0',
  linkedin: '#0077b5',
  instagram: '#e4405f',
  facebook: '#1877f2',
  tiktok: '#000',
  youtube: '#ff0000',
};

export function CalendarComponent() {
  const [current, setCurrent] = useState(new Date(2026, 2, 1));

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return MOCK_POSTS.filter((p) => p.scheduledAt.startsWith(dateStr));
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button type="button" aria-label="Previous month" className={styles.navBtn} onClick={() => setCurrent(new Date(year, month - 1))}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className={styles.monthTitle}>{MONTHS[month]} {year}</h2>
        <button type="button" aria-label="Next month" className={styles.navBtn} onClick={() => setCurrent(new Date(year, month + 1))}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.grid}>
        {DAYS.map((d) => (
          <div key={d} className={styles.dayName}>{d}</div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e-${i}`} className={styles.emptyCell} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const posts = getPostsForDay(day);
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

          return (
            <div key={day} className={`${styles.cell} ${isToday ? styles.today : ''}`}>
              <div className={styles.dayNum}>{day}</div>
              <div className={styles.posts}>
                {posts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    className={styles.postChip}
                    data-status={post.status}
                    title={post.content}
                  >
                    {post.content.substring(0, 20)}
                  </div>
                ))}
                {posts.length > 3 && (
                  <div className={styles.more}>+{posts.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
