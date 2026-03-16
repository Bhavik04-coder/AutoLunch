'use client';

import { useState } from 'react';
import styles from './analytics.module.scss';

const METRICS = [
  { label: 'Total Impressions', value: '124.5K', change: '+12.4%', up: true },
  { label: 'Engagements', value: '8,320', change: '+5.2%', up: true },
  { label: 'Followers Gained', value: '1,240', change: '+18.7%', up: true },
  { label: 'Posts Published', value: '48', change: '-2.1%', up: false },
];

const PLATFORMS = [
  { name: 'Twitter/X', followers: '12.4K', engagement: '3.2%', posts: 18, key: 'twitter' },
  { name: 'LinkedIn', followers: '8.1K', engagement: '5.8%', posts: 12, key: 'linkedin' },
  { name: 'Instagram', followers: '22.3K', engagement: '4.1%', posts: 10, key: 'instagram' },
  { name: 'Facebook', followers: '5.6K', engagement: '1.9%', posts: 8, key: 'facebook' },
];

// Static bar data — heights as CSS class names
const BARS = [
  { day: 'Mon', heightClass: styles.barH40 },
  { day: 'Tue', heightClass: styles.barH65 },
  { day: 'Wed', heightClass: styles.barH45 },
  { day: 'Thu', heightClass: styles.barH80 },
  { day: 'Fri', heightClass: styles.barH55 },
  { day: 'Sat', heightClass: styles.barH90 },
  { day: 'Sun', heightClass: styles.barH70 },
];

export function AnalyticsComponent() {
  const [range, setRange] = useState('7d');

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.rangeSelector}>
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              type="button"
              className={range === r ? styles.active : ''}
              onClick={() => setRange(r)}
            >
              {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {/* Metric cards */}
        <div className={styles.metrics}>
          {METRICS.map((m) => (
            <div key={m.label} className={styles.metricCard}>
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricValue}>{m.value}</div>
              <div className={`${styles.metricChange} ${m.up ? styles.up : styles.down}`}>
                {m.up ? '↑' : '↓'} {m.change}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Impressions Over Time</h3>
          </div>
          <div className={styles.chartArea}>
            <div className={styles.chartBars}>
              {BARS.map(({ day, heightClass }) => (
                <div key={day} className={styles.barWrapper}>
                  <div className={`${styles.bar} ${heightClass}`} />
                  <div className={styles.barLabel}>{day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform breakdown */}
        <div className={styles.platformsCard}>
          <h3 className={styles.sectionTitle}>Platform Breakdown</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Followers</th>
                <th>Engagement</th>
                <th>Posts</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORMS.map((p) => (
                <tr key={p.name}>
                  <td>
                    <div className={styles.platformName}>
                      <div className={`${styles.platformDot} ${styles[`dot_${p.key}`]}`} />
                      {p.name}
                    </div>
                  </td>
                  <td>{p.followers}</td>
                  <td>{p.engagement}</td>
                  <td>{p.posts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
