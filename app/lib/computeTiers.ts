// app/lib/computeTiers.ts
import type { ElementDoc, RankedElement, Tier } from '@/app/types';

interface TierCutoff {
  tier: Tier;
  maxPct: number;
}

// Lineal: cada tier ocupa 20% parejo
const TIER_CUTOFFS: TierCutoff[] = [
  { tier: 'S', maxPct: 0.2 },
  { tier: 'A', maxPct: 0.4 },
  { tier: 'B', maxPct: 0.6 },
  { tier: 'C', maxPct: 0.8 },
  { tier: 'D', maxPct: 1.0 },
];

export function computeTiers(elements: ElementDoc[]): RankedElement[] {
  if (elements.length === 0) return [];

  const withScore = elements.map((el) => ({
    ...el,
    score: el.likes - el.dislikes,
  }));

  // elementos sin votos van directo a D, no entran en el cálculo de percentil
  const untouched = withScore.filter((el) => el.likes === 0 && el.dislikes === 0);
  const voted = withScore.filter((el) => el.likes > 0 || el.dislikes > 0);

  // scores únicos ordenados desc — el ranking se hace por score, no por posición individual
  const uniqueScores = Array.from(new Set(voted.map((el) => el.score))).sort(
    (a, b) => b - a
  );

  const totalUnique = uniqueScores.length;

  const scoreToTier = new Map<number, Tier>();
  uniqueScores.forEach((score, rankIdx) => {
    const pctRank = totalUnique === 1 ? 0 : rankIdx / (totalUnique - 1);
    const tier = TIER_CUTOFFS.find((c) => pctRank <= c.maxPct)?.tier ?? 'D';
    scoreToTier.set(score, tier);
  });

  const rankedVoted = voted.map((el) => ({
    ...el,
    tier: scoreToTier.get(el.score) ?? 'D',
  }));

  const rankedUntouched = untouched.map((el) => ({
    ...el,
    tier: 'D' as Tier,
  }));

  return [...rankedVoted, ...rankedUntouched];
}