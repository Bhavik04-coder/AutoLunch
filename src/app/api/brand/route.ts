import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getBrandDNA, saveBrandDNA } from '@/lib/db/brand';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const brand = await getBrandDNA(session.user.id);
  return NextResponse.json({ brand });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { brand } = await req.json();
  await saveBrandDNA(session.user.id, brand);
  return NextResponse.json({ success: true });
}
