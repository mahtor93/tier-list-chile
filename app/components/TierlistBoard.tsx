// src/app/components/TierlistBoard.tsx
'use client';

import { useMemo } from 'react';
import { TIER_COLORS } from '@/app/lib/tierColors';
import { computeTiers } from '@/app/lib/computeTiers';
import type { ElementDoc, RankedElement, Tier } from '@/app/types';

const TIER_ORDER: Tier[] = ['S', 'A', 'B', 'C', 'D'];

interface TierlistBoardProps {
  elements: ElementDoc[];
  onElementClick: (element: RankedElement) => void;
}

export default function TierlistBoard({ elements, onElementClick }: TierlistBoardProps) {
  const ranked = useMemo(() => computeTiers(elements), [elements]);

  const grouped = TIER_ORDER.reduce<Record<Tier, RankedElement[]>>((acc, tier) => {
    acc[tier] = ranked.filter((el) => el.tier === tier);
    return acc;
  }, {} as Record<Tier, RankedElement[]>);

  return (
    <div className="flex flex-col gap-1 w-full max-w-3xl mx-auto">
      {TIER_ORDER.map((tier) => (
        <TierRow
          key={tier}
          tier={tier}
          items={grouped[tier]}
          onElementClick={onElementClick}
        />
      ))}
    </div>
  );
}

interface TierRowProps {
  tier: Tier;
  items: RankedElement[];
  onElementClick: (element: RankedElement) => void;
}

function TierRow({ tier, items, onElementClick }: TierRowProps) {
  const { bg, text } = TIER_COLORS[tier];

  return (
    <div className="flex min-h-[88px] border border-white/10">
      <div
        className="flex items-center justify-center w-16 shrink-0 font-bold text-2xl"
        style={{ backgroundColor: bg, color: text }}
      >
        {tier}
      </div>

      <div className="flex flex-wrap gap-2 p-2 bg-panel flex-1">
        {items.length === 0 && (
          <span className="text-white/30 text-sm self-center px-2">
            sin elementos
          </span>
        )}

        {items.map((el) => (
          <button
            key={el._id}
            onClick={() => onElementClick(el)}
            className="w-16 h-16 rounded overflow-hidden border-2 transition-transform hover:scale-105"
            style={{ borderColor: bg }}
          >
            {el.imageUrl ? (
              <img
                src={el.imageUrl}
                alt={el.name}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <span className="flex items-center justify-center h-full text-xs text-center px-1">
                {el.name}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}