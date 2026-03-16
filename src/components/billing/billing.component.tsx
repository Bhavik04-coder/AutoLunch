'use client';
import { useState } from 'react';
import styles from './billing.module.scss';

const PLANS = [
  { id: 'free', name: 'Free', price: 0, features: ['3 social accounts', '10 posts/month', 'Basic analytics', 'Community support'] },
  { id: 'pro', name: 'Pro', price: 29, features: ['10 social accounts', 'Unlimited posts', 'Advanced analytics', 'AI content generation', 'Priority support'], popular: true },
  { id: 'business', name: 'Business', price: 79, features: ['Unlimited accounts', 'Unlimited posts', 'Full analytics suite', 'AI + automation', 'Team collaboration', 'Dedicated support'] },
];

export function BillingComponent() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [current] = useState('free');

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Choose Your Plan</h2>
          <p className={styles.subtitle}>Upgrade to unlock more features and grow your social presence</p>
          <div className={styles.billingToggle}>
            <button type="button" className={billing === 'monthly' ? styles.active : ''} onClick={() => setBilling('monthly')}>Monthly</button>
            <button type="button" className={billing === 'yearly' ? styles.active : ''} onClick={() => setBilling('yearly')}>
              Yearly <span className={styles.discount}>-20%</span>
            </button>
          </div>
        </div>

        <div className={styles.plans}>
          {PLANS.map((plan) => (
            <div key={plan.id} className={`${styles.planCard} ${plan.popular ? styles.popular : ''} ${current === plan.id ? styles.current : ''}`}>
              {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{billing === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price}</span>
                <span className={styles.period}>/mo</span>
              </div>
              <ul className={styles.features}>
                {plan.features.map((f) => (
                  <li key={f} className={styles.feature}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={current === plan.id ? styles.currentBtn : styles.upgradeBtn}
                disabled={current === plan.id}
              >
                {current === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
