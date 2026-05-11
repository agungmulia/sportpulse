'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { MatchCard } from './match-card';
import type { Match } from '@/lib/api';

export function TodaySchedule() {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches', 'today'],
    queryFn: () => api.matches.getToday() as Promise<Match[]>,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <section>
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!matches?.length) return null;

  const scheduled = matches.filter((m) => m.status === 'SCHEDULED');

  if (!scheduled.length) return null;

  return (
    <section>
      <h2 className="font-semibold text-lg mb-4">Jadwal Hari Ini</h2>
      <div className="space-y-3">
        {scheduled.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
