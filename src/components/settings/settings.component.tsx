'use client';
import { useState } from 'react';
import styles from './settings.module.scss';

const TABS = ['Profile', 'Notifications', 'Team', 'API Keys', 'Danger Zone'];

export function SettingsComponent() {
  const [tab, setTab] = useState('Profile');
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [timezone, setTimezone] = useState('UTC');

  return (
    <div className={styles.page}>
      <div className={styles.sidebar}>
        {TABS.map((t) => (
          <button key={t} type="button" className={`${styles.tabBtn} ${tab === t ? styles.active : ''} ${t === 'Danger Zone' ? styles.danger : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'Profile' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Profile Settings</h3>
            <div className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="profile-name" className={styles.label}>Full Name</label>
                <input id="profile-name" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="profile-email" className={styles.label}>Email Address</label>
                <input id="profile-email" className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="profile-timezone" className={styles.label}>Timezone</label>
                <select id="profile-timezone" className={styles.select} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
              <button type="button" className={styles.saveBtn}>Save Changes</button>
            </div>
          </div>
        )}

        {tab === 'Notifications' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Notification Preferences</h3>
            <div className={styles.toggleList}>
              {['Post published', 'Post failed', 'Weekly digest', 'New team member', 'Billing alerts'].map((item) => (
                <div key={item} className={styles.toggleItem}>
                  <span className={styles.toggleLabel}>{item}</span>
                  <div className={styles.toggle} />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Team' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Team Members</h3>
            <div className={styles.teamList}>
              {[{ name: 'John Doe', email: 'john@example.com', role: 'Admin' }, { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' }].map((m) => (
                <div key={m.email} className={styles.teamMember}>
                  <div className={styles.avatar}>{m.name.charAt(0)}</div>
                  <div className={styles.memberInfo}>
                    <div className={styles.memberName}>{m.name}</div>
                    <div className={styles.memberEmail}>{m.email}</div>
                  </div>
                  <span className={styles.roleBadge}>{m.role}</span>
                </div>
              ))}
            </div>
            <button type="button" className={styles.inviteBtn}>+ Invite Member</button>
          </div>
        )}

        {tab === 'API Keys' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>API Keys</h3>
            <div className={styles.apiKey}>
              <div className={styles.keyLabel}>Production Key</div>
              <div className={styles.keyValue}>al_prod_••••••••••••••••••••••••</div>
              <button type="button" className={styles.copyBtn}>Copy</button>
            </div>
            <button type="button" className={styles.generateBtn}>Generate New Key</button>
          </div>
        )}

        {tab === 'Danger Zone' && (
          <div className={styles.section}>
            <h3 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>Danger Zone</h3>
            <div className={styles.dangerCard}>
              <div>
                <div className={styles.dangerLabel}>Delete Account</div>
                <div className={styles.dangerDesc}>Permanently delete your account and all data. This cannot be undone.</div>
              </div>
              <button type="button" className={styles.deleteBtn}>Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
