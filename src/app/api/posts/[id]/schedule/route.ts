import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { schedulePost } from '@/lib/db/posts';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { scheduledAt, timezone } = await req.json();
  if (!scheduledAt) return NextResponse.json({ error: 'scheduledAt is required' }, { status: 400 });

  const post = await schedulePost(session.user.id, id, scheduledAt, timezone);
  return NextResponse.json({ post });
}
