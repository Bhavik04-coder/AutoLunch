'use client';

import { useState } from 'react';
import styles from './HashtagSuggestions.module.scss';
import { HASHTAG_SUGGESTIONS } from '@/constants/platforms';

interface HashtagSuggestionsProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

const CATEGORIES = Object.keys(HASHTAG_SUGGESTIONS) as Array<keyof typeof HASHTAG_SUGGESTIONS>;

export default function HashtagSuggestions({ selected, onChange }: HashtagSuggestionsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('marketing');
  const [custom, setCustom] = useState('');

  const toggle = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);
  };

  const addCustom = () => {
    const tag = custom.trim().startsWith('#') ? custom.trim() : `#${custom.trim()}`;
    if (tag.length > 1 && !selected.includes(tag)) {
      onChange([...selected, tag]);
    }
    setCustom('');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>Hashtags</div>

      {selected.length > 0 && (
        <div className={styles.selected}>
          {selected.map((tag) => (
            <span key={tag} className={styles.selectedTag}>
              {tag}
              <button type="button" onClick={() => toggle(tag)} aria-label={`Remove ${tag}`}>✕</button>
            </span>
          ))}
        </div>
      )}

      <div className={styles.categories}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.catBtn} ${activeCategory === cat ? styles.catBtnActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.suggestions}>
        {HASHTAG_SUGGESTIONS[activeCategory as keyof typeof HASHTAG_SUGGESTIONS].map((tag) => (
          <button
            key={tag}
            type="button"
            className={`${styles.tag} ${selected.includes(tag) ? styles.tagActive : ''}`}
            onClick={() => toggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className={styles.customRow}>
        <input
          type="text"
          className={styles.customInput}
          placeholder="Add custom hashtag..."
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
        />
        <button type="button" className={styles.addBtn} onClick={addCustom} disabled={!custom.trim()}>
          Add
        </button>
      </div>
    </div>
  );
}
