import type { ElementDoc, RankedElement, Tier } from '@/app/types';

interface TierCutoff {
  tier: Tier;
  maxPct: number;
}

const TIER_CUTOFFS: TierCutoff[] = [
  { tier: 'S', maxPct: 0.08 },
  { tier: 'A', maxPct: 0.20 },
  { tier: 'B', maxPct: 0.45 },
  { tier: 'C', maxPct: 0.75 },
  { tier: 'D', maxPct: 1.0 },
];

export function computeTiers(elements: ElementDoc[]): RankedElement[] {
  if (elements.length === 0) return [];

  // score simple: likes - dislikes (podés cambiar a normalizado después)
  const withScore = elements.map((el) => ({
    ...el,
    score: el.likes - el.dislikes,
  }));

  // orden descendente por score
  const sorted = [...withScore].sort((a, b) => b.score - a.score);

  const total = sorted.length;

  return sorted.map((el, idx) => {
    const pctRank = idx / total; // 0 = mejor, cerca de 1 = peor
    const tier = TIER_CUTOFFS.find((c) => pctRank <= c.maxPct)?.tier ?? 'D';
    return { ...el, tier };
  });
}