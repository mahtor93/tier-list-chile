// src/app/tierlist/nueva/CreateTierlistForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DraftElement {
  name: string;
  imageUrl: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function CreateTierlistForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [elements, setElements] = useState<DraftElement[]>([{ name: '', imageUrl: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateElement(index: number, field: keyof DraftElement, value: string) {
    setElements((prev) =>
      prev.map((el, i) => (i === index ? { ...el, [field]: value } : el))
    );
  }

  function addElement() {
    if (elements.length >= 25) return;
    setElements((prev) => [...prev, { name: '', imageUrl: '' }]);
  }

  function removeElement(index: number) {
    setElements((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    const cleanElements = elements
      .map((el) => ({ name: el.name.trim(), imageUrl: el.imageUrl.trim() }))
      .filter((el) => el.name.length > 0);

    if (!cleanTitle) {
      setError('El título es obligatorio');
      return;
    }
    if (cleanElements.length === 0) {
      setError('Agrega al menos un elemento');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/tierlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cleanTitle,
          slug: slugify(cleanTitle),
          elements: cleanElements,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Error al crear la tierlist');
        setSubmitting(false);
        return;
      }

      router.push(`/tierlist/${data.slug}`);
    } catch {
      setError('Error de conexión');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="block text-sm text-white/60 mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Mejores vinos chilenos"
          className="w-full bg-panel border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/30"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-white/60">Elementos ({elements.length}/25)</label>
          <button
            type="button"
            onClick={addElement}
            disabled={elements.length >= 25}
            className="text-sm text-white/60 hover:text-white disabled:opacity-30"
          >
            + Agregar
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {elements.map((el, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={el.name}
                onChange={(e) => updateElement(i, 'name', e.target.value)}
                placeholder="Nombre del elemento"
                className="flex-1 bg-panel border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
              />
              <input
                type="text"
                value={el.imageUrl}
                onChange={(e) => updateElement(i, 'imageUrl', e.target.value)}
                placeholder="URL de imagen (opcional)"
                className="flex-1 bg-panel border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30"
              />
              {elements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeElement(i)}
                  className="text-white/40 hover:text-red-400 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-white text-black py-3 rounded-lg font-medium hover:bg-white/80 transition disabled:opacity-50"
      >
        {submitting ? 'Creando...' : 'Crear tierlist'}
      </button>
    </form>
  );
}