'use client';

import styles from './SchedulePicker.module.scss';
import { TIMEZONES } from '@/constants/platforms';

interface SchedulePickerProps {
  date: string;
  time: string;
  timezone: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  onTimezoneChange: (v: string) => void;
}

export default function SchedulePicker({
  date,
  time,
  timezone,
  onDateChange,
  onTimeChange,
  onTimezoneChange,
}: SchedulePickerProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>Schedule</div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="sp-date">Date</label>
          <input
            id="sp-date"
            type="date"
            className={styles.input}
            value={date}
            min={today}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="sp-time">Time</label>
          <input
            id="sp-time"
            type="time"
            className={styles.input}
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="sp-tz">Timezone</label>
          <select
            id="sp-tz"
            className={styles.select}
            value={timezone}
            onChange={(e) => onTimezoneChange(e.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
