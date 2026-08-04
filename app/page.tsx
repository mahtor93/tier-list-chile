// src/app/page.tsx
import { getActiveTierlists } from '@/app/lib/getTierLists';
import TierlistListClient from './TierlistListClient';

export default async function HomePage() {
  const tierlists = await getActiveTierlists();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <TierlistListClient initialTierlists={tierlists} />
    </main>
  );
}