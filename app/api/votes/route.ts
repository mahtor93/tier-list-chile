// src/app/api/votes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Tierlist from '@/app/models/Tierlist';
import Vote from '@/app/models/Vote';

export async function POST(request: NextRequest) {
  await connectDB();

  const voterUuid = request.cookies.get('voter_uuid')?.value;
  if (!voterUuid) {
    return NextResponse.json({ error: 'Falta voter_uuid' }, { status: 400 });
  }

  const body = await request.json();
  const { tierlistId, elementId, voteType, fingerprintHash } = body;

  if (!tierlistId || !elementId || !['like', 'dislike'].includes(voteType)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  // busca voto previo del mismo usuario para este elemento
  const existing = await Vote.findOne({ tierlistId, elementId, voterUuid });

  const tierlist = await Tierlist.findById(tierlistId);
  if (!tierlist) {
    return NextResponse.json({ error: 'Tierlist no encontrada' }, { status: 404 });
  }

  const element = tierlist.elements.id(elementId);
  if (!element) {
    return NextResponse.json({ error: 'Elemento no encontrado' }, { status: 404 });
  }

  // ajusta contadores según cambio de voto
  if (existing) {
    if (existing.voteType === voteType) {
      return NextResponse.json({ likes: element.likes, dislikes: element.dislikes });
    }
    if (existing.voteType === 'like') element.likes = Math.max(0, element.likes - 1);
    if (existing.voteType === 'dislike') element.dislikes = Math.max(0, element.dislikes - 1);

    existing.voteType = voteType;
    existing.fingerprintHash = fingerprintHash;
    await existing.save();
  } else {
    await Vote.create({ tierlistId, elementId, voterUuid, voteType, fingerprintHash });
  }

  if (voteType === 'like') element.likes += 1;
  if (voteType === 'dislike') element.dislikes += 1;

  tierlist.lastActivityAt = new Date();
  await tierlist.save();

  return NextResponse.json({ likes: element.likes, dislikes: element.dislikes });
}