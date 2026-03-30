import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listMedia, saveMedia } from '@/lib/db/media';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const media = await listMedia(session.user.id);
  return NextResponse.json({ media });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const file = await saveMedia(session.user.id, body);
  return NextResponse.json({ file }, { status: 201 });
}
