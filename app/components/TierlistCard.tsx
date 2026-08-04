// src/components/TierlistCard.tsx
import Link from 'next/link';
import type { TierlistDoc } from '@/app/types';
import { TIER_COLORS } from '@/app/lib/tierColors';
import { computeTiers } from '@/app/lib/computeTiers';

export default function TierlistCard({ tierlist }: { tierlist: TierlistDoc }) {
  const ranked = computeTiers(tierlist.elements);
  const topTierElements = ranked.filter((el) => el.tier === 'S');

  return (
    <Link
      href={`/tierlist/${tierlist.slug}`}
      className="block bg-panel border border-white/10 rounded-xl p-4 hover:border-white/30 transition"
    >
      <h2 className="font-semibold mb-2 truncate">{tierlist.title}</h2>

      <div className="flex h-2 rounded-full overflow-hidden mb-3">
        {(['S', 'A', 'B', 'C', 'D'] as const).map((tier) => {
          const count = ranked.filter((el) => el.tier === tier).length;
          const pct = tierlist.elements.length
            ? (count / tierlist.elements.length) * 100
            : 0;
          return pct > 0 ? (
            <div
              key={tier}
              style={{ width: `${pct}%`, backgroundColor: TIER_COLORS[tier].bg }}
            />
          ) : null;
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-white/40">
        <span>{tierlist.elements.length} elementos</span>
        {topTierElements.length > 0 && (
          <span className="truncate max-w-[50%]">
            👑{' '}
            {topTierElements.length === 1
              ? topTierElements[0].name
              : `${topTierElements.length} en S`}
          </span>
        )}
      </div>
    </Link>
  );
}