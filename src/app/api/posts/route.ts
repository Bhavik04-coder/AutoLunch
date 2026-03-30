import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listPosts, createPost } from '@/lib/db/posts';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await listPosts(session.user.id);
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const post = await createPost(session.user.id, body);
  return NextResponse.json({ post }, { status: 201 });
}
