import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listInvoices, updateSubscriptionTier } from '@/lib/db/billing';
import { getUserSubscription } from '@/lib/db/users';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [invoices, subscription] = await Promise.all([
    listInvoices(session.user.id),
    getUserSubscription(session.user.id),
  ]);

  return NextResponse.json({ invoices, subscription });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { tier } = await req.json();
  await updateSubscriptionTier(session.user.id, tier);
  return NextResponse.json({ success: true });
}
