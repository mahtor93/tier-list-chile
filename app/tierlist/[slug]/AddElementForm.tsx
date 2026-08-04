'use client';

import { useState } from 'react';
import type { ElementDoc } from '@/app/types';

interface AddElementFormProps {
  slug: string;
  tierlistId: string;
  currentCount: number;
  onAdded: (element: ElementDoc) => void;
}

export default function AddElementForm({ slug, tierlistId, currentCount, onAdded }: AddElementFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atLimit = currentCount >= 25;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError('El nombre es obligatorio');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/tierlists/${slug}/elements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, imageUrl: imageUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Error al agregar el elemento');
        setSubmitting(false);
        return;
      }

      onAdded({ ...data, tierlistId, myVote: null });
      setName('');
      setImageUrl('');
      setOpen(false);
    } catch {
      setError('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  }

  if (atLimit) {
    return <p className="text-white/30 text-sm mb-4">Límite de 25 elementos alcanzado.</p>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-white/60 hover:text-white mb-4 border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/30 transition"
      >
        + Agregar elemento
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4 bg-panel border border-white/10 rounded-lg p-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del elemento"
        autoFocus
        className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="URL de imagen (opcional)"
        className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-white text-black py-2 rounded-lg text-sm font-medium hover:bg-white/80 transition disabled:opacity-50"
        >
          {submitting ? 'Agregando...' : 'Agregar'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-white/40 hover:text-white/70 px-3"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}