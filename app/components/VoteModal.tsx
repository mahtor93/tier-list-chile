// src/components/VoteModal.tsx
'use client';

import { useState } from 'react';
import { TIER_COLORS } from '@/app/lib/tierColors';
import type { RankedElement, VoteType } from '@/app/types';

interface VoteModalProps {
  element: RankedElement | null;
  onVote: (elementId: string, newVote: VoteType, prevVote: VoteType | null) => void;
  onClose: () => void;
}

export default function VoteModal({ element, onVote, onClose }: VoteModalProps) {
  const [pending, setPending] = useState(false);
  const [localVote, setLocalVote] = useState<VoteType | null>(null);
  const [lastElementId, setLastElementId] = useState<string | null>(null);

  // sincroniza localVote cuando cambia el elemento seleccionado, sin efecto
  if (element && element._id !== lastElementId) {
    setLastElementId(element._id);
    setLocalVote(element.myVote ?? null);
  }

  if (!element) return null;

  const { likes, dislikes, tier } = element;
  const total = likes + dislikes;
  const likePct = total === 0 ? 50 : Math.round((likes / total) * 100);
  const dislikePct = 100 - likePct;

  async function handleVote(type: VoteType) {
    if (pending || !element) return;
    setPending(true);

    const prevVote = localVote;
    setLocalVote(type);
    onVote(element._id, type, prevVote);

    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierlistId: element.tierlistId,
          elementId: element._id,
          voteType: type,
        }),
      });
    } catch {
      setLocalVote(prevVote);
      onVote(element._id, prevVote as VoteType, type);
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-panel border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:w-96 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          {element.imageUrl && (
            <img
              src={element.imageUrl}
              alt={element.name}
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <div>
            <p className="font-semibold">{element.name}</p>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: TIER_COLORS[tier].bg,
                color: TIER_COLORS[tier].text,
              }}
            >
              Tier {tier}
            </span>
          </div>
        </div>

        <div className="h-3 w-full rounded-full overflow-hidden flex bg-white/10 mb-1">
          <div className="bg-green-500 transition-all duration-300" style={{ width: `${likePct}%` }} />
          <div className="bg-red-500 transition-all duration-300" style={{ width: `${dislikePct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-white/50 mb-5">
          <span>{likePct}% ({likes})</span>
          <span>{dislikePct}% ({dislikes})</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleVote('like')}
            disabled={pending}
            className={`flex-1 py-3 rounded-lg text-2xl transition-all ${
              localVote === 'like' ? 'bg-green-500 scale-105' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            👍
          </button>
          <button
            onClick={() => handleVote('dislike')}
            disabled={pending}
            className={`flex-1 py-3 rounded-lg text-2xl transition-all ${
              localVote === 'dislike' ? 'bg-red-500 scale-105' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            👎
          </button>
        </div>

        <button onClick={onClose} className="w-full mt-4 text-sm text-white/40 hover:text-white/70">
          Cerrar
        </button>
      </div>
    </div>
  );
}