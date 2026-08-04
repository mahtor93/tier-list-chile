// src/lib/getTierlists.ts
import { connectDB } from '@/app/lib/mongodb';
import Tierlist from '@/app/models/Tierlist';
import type { TierlistDoc } from '@/app/types';

export async function getActiveTierlists(): Promise<TierlistDoc[]> {
  await connectDB();

  const tierlists = await Tierlist.find({ archived: false })
    .sort({ lastActivityAt: -1 })
    .select('title slug elements lastActivityAt')
    .lean();

  return JSON.parse(JSON.stringify(tierlists)); // serializa ObjectId/Date para RSC
}