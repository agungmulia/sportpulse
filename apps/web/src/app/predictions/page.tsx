import type { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AdBanner } from '@/components/ads/ad-banner';

export const metadata: Metadata = {
  title: 'AI Predictions — Win Probability & Match Analysis',
  description: 'AI-powered match predictions for upcoming and live football matches. Win probability, over/under, and confidence scores.',
};

export const revalidate = 60;

interface PredictionItem {
  match: {
    slug: string;
    status: string;
    homeTeam: { name: string; slug: string };
    awayTeam: { name: string; slug: string };
    league: { name: string };
  };
  winProbabilityHome: number;
  winProbabilityDraw: number;
  winProbabilityAway: number;
  confidenceScore: number;
}

export default async function PredictionsPage() {
  const items = (await api.predictions.getRecent(20)) as PredictionItem[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <AdBanner position="above-fold" slot="pred-list-top" className="mb-6" />

      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🤖</span>
        <h1 className="text-2xl font-bold">Prediksi AI</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Belum ada prediksi tersedia.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const home = Math.round(item.winProbabilityHome * 100);
            const draw = Math.round(item.winProbabilityDraw * 100);
            const away = Math.round(item.winProbabilityAway * 100);
            const confidence = Math.round(item.confidenceScore * 100);
            const top =
              home >= draw && home >= away
                ? 'home'
                : away >= draw
                ? 'away'
                : 'draw';

            return (
              <Link
                key={i}
                href={`/prediction/${item.match.slug}`}
                className="block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">
                      {item.match.homeTeam.name}{' '}
                      <span className="text-gray-400 font-normal">vs</span>{' '}
                      {item.match.awayTeam.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.match.league.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.match.status === 'LIVE' && (
                      <span className="live-badge">LIVE</span>
                    )}
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        confidence >= 75
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : confidence >= 60
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {confidence}% confidence
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-2">
                  <div className={`py-2 rounded-lg text-sm font-bold ${top === 'home' ? 'bg-primary-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
                    {home}%
                    <div className="text-[10px] font-normal opacity-75">Home</div>
                  </div>
                  <div className={`py-2 rounded-lg text-sm font-bold ${top === 'draw' ? 'bg-gray-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
                    {draw}%
                    <div className="text-[10px] font-normal opacity-75">Draw</div>
                  </div>
                  <div className={`py-2 rounded-lg text-sm font-bold ${top === 'away' ? 'bg-red-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
                    {away}%
                    <div className="text-[10px] font-normal opacity-75">Away</div>
                  </div>
                </div>

                <div className="flex rounded-full overflow-hidden h-1.5">
                  <div className="bg-primary-500" style={{ width: `${home}%` }} />
                  <div className="bg-gray-300 dark:bg-gray-600" style={{ width: `${draw}%` }} />
                  <div className="bg-red-500" style={{ width: `${away}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <AdBanner position="mid-content" slot="pred-list-bottom" className="mt-8" />
    </div>
  );
}
