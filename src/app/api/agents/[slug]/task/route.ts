import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { incrementAgentTask } from '@/lib/db/agents';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const { lastActivity } = await req.json();
  await incrementAgentTask(session.user.id, slug, lastActivity ?? '');
  return NextResponse.json({ success: true });
}
