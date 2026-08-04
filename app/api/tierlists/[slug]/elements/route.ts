// app/api/tierlists/[slug]/elements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Tierlist, { ElementSubdoc } from '@/app/models/Tierlist';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();

  const { slug } = await params;
  const body = await request.json();
  const { name, imageUrl } = body;

  const cleanName = typeof name === 'string' ? name.trim() : '';

  if (!cleanName) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
  }

  const tierlist = await Tierlist.findOne({ slug });

  if (!tierlist) {
    return NextResponse.json({ error: 'Tierlist no encontrada' }, { status: 404 });
  }

  if (tierlist.archived) {
    return NextResponse.json({ error: 'Esta tierlist está archivada' }, { status: 400 });
  }

  if (tierlist.elements.length >= 25) {
    return NextResponse.json({ error: 'Máximo 25 elementos alcanzado' }, { status: 400 });
  }

  const duplicate = tierlist.elements.some(
    (el: ElementSubdoc) => el.name.toLowerCase() === cleanName.toLowerCase()
  );
  if (duplicate) {
    return NextResponse.json({ error: 'Ese elemento ya existe en la tierlist' }, { status: 409 });
  }

  tierlist.elements.push({
    name: cleanName,
    imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : undefined,
    likes: 0,
    dislikes: 0,
  });
  tierlist.lastActivityAt = new Date();
  await tierlist.save();

  const newElement = tierlist.elements[tierlist.elements.length - 1];

  return NextResponse.json({
    _id: newElement._id.toString(),
    name: newElement.name,
    imageUrl: newElement.imageUrl,
    likes: newElement.likes,
    dislikes: newElement.dislikes,
  }, { status: 201 });
}