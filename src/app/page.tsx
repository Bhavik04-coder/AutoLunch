'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './home.module.scss';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      id: 'launches',
      icon: '🚀',
      title: 'Launches',
      description: 'Schedule and manage your social media posts with our intuitive calendar',
      color: '#6366f1',
      path: '/launches'
    },
    {
      id: 'analytics',
      icon: '📊',
      title: 'Analytics',
      description: 'Track performance and get insights across all your social platforms',
      color: '#8b5cf6',
      path: '/analytics'
    },
    {
      id: 'media',
      icon: '🖼️',
      title: 'Media Library',
      description: 'Store and organize all your media files in one centralized place',
      color: '#ec4899',
      path: '/media'
    },
    {
      id: 'agents',
      icon: '🤖',
      title: 'AI Agents',
      description: 'Generate engaging content with AI-powered suggestions',
      color: '#f59e0b',
      path: '/agents'
    },
    {
      id: 'plugs',
      icon: '🔌',
      title: 'Plugins',
      description: 'Extend functionality with powerful plugins and integrations',
      color: '#10b981',
      path: '/plugs'
    },
    {
      id: 'third-party',
      icon: '🔗',
      title: 'Integrations',
      description: 'Connect with Twitter, Facebook, Instagram, LinkedIn and more',
      color: '#3b82f6',
      path: '/third-party'
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Settings',
      description: 'Manage your profile, team members, and account preferences',
      color: '#6b7280',
      path: '/settings'
    },
    {
      id: 'billing',
      icon: '💳',
      title: 'Billing',
      description: 'View plans, manage subscriptions, and billing information',
      color: '#ef4444',
      path: '/billing'
    }
  ];

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <Image src="/large.png" alt="AutoLaunch logo" width={36} height={36} className={styles.navLogoImg} priority />
          <span>AutoLaunch</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/auth/login" className={styles.navLink}>Sign in</Link>
          <Link href="/auth/login" className={styles.navCta}>Get started</Link>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.decorativeLeaf}>🌿</div>
          <div className={styles.decorativeStar1}>✨</div>
          <div className={styles.decorativeStar2}>✦</div>
          <div className={styles.decorativeCircles}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
          </div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.githubBadge}>
            <svg className={styles.githubIcon} viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span className={styles.starIcon}>⭐</span>
            <span className={styles.starCount}>273k</span>
          </div>

          <h1 className={styles.heroTitle}>
            Your agentic social
            <br />
            media scheduling tool
            <svg className={styles.underline} viewBox="0 0 300 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 15 Q 150 5, 295 15" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </h1>

          <p className={styles.heroSubtitle}>
            AutoLaunch offers everything you need to manage your social media posts, build
            <br />
            an audience, capture leads, and grow your business faster with AI
          </p>

          <div className={styles.socialIcons}>
            <div className={styles.socialIcon} data-social="instagram">📷</div>
            <div className={styles.socialIcon} data-social="youtube">▶️</div>
            <div className={styles.socialIcon} data-social="linkedin">in</div>
            <div className={styles.socialIcon} data-social="pinterest">📌</div>
            <div className={styles.socialIcon} data-social="twitter">🐦</div>
            <div className={styles.socialIcon} data-social="producthunt">📧</div>
            <div className={styles.socialIcon} data-social="x">𝕏</div>
            <div className={styles.socialIcon} data-social="facebook">f</div>
            <div className={styles.socialIcon} data-social="reddit">🤖</div>
            <div className={styles.socialIcon} data-social="bluesky">💬</div>
            <div className={styles.socialIcon} data-social="discord">🎮</div>
            <div className={styles.socialIcon} data-social="twitch">📺</div>
            <div className={styles.socialIcon} data-social="telegram">✈️</div>
            <div className={styles.socialIcon} data-social="whatsapp">💬</div>
            <div className={styles.socialIcon} data-social="tiktok">📱</div>
          </div>

          <button className={styles.ctaButton} onClick={() => router.push('/auth/login')}>
            Start a 7-day trial for $0
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      </section>

      {/* Features Section - Clickable Cards */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Explore Features</h2>
          <p className={styles.sectionSubtitle}>
            Click on any feature to get started
          </p>
        </div>
        
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <div
              key={feature.id}
              className={styles.featureCard}
              onClick={() => router.push(feature.path)}
            >
              <div className={styles.featureIconLarge}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <div className={styles.featureArrow}>→</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <h2 className={styles.testimonialsTitle}>Trusted by customers all over the world</h2>
        
        <div className={styles.testimonialsGrid}>
          <div className={`${styles.testimonialCard} ${styles.purple}`}>
            <div className={styles.statValue}>+10%</div>
            <div className={styles.statLabel}>Grew following</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>🎵</span>
              <span className={styles.userName}>Raymond Harrison</span>
            </div>
          </div>

          <div className={`${styles.testimonialCard} ${styles.blue}`}>
            <div className={styles.statValue}>x2</div>
            <div className={styles.statLabel}>Boost in engagement rate</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>🎬</span>
              <span className={styles.userName}>Lisa Anders</span>
            </div>
          </div>

          <div className={`${styles.testimonialCard} ${styles.blueLight}`}>
            <div className={styles.statValue}>x4</div>
            <div className={styles.statLabel}>Increase in traffic</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>📘</span>
              <span className={styles.userName}>Cindy Goodman</span>
            </div>
          </div>

          <div className={`${styles.testimonialCard} ${styles.purpleDeep}`}>
            <div className={styles.statValue}>+15%</div>
            <div className={styles.statLabel}>Followers</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>📸</span>
              <span className={styles.userName}>Larry Williams</span>
            </div>
          </div>

          <div className={`${styles.testimonialCard} ${styles.purpleBright}`}>
            <div className={styles.statValue}>+50%</div>
            <div className={styles.statLabel}>Increase in followers</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>💼</span>
              <span className={styles.userName}>Paula Wright</span>
            </div>
          </div>

          <div className={`${styles.testimonialCard} ${styles.purpleMid}`}>
            <div className={styles.statValue}>+10%</div>
            <div className={styles.statLabel}>Increase in impressions</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>🎵</span>
              <span className={styles.userName}>Joel Johnson</span>
            </div>
          </div>

          <div className={`${styles.testimonialCard} ${styles.purpleViolet}`}>
            <div className={styles.statValue}>+15%</div>
            <div className={styles.statLabel}>Increase in engagement</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>📸</span>
              <span className={styles.userName}>Jason Smith</span>
            </div>
          </div>

          <div className={`${styles.testimonialCard} ${styles.pink}`}>
            <div className={styles.statValue}>2x</div>
            <div className={styles.statLabel}>Boost in engagement rate</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>🎭</span>
              <span className={styles.userName}>Sherry Porter</span>
            </div>
          </div>

          <div className={`${styles.testimonialCard} ${styles.pinkBright}`}>
            <div className={styles.statValue}>3x</div>
            <div className={styles.statLabel}>Increase in traffic</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>📸</span>
              <span className={styles.userName}>Betty McGee</span>
            </div>
          </div>

          <div className={`${styles.testimonialCard} ${styles.blueAccent}`}>
            <div className={styles.statValue}>3k</div>
            <div className={styles.statLabel}>Saved per month</div>
            <div className={styles.userInfo}>
              <span className={styles.userIcon}>📘</span>
              <span className={styles.userName}>Jonathan Turner</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterCard}>
          <h2 className={styles.newsletterTitle}>Subscribe to the Newsletter</h2>
          <p className={styles.newsletterSubtitle}>For occasional updates, news and events</p>
          
          <div className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className={styles.emailInput}
            />
            <button className={styles.subscribeButton}>
              Subscribe
            </button>
            <svg className={styles.arrow} viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 25 Q 30 10, 50 25 T 90 25" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M85 20 L95 25 L85 30" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Product Hunt Badges */}
        <div className={styles.badgesContainer}>
          <div className={styles.badge}>
            <div className={styles.badgeIcon}>🏆</div>
            <div className={styles.badgeContent}>
              <div className={styles.badgeLabel}>PRODUCT HUNT</div>
              <div className={styles.badgeTitle}>#1 Product of the Month</div>
            </div>
          </div>
          
          <div className={styles.badge}>
            <div className={styles.badgeIcon}>🥇</div>
            <div className={styles.badgeContent}>
              <div className={styles.badgeLabel}>PRODUCT HUNT</div>
              <div className={styles.badgeTitle}>#1 Product of the Week</div>
            </div>
          </div>
          
          <div className={styles.badge}>
            <div className={styles.badgeIcon}>🥇</div>
            <div className={styles.badgeContent}>
              <div className={styles.badgeLabel}>PRODUCT HUNT</div>
              <div className={styles.badgeTitle}>#1 Product of the Day</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>AutoLaunch</h3>
            <p className={styles.footerText}>
              The all-in-one social media management platform for modern teams.
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Product</h4>
            <a href="#features">Features</a>
            <a href="/billing">Pricing</a>
            <a href="/third-party">Integrations</a>
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Company</h4>
            <a href="#about">About</a>
            <a href="#blog">Blog</a>
            <a href="#careers">Careers</a>
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Support</h4>
            <a href="#help">Help Center</a>
            <a href="#contact">Contact</a>
            <a href="#status">Status</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 AutoLaunch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
