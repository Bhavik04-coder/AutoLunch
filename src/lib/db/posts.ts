import { supabaseAdmin } from '@/lib/supabase';
import type { Post, CreatePostPayload } from '@/types';

function toPost(row: any): Post {
  return {
    id: row.id,
    content: row.content,
    platforms: row.platforms ?? [],
    status: row.status,
    scheduledAt: row.scheduled_at ?? row.created_at,
    timezone: row.timezone ?? 'UTC',
    mediaUrls: row.media_urls ?? [],
    hashtags: row.hashtags ?? [],
    linkedInQueued: row.linkedin_queued ?? false,
    createdAt: row.created_at,
  };
}

export async function listPosts(userId: string): Promise<Post[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toPost);
}

export async function createPost(userId: string, payload: CreatePostPayload): Promise<Post> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('posts')
    .insert({
      user_id: userId,
      content: payload.content,
      platforms: payload.platforms,
      scheduled_at: payload.scheduledAt ?? null,
      timezone: payload.timezone ?? 'UTC',
      media_urls: payload.mediaUrls ?? [],
      hashtags: payload.hashtags ?? [],
      status: payload.scheduledAt ? 'scheduled' : 'draft',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toPost(data);
}

export async function updatePost(
  userId: string,
  postId: string,
  payload: Partial<CreatePostPayload> & { status?: Post['status']; linkedInQueued?: boolean }
): Promise<Post> {
  const db = supabaseAdmin();
  const update: Record<string, any> = {};
  if (payload.content !== undefined)     update.content = payload.content;
  if (payload.platforms !== undefined)   update.platforms = payload.platforms;
  if (payload.scheduledAt !== undefined) update.scheduled_at = payload.scheduledAt;
  if (payload.timezone !== undefined)    update.timezone = payload.timezone;
  if (payload.mediaUrls !== undefined)   update.media_urls = payload.mediaUrls;
  if (payload.hashtags !== undefined)    update.hashtags = payload.hashtags;
  if (payload.status !== undefined)      update.status = payload.status;
  if (payload.linkedInQueued !== undefined) update.linkedin_queued = payload.linkedInQueued;

  const { data, error } = await db
    .from('posts')
    .update(update)
    .eq('id', postId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toPost(data);
}

export async function deletePost(userId: string, postId: string): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

export async function schedulePost(
  userId: string,
  postId: string,
  scheduledAt: string,
  timezone?: string
): Promise<Post> {
  return updatePost(userId, postId, { scheduledAt, timezone, status: 'scheduled' });
}
