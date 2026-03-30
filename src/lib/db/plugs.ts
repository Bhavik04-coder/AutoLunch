import { supabaseAdmin } from '@/lib/supabase';

export interface PlugRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  docs: string;
  connected: boolean;
}

export async function listPlugs(userId: string): Promise<PlugRow[]> {
  const db = supabaseAdmin();
  const [{ data: plugs }, { data: userPlugs }] = await Promise.all([
    db.from('plugs').select('*').order('sort_order'),
    db.from('user_plugs').select('*').eq('user_id', userId),
  ]);

  const enabledMap = Object.fromEntries((userPlugs ?? []).map((p: any) => [p.plug_slug, p.enabled]));

  return (plugs ?? []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    icon: p.icon,
    docs: p.docs,
    connected: enabledMap[p.slug] ?? false,
  }));
}

export async function togglePlug(userId: string, slug: string, enabled: boolean): Promise<void> {
  const db = supabaseAdmin();
  await db.from('user_plugs').upsert(
    { user_id: userId, plug_slug: slug, enabled },
    { onConflict: 'user_id,plug_slug' }
  );
}
