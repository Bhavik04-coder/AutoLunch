import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listAgents } from '@/lib/db/agents';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await auth();

  // If authenticated, return agents with per-user stats
  if (session?.user?.id) {
    const agents = await listAgents(session.user.id);
    return NextResponse.json({ agents });
  }

  // Unauthenticated: return agents without stats
  const db = supabaseAdmin();
  const { data } = await db.from('agents').select('*').order('sort_order');
  const agents = (data ?? []).map((a: any) => ({
    id: a.slug === 'nabr' ? '5' : a.id,
    slug: a.slug,
    name: a.name,
    role: a.role,
    image: a.image,
    status: a.status,
    prompt: a.prompt,
    tasksThisWeek: 0,
    openTickets: 0,
    successRate: 90,
    avgResolution: '1 Day',
    lastActivity: '',
  }));

  return NextResponse.json({ agents });
}
