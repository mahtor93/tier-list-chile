// app/tierlist/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { connectDB } from '@/app/lib/mongodb';
import Tierlist from '@/app/models/Tierlist';
import Vote from '@/app/models/Vote';
import TierlistClient from './TierlistClient';
import type { TierlistDoc, VoteType } from '@/app/types';

export default async function TierlistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();

  const tierlist = await Tierlist.findOne({ slug }).lean<TierlistDoc>();
  if (!tierlist) notFound();

  const cookieStore = await cookies();
  const voterUuid = cookieStore.get('voter_uuid')?.value;

  let myVotes: Record<string, VoteType> = {};
  if (voterUuid) {
    const votes = await Vote.find({ tierlistId: tierlist._id, voterUuid }).lean();
    myVotes = Object.fromEntries(votes.map((v) => [v.elementId.toString(), v.voteType]));
  }

  const tierlistIdStr = tierlist._id.toString();

  const elements = tierlist.elements.map((el) => ({
    ...el,
    tierlistId: tierlistIdStr,
    myVote: myVotes[el._id.toString()] ?? null,
  }));

  return (
    <TierlistClient
      title={tierlist.title}
      slug={slug}
      tierlistId={tierlistIdStr}
      initialElements={JSON.parse(JSON.stringify(elements))}
    />
  );
}