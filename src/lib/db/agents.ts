import { supabaseAdmin } from '@/lib/supabase';

export interface AgentRow {
  id: string;
  slug: string;
  name: string;
  role: string;
  image: string;
  status: 'active' | 'idle';
  prompt: string;
  tasksThisWeek: number;
  openTickets: number;
  successRate: number;
  lastActivity: string;
}

export async function listAgents(userId: string): Promise<AgentRow[]> {
  const db = supabaseAdmin();
  const [{ data: agents }, { data: stats }] = await Promise.all([
    db.from('agents').select('*').order('sort_order'),
    db.from('agent_stats').select('*').eq('user_id', userId),
  ]);

  const statsMap = Object.fromEntries((stats ?? []).map((s: any) => [s.agent_slug, s]));

  return (agents ?? []).map((a: any) => {
    const s = statsMap[a.slug] ?? {};
    return {
      id: a.id,
      slug: a.slug,
      name: a.name,
      role: a.role,
      image: a.image,
      status: a.status,
      prompt: a.prompt,
      tasksThisWeek: s.tasks_this_week ?? 0,
      openTickets: s.open_tickets ?? 0,
      successRate: s.success_rate ?? 90,
      lastActivity: s.last_activity ?? '',
    };
  });
}

export async function incrementAgentTask(userId: string, agentSlug: string, lastActivity: string): Promise<void> {
  const db = supabaseAdmin();
  const { data: existing } = await db
    .from('agent_stats')
    .select('tasks_this_week')
    .eq('user_id', userId)
    .eq('agent_slug', agentSlug)
    .single();

  await db.from('agent_stats').upsert(
    {
      user_id: userId,
      agent_slug: agentSlug,
      tasks_this_week: (existing?.tasks_this_week ?? 0) + 1,
      last_activity: lastActivity,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,agent_slug' }
  );
}
