import { supabaseAdmin } from '@/lib/supabase';
import type { User, Organization, Subscription } from '@/types';

export async function upsertUser(user: {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
}): Promise<User> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('users')
    .upsert(
      { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
      { onConflict: 'email' }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatar: data.avatar ?? undefined,
    role: data.role,
    createdAt: data.created_at,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatar: data.avatar ?? undefined,
    role: data.role,
    createdAt: data.created_at,
  };
}

export async function getUserOrganization(userId: string): Promise<Organization | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('organization_members')
    .select('role, organizations(id, name, slug)')
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (error || !data) return null;
  const org = data.organizations as any;
  return { id: org.id, name: org.name, slug: org.slug, role: data.role };
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return {
    tier: data.tier,
    status: data.status,
    trialEndsAt: data.trial_ends_at ?? undefined,
    currentPeriodEnd: data.current_period_end ?? undefined,
  };
}

export async function ensureDefaultSubscription(userId: string): Promise<void> {
  const db = supabaseAdmin();
  await db
    .from('subscriptions')
    .upsert({ user_id: userId, tier: 'free', status: 'active' }, { onConflict: 'user_id' });
}
