// app/tierlist/[slug]/TierlistClient.tsx
'use client';

import { useState } from 'react';
import TierlistBoard from '@/app/components/TierlistBoard';
import VoteModal from '@/app/components/VoteModal';
import AddElementForm from './AddElementForm';
import type { ElementDoc, RankedElement, VoteType } from '@/app/types';

interface TierlistClientProps {
  title: string;
  slug: string;
  tierlistId: string;
  initialElements: ElementDoc[];
}

export default function TierlistClient({ title, slug, tierlistId, initialElements }: TierlistClientProps) {
  const [elements, setElements] = useState<ElementDoc[]>(initialElements);
  const [selected, setSelected] = useState<RankedElement | null>(null);

  function handleVote(elementId: string, newVote: VoteType, prevVote: VoteType | null) {
    setElements((prev) =>
      prev.map((el) => {
        if (el._id !== elementId) return el;

        let { likes, dislikes } = el;
        if (prevVote === 'like') likes--;
        if (prevVote === 'dislike') dislikes--;
        if (newVote === 'like') likes++;
        if (newVote === 'dislike') dislikes++;

        return { ...el, likes, dislikes, myVote: newVote };
      })
    );
  }

  function handleAdded(newElement: ElementDoc) {
    setElements((prev) => [...prev, newElement]);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <AddElementForm
        slug={slug}
        tierlistId={tierlistId}
        currentCount={elements.length}
        onAdded={handleAdded}
      />
      <TierlistBoard elements={elements} onElementClick={setSelected} />
      <VoteModal element={selected} onVote={handleVote} onClose={() => setSelected(null)} />
    </main>
  );
}