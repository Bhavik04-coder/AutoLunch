-- ============================================================
-- AutoLaunch — Supabase Schema
-- Paste this entire file into Supabase SQL Editor and run it.
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS (mirrors NextAuth session user)
-- ============================================================
create table if not exists public.users (
  id            uuid primary key default uuid_generate_v4(),
  email         text unique not null,
  name          text not null,
  avatar        text,
  role          text not null default 'user' check (role in ('admin', 'user', 'viewer')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
create table if not exists public.organizations (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text unique not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ORGANIZATION MEMBERS
-- ============================================================
create table if not exists public.organization_members (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id         uuid not null references public.users(id) on delete cascade,
  role            text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at      timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists public.subscriptions (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.users(id) on delete cascade,
  tier                text not null default 'free' check (tier in ('free', 'pro', 'business', 'enterprise', 'lifetime')),
  status              text not null default 'active' check (status in ('active', 'trialing', 'canceled', 'expired')),
  trial_ends_at       timestamptz,
  current_period_end  timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id)
);

-- ============================================================
-- CONNECTED ACCOUNTS (OAuth integrations per user)
-- ============================================================
create table if not exists public.connected_accounts (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  provider     text not null check (provider in ('twitter', 'linkedin', 'instagram', 'facebook', 'youtube', 'google')),
  provider_name text,
  access_token text,
  connected_at timestamptz not null default now(),
  unique (user_id, provider)
);

-- ============================================================
-- POSTS
-- ============================================================
create table if not exists public.posts (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.users(id) on delete cascade,
  content          text not null,
  platforms        text[] not null default '{}',
  status           text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at     timestamptz,
  timezone         text default 'UTC',
  media_urls       text[] default '{}',
  hashtags         text[] default '{}',
  linkedin_queued  boolean default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- MEDIA FILES
-- ============================================================
create table if not exists public.media_files (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  name       text not null,
  type       text not null check (type in ('image', 'video', 'document')),
  size_bytes bigint,
  url        text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ANALYTICS SNAPSHOTS (per post, per platform)
-- ============================================================
create table if not exists public.analytics_snapshots (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  post_id      uuid references public.posts(id) on delete set null,
  platform     text not null,
  impressions  integer default 0,
  engagements  integer default 0,
  followers    integer default 0,
  recorded_at  timestamptz not null default now()
);

-- ============================================================
-- UPDATED_AT TRIGGER (auto-update timestamps)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.users               enable row level security;
alter table public.organizations       enable row level security;
alter table public.organization_members enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.connected_accounts  enable row level security;
alter table public.posts               enable row level security;
alter table public.media_files         enable row level security;
alter table public.analytics_snapshots enable row level security;

-- Users: can only read/update their own row
create policy "users_select_own" on public.users
  for select using (id::text = auth.uid()::text);
create policy "users_update_own" on public.users
  for update using (id::text = auth.uid()::text);

-- Subscriptions: own only
create policy "subscriptions_own" on public.subscriptions
  for all using (user_id::text = auth.uid()::text);

-- Connected accounts: own only
create policy "connected_accounts_own" on public.connected_accounts
  for all using (user_id::text = auth.uid()::text);

-- Posts: own only
create policy "posts_own" on public.posts
  for all using (user_id::text = auth.uid()::text);

-- Media: own only
create policy "media_own" on public.media_files
  for all using (user_id::text = auth.uid()::text);

-- Analytics: own only
create policy "analytics_own" on public.analytics_snapshots
  for all using (user_id::text = auth.uid()::text);

-- Org members: members of the org can read
create policy "org_members_select" on public.organization_members
  for select using (
    user_id::text = auth.uid()::text
  );

-- Organizations: readable by members
create policy "organizations_select" on public.organizations
  for select using (
    id in (
      select organization_id from public.organization_members
      where user_id::text = auth.uid()::text
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists posts_user_id_idx        on public.posts(user_id);
create index if not exists posts_status_idx         on public.posts(status);
create index if not exists posts_scheduled_at_idx   on public.posts(scheduled_at);
create index if not exists media_user_id_idx        on public.media_files(user_id);
create index if not exists analytics_user_id_idx    on public.analytics_snapshots(user_id);
create index if not exists analytics_post_id_idx    on public.analytics_snapshots(post_id);
create index if not exists connected_user_id_idx    on public.connected_accounts(user_id);

-- ============================================================
-- AGENTS
-- ============================================================
create table if not exists public.agents (
  id             uuid primary key default uuid_generate_v4(),
  slug           text unique not null,
  name           text not null,
  role           text not null,
  image          text not null,
  status         text not null default 'active' check (status in ('active', 'idle')),
  prompt         text not null,
  sort_order     integer default 0
);

-- Seed default agents (run once)
insert into public.agents (slug, name, role, image, status, prompt, sort_order) values
  ('echo',  'Echo',  'Content Writer',       '/agents_imgs/agent1.png', 'active', 'You are a social media content writer. Help the user create engaging, platform-optimized posts. Keep responses concise and actionable.', 1),
  ('spark', 'Spark', 'Marketing Agent',      '/agents_imgs/agent2.png', 'active', 'You are a hashtag strategy expert. Suggest relevant, trending hashtags for the user''s content. Group them by reach (broad, niche, branded). Keep it concise.', 2),
  ('fixr',  'Fixr',  'Analytics Agent',      '/agents_imgs/agent3.png', 'active', 'You are a social media engagement analyst. Help the user understand what content patterns drive the most engagement. Give specific, data-driven advice.', 3),
  ('closi', 'Closi', 'Trend Spotter',        '/agents_imgs/agent4.png', 'active', 'You are a trend analysis expert. Help the user identify trending topics and viral content opportunities in their niche. Be specific and timely.', 4),
  ('nabr',  'Nabr',  'Visual Prompt Builder','/agents_imgs/agent5.png', 'active', 'visual-prompt-builder', 5),
  ('ledgr', 'Ledgr', 'Scheduler Agent',      '/agents_imgs/agent2.png', 'idle',   'You are a content scheduling expert. Help users plan and optimize their posting schedule for maximum engagement. Consider time zones, platform algorithms, and audience behavior.', 6)
on conflict (slug) do nothing;

-- ============================================================
-- AGENT STATS (per user, per agent — tasks, tickets, etc.)
-- ============================================================
create table if not exists public.agent_stats (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.users(id) on delete cascade,
  agent_slug        text not null,
  tasks_this_week   integer default 0,
  open_tickets      integer default 0,
  success_rate      integer default 90,
  last_activity     text default '',
  updated_at        timestamptz not null default now(),
  unique (user_id, agent_slug)
);

-- ============================================================
-- PLUGS (per user toggle state)
-- ============================================================
create table if not exists public.plugs (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  description text not null,
  icon        text not null,
  docs        text not null default '#',
  sort_order  integer default 0
);

insert into public.plugs (slug, name, description, icon, docs, sort_order) values
  ('rss',        'RSS Feed',   'Auto-post content from any RSS or Atom feed directly to your social channels.', '📡', '#', 1),
  ('zapier',     'Zapier',     'Connect AutoLaunch with 5,000+ apps and automate your entire content workflow.', '⚡', '#', 2),
  ('make',       'Make.com',   'Build powerful multi-step automations with Make''s visual workflow builder.',    '🔧', '#', 3),
  ('webhook',    'Webhook',    'Receive real-time data from any external source and trigger posts automatically.','🔗', '#', 4),
  ('n8n',        'N8N',        'Open-source workflow automation — self-host and own your integrations.',         '🔄', '#', 5),
  ('public-api', 'Public API', 'Integrate AutoLaunch directly into your own apps with our REST API.',           '🛠️', '#', 6)
on conflict (slug) do nothing;

create table if not exists public.user_plugs (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid not null references public.users(id) on delete cascade,
  plug_slug text not null,
  enabled   boolean not null default false,
  unique (user_id, plug_slug)
);

-- ============================================================
-- BRAND DNA (per user)
-- ============================================================
create table if not exists public.brand_dna (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid unique not null references public.users(id) on delete cascade,
  name        text default '',
  url         text default '',
  tagline     text default '',
  colors      text[] default '{}',
  values      text[] default '{}',
  aesthetic   text[] default '{}',
  tone        text[] default '{}',
  font        text default 'Inter',
  images      text[] default '{}',
  updated_at  timestamptz not null default now()
);

create trigger brand_dna_updated_at
  before update on public.brand_dna
  for each row execute function public.set_updated_at();

-- ============================================================
-- INVOICES (billing history)
-- ============================================================
create table if not exists public.invoices (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  description text not null,
  status      text not null default 'paid' check (status in ('paid', 'pending', 'failed')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- RLS for new tables
-- ============================================================
alter table public.agents      enable row level security;
alter table public.agent_stats enable row level security;
alter table public.plugs        enable row level security;
alter table public.user_plugs   enable row level security;
alter table public.brand_dna    enable row level security;
alter table public.invoices     enable row level security;

-- Agents: public read (no auth needed)
create policy "agents_public_read" on public.agents for select using (true);

-- Agent stats: own only
create policy "agent_stats_own" on public.agent_stats
  for all using (user_id::text = auth.uid()::text);

-- Plugs: public read
create policy "plugs_public_read" on public.plugs for select using (true);

-- User plugs: own only
create policy "user_plugs_own" on public.user_plugs
  for all using (user_id::text = auth.uid()::text);

-- Brand DNA: own only
create policy "brand_dna_own" on public.brand_dna
  for all using (user_id::text = auth.uid()::text);

-- Invoices: own only
create policy "invoices_own" on public.invoices
  for all using (user_id::text = auth.uid()::text);
