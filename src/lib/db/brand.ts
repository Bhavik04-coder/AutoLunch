import { supabaseAdmin } from '@/lib/supabase';

export interface BrandDNA {
  name: string;
  url: string;
  tagline: string;
  colors: string[];
  values: string[];
  aesthetic: string[];
  tone: string[];
  font: string;
  images: string[];
}

const DEFAULTS: BrandDNA = {
  name: '', url: '', tagline: '',
  colors: ['#612bd3', '#ffffff', '#0085ff', '#32d583', '#f97066'],
  values: [], aesthetic: [], tone: [],
  font: 'Inter', images: [],
};

export async function getBrandDNA(userId: string): Promise<BrandDNA> {
  const db = supabaseAdmin();
  const { data } = await db.from('brand_dna').select('*').eq('user_id', userId).single();
  if (!data) return DEFAULTS;
  return {
    name: data.name ?? '',
    url: data.url ?? '',
    tagline: data.tagline ?? '',
    colors: data.colors ?? DEFAULTS.colors,
    values: data.values ?? [],
    aesthetic: data.aesthetic ?? [],
    tone: data.tone ?? [],
    font: data.font ?? 'Inter',
    images: data.images ?? [],
  };
}

export async function saveBrandDNA(userId: string, brand: BrandDNA): Promise<void> {
  const db = supabaseAdmin();
  await db.from('brand_dna').upsert(
    { user_id: userId, ...brand, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}
