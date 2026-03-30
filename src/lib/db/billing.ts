import { supabaseAdmin } from '@/lib/supabase';

export interface Invoice {
  id: string;
  description: string;
  status: 'paid' | 'pending' | 'failed';
  createdAt: string;
}

export async function listInvoices(userId: string): Promise<Invoice[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => ({
    id: r.id,
    description: r.description,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function updateSubscriptionTier(userId: string, tier: string): Promise<void> {
  const db = supabaseAdmin();
  await db.from('subscriptions')
    .upsert({ user_id: userId, tier, status: 'active', updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

  // Log invoice
  await db.from('invoices').insert({
    user_id: userId,
    description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan — Monthly`,
    status: 'paid',
  });
}
