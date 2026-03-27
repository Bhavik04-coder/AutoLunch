'use client';

import { useState } from 'react';
import styles from './NotificationBell.module.scss';

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Post published',       body: 'Your LinkedIn post went live.',          time: '2m ago',  read: false },
  { id: '2', title: 'Scheduled post ready', body: 'Twitter post scheduled for 3 PM.',       time: '15m ago', read: false },
  { id: '3', title: 'Analytics report',     body: 'Your weekly report is ready to view.',   time: '1h ago',  read: true  },
  { id: '4', title: 'New follower milestone', body: 'You reached 5,000 followers on X!',    time: '3h ago',  read: true  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.bell}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {unread > 0 && <span className={styles.badge}>{unread}</span>}
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.dropdown}>
            <div className={styles.header}>
              <span className={styles.headerTitle}>Notifications</span>
              {unread > 0 && (
                <button type="button" className={styles.markAll} onClick={markAllRead}>
                  Mark all read
                </button>
              )}
            </div>
            <div className={styles.list}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`${styles.item} ${!n.read ? styles.unread : ''}`}
                  onClick={() => markRead(n.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && markRead(n.id)}
                >
                  {!n.read && <span className={styles.dot} />}
                  <div className={styles.itemBody}>
                    <div className={styles.itemTitle}>{n.title}</div>
                    <div className={styles.itemText}>{n.body}</div>
                    <div className={styles.itemTime}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
