// src/app/tierlist/nueva/page.tsx
import CreateTierlistForm from './CreateTierlistForm';

export default function NuevaTierlistPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Crear tierlist</h1>
      <CreateTierlistForm />
    </main>
  );
}