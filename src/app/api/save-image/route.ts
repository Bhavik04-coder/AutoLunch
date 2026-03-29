import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, filename } = await req.json();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    // Fetch the image from the external URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch image: ${response.statusText}` }, { status: 502 });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = imageUrl.includes('.png') ? 'png' : 'jpg';
    const safeFilename = filename
      ? `${filename.replace(/[^a-z0-9_\-]/gi, '_').slice(0, 60)}.${ext}`
      : `nabr_${Date.now()}.${ext}`;

    // Ensure directory exists
    const dir = join(process.cwd(), 'public', 'generated-images');
    await mkdir(dir, { recursive: true });

    const filePath = join(dir, safeFilename);
    await writeFile(filePath, buffer);

    // Return the public URL path
    const publicPath = `/generated-images/${safeFilename}`;
    return NextResponse.json({ success: true, path: publicPath, filename: safeFilename });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
