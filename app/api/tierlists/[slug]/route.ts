// src/app/api/tierlists/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Tierlist, { TierlistDoc, ElementSubdoc } from '@/app/models/Tierlist';
import Vote from '@/app/models/Vote';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();

  const { slug } = await params;
  const voterUuid = request.cookies.get('voter_uuid')?.value;

  const tierlist = await Tierlist.findOne({ slug }).lean<TierlistDoc>();

  if (!tierlist) {
    return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  }

  let myVotes: Record<string, 'like' | 'dislike'> = {};

  if (voterUuid) {
    const votes = await Vote.find({
      tierlistId: tierlist._id,
      voterUuid,
    }).lean();

    myVotes = Object.fromEntries(
      votes.map((v) => [v.elementId.toString(), v.voteType])
    );
  }

  const elementsWithVote = tierlist.elements.map((el: ElementSubdoc) => ({
    ...el,
    myVote: myVotes[el._id.toString()] ?? null,
  }));

  return NextResponse.json({ ...tierlist, elements: elementsWithVote });
}