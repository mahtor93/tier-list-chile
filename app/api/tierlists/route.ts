import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Tierlist from '@/app/models/Tierlist';

export async function GET() {
  await connectDB();

  const tierlists = await Tierlist.find({ archived: false })
    .sort({ lastActivityAt: -1 })
    .select('title slug elements lastActivityAt')
    .lean();

  return NextResponse.json(tierlists);
}

export async function POST(request: NextRequest) {
  await connectDB();

  const body = await request.json();
  const { title, slug, elements } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: 'Falta title o slug' }, { status: 400 });
  }

  if (elements && elements.length > 25) {
    return NextResponse.json({ error: 'Máximo 25 elementos' }, { status: 400 });
  }

  try {
    const tierlist = await Tierlist.create({ title, slug, elements: elements ?? [] });
    return NextResponse.json(tierlist, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('duplicate key')) {
      return NextResponse.json({ error: 'Ese slug ya existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al crear tierlist' }, { status: 500 });
  }
}