import { supabaseAdmin } from '@/lib/supabase';
import type { ConnectedAccount, PlatformId } from '@/types';

function toConnectedAccount(row: any): ConnectedAccount {
  return {
    provider: row.provider as PlatformId,
    name: row.provider_name ?? row.provider,
    connectedAt: new Date(row.connected_at).getTime(),
    accessToken: row.access_token ?? undefined,
  };
}

export async function listConnectedAccounts(userId: string): Promise<ConnectedAccount[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('connected_accounts')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return (data ?? []).map(toConnectedAccount);
}

export async function upsertConnectedAccount(
  userId: string,
  account: { provider: string; name?: string; accessToken?: string }
): Promise<ConnectedAccount> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('connected_accounts')
    .upsert(
      {
        user_id: userId,
        provider: account.provider,
        provider_name: account.name ?? account.provider,
        access_token: account.accessToken ?? null,
        connected_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,provider' }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toConnectedAccount(data);
}

export async function disconnectAccount(userId: string, provider: string): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db
    .from('connected_accounts')
    .delete()
    .eq('user_id', userId)
    .eq('provider', provider);

  if (error) throw new Error(error.message);
}
