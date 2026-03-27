import type { Platform } from '@/types';

export const PLATFORMS: Platform[] = [
  {
    id: 'twitter',
    name: 'X (Twitter)',
    color: '#000000',
    provider: 'twitter',
    description: 'Post tweets and threads',
    maxChars: 280,
    supportsVideo: true,
    supportsImages: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0077b5',
    provider: 'linkedin',
    description: 'Publish to your profile or page',
    maxChars: 3000,
    supportsVideo: true,
    supportsImages: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#e4405f',
    provider: 'instagram',
    description: 'Post to Business or Creator accounts',
    supportsVideo: true,
    supportsImages: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877f2',
    provider: 'facebook',
    description: 'Publish to your Facebook Page',
    maxChars: 63206,
    supportsVideo: true,
    supportsImages: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#ff0000',
    provider: 'youtube',
    description: 'Upload videos to your channel',
    supportsVideo: true,
    supportsImages: false,
  },
  {
    id: 'google',
    name: 'Google',
    color: '#e37400',
    provider: 'google',
    description: 'Connect Google account for Analytics',
    supportsVideo: false,
    supportsImages: false,
  },
];

export const PLATFORM_MAP = Object.fromEntries(PLATFORMS.map((p) => [p.id, p])) as Record<string, Platform>;

export const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export const HASHTAG_SUGGESTIONS: Record<string, string[]> = {
  marketing: ['#Marketing', '#DigitalMarketing', '#ContentMarketing', '#SocialMedia', '#GrowthHacking'],
  tech: ['#Tech', '#AI', '#SaaS', '#Innovation', '#Startup', '#ProductLaunch'],
  business: ['#Business', '#Entrepreneur', '#Leadership', '#Strategy', '#B2B'],
  engagement: ['#Community', '#Engagement', '#Viral', '#Trending', '#MustRead'],
  general: ['#Motivation', '#Tips', '#HowTo', '#Tutorial', '#BehindTheScenes'],
};
