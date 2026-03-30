import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updatePost, deletePost } from '@/lib/db/posts';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const post = await updatePost(session.user.id, id, body);
  return NextResponse.json({ post });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await deletePost(session.user.id, id);
  return NextResponse.json({ success: true });
}
