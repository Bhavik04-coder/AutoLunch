import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserById, getUserOrganization, getUserSubscription } from '@/lib/db/users';
import { listConnectedAccounts } from '@/lib/db/integrations';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user, organization, subscription, connectedAccounts] = await Promise.all([
    getUserById(session.user.id),
    getUserOrganization(session.user.id),
    getUserSubscription(session.user.id),
    listConnectedAccounts(session.user.id),
  ]);

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({
    user,
    organization,
    subscription,
    totalChannels: connectedAccounts.length,
    isImpersonating: false,
  });
}
