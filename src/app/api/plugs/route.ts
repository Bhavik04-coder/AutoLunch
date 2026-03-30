import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listPlugs, togglePlug } from '@/lib/db/plugs';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plugs = await listPlugs(session.user.id);
  return NextResponse.json({ plugs });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug, enabled } = await req.json();
  await togglePlug(session.user.id, slug, enabled);
  return NextResponse.json({ success: true });
}
