import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { disconnectAccount } from '@/lib/db/integrations';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { provider } = await params;
  await disconnectAccount(session.user.id, provider);
  return NextResponse.json({ success: true });
}
