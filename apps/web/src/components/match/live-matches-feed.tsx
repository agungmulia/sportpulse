'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { MatchCard } from './match-card';
import type { Match } from '@/lib/api';

export function LiveMatchesFeed() {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ['matches', 'live'],
    queryFn: () => api.matches.getLive() as Promise<Match[]>,
    refetchInterval: 30000,
  });

  if (isLoading) return <LiveMatchesSkeleton />;

  if (error || !matches?.length) {
    return (
      <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
        <div className="text-4xl mb-3">⚽</div>
        <p className="text-gray-500 font-medium">Tidak ada pertandingan live saat ini</p>
        <p className="text-sm text-gray-400 mt-1">Cek jadwal pertandingan hari ini di bawah</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="live-badge">LIVE</span>
        <h2 className="font-semibold text-lg">{matches.length} Pertandingan Berlangsung</h2>
      </div>
      <div className="space-y-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}

function LiveMatchesSkeleton() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    </section>
  );
}
