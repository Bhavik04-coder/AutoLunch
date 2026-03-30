import { supabaseAdmin } from '@/lib/supabase';
import type { MediaFile } from '@/types';

function toMediaFile(row: any): MediaFile {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    size: row.size_bytes ? formatBytes(row.size_bytes) : 'Unknown',
    url: row.url,
    date: row.created_at?.split('T')[0] ?? '',
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function listMedia(userId: string): Promise<MediaFile[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('media_files')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toMediaFile);
}

export async function saveMedia(
  userId: string,
  file: { name: string; type: 'image' | 'video' | 'document'; sizeBytes?: number; url: string }
): Promise<MediaFile> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('media_files')
    .insert({
      user_id: userId,
      name: file.name,
      type: file.type,
      size_bytes: file.sizeBytes ?? null,
      url: file.url,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toMediaFile(data);
}

export async function deleteMedia(userId: string, mediaId: string): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db
    .from('media_files')
    .delete()
    .eq('id', mediaId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}
