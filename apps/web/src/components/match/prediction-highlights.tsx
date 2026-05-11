'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { formatProbability } from '@/lib/utils';

interface PredictionItem {
  match: {
    slug: string;
    homeTeam: { name: string; logo: string | null };
    awayTeam: { name: string; logo: string | null };
    league: { name: string };
  };
  winProbabilityHome: number;
  winProbabilityDraw: number;
  winProbabilityAway: number;
  confidenceScore: number;
}

export function PredictionHighlights() {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ['predictions', 'recent'],
    queryFn: () => api.predictions.getRecent(5) as Promise<PredictionItem[]>,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span>🤖</span>
        <h2 className="font-semibold">Prediksi AI Terbaru</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : predictions?.length ? (
        <div className="space-y-3">
          {predictions.map((pred, i) => (
            <Link
              key={i}
              href={`/prediction/${pred.match.slug}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-1 shrink-0">
                {pred.match.homeTeam.logo && (
                  <Image src={pred.match.homeTeam.logo} alt="" width={20} height={20} className="object-contain" />
                )}
                <span className="text-xs mx-1 text-gray-400">vs</span>
                {pred.match.awayTeam.logo && (
                  <Image src={pred.match.awayTeam.logo} alt="" width={20} height={20} className="object-contain" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">
                  {pred.match.homeTeam.name} vs {pred.match.awayTeam.name}
                </p>
                <p className="text-xs text-gray-400">{pred.match.league.name}</p>
              </div>
              <div className="text-xs font-bold text-primary-600 shrink-0">
                {formatProbability(Math.max(pred.winProbabilityHome, pred.winProbabilityDraw, pred.winProbabilityAway))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">Belum ada prediksi tersedia</p>
      )}

      <Link
        href="/predictions"
        className="mt-3 block text-center text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
      >
        Lihat semua prediksi →
      </Link>
    </div>
  );
}
