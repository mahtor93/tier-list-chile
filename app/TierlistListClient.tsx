// src/app/TierlistListClient.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import TierlistCard from '@/app/components/TierlistCard';
import type { TierlistDoc } from '@/app/types';

interface TierlistListClientProps {
  initialTierlists: TierlistDoc[];
}

export default function TierlistListClient({ initialTierlists }: TierlistListClientProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialTierlists;

    return initialTierlists.filter((t) =>
      t.title.toLowerCase().includes(q)
    );
  }, [query, initialTierlists]);

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold shrink-0">Tierlists</h1>
        <Link
          href="/tierlist/nueva"
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/80 transition shrink-0"
        >
          + Crear tierlist
        </Link>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar tierlist..."
        className="w-full bg-panel border border-white/10 rounded-lg px-4 py-2 mb-6 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
      />

      {filtered.length === 0 ? (
        <p className="text-white/40">
          {query ? 'No hay resultados para tu búsqueda.' : 'No hay tierlists activas todavía.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TierlistCard key={t.slug} tierlist={t} />
          ))}
        </div>
      )}
    </>
  );
}