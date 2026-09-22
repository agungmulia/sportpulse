import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export const metadata: Metadata = {
  title: 'Player — SportPulse AI',
};

export default function PlayerPage({ params }: Props) {
  // Player data is not yet available in mock mode.
  // This page will be populated once the real API is connected.
  if (!params.slug) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="text-6xl mb-4">⚽</div>
      <h1 className="text-2xl font-bold mb-2">Player Profile</h1>
      <p className="text-gray-500">
        Detail pemain belum tersedia dalam mode demo. Hubungkan API untuk melihat statistik pemain.
      </p>
    </div>
  );
}
