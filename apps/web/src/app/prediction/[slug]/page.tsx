import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { AdBanner } from '@/components/ads/ad-banner';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const match = await api.matches.getBySlug(params.slug);
    return {
      title: `Prediksi ${match.homeTeam.name} vs ${match.awayTeam.name} — AI Prediction`,
      description: `AI-powered prediction for ${match.homeTeam.name} vs ${match.awayTeam.name}. Win probability, over/under analysis and tactical insights.`,
    };
  } catch {
    return { title: 'Prediction Not Found' };
  }
}

export default async function PredictionPage({ params }: Props) {
  try {
    const match = await api.matches.getBySlug(params.slug);
    const prediction = match.prediction;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner position="above-fold" slot="pred-top" className="mb-6" />

        <h1 className="text-2xl font-bold mb-2">
          Prediksi: {match.homeTeam.name} vs {match.awayTeam.name}
        </h1>
        <p className="text-gray-500 mb-6">{match.league.name}</p>

        {prediction ? (
          <div className="space-y-6">
            {/* Win probability */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-lg mb-4">Probabilitas Kemenangan</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-600">
                    {Math.round(prediction.winProbabilityHome * 100)}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{match.homeTeam.name}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-400">
                    {Math.round(prediction.winProbabilityDraw * 100)}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Draw</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-500">
                    {Math.round(prediction.winProbabilityAway * 100)}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{match.awayTeam.name}</div>
                </div>
              </div>

              {/* Probability bars */}
              <div className="mt-4 flex rounded-full overflow-hidden h-4">
                <div
                  className="bg-primary-500 transition-all"
                  style={{ width: `${prediction.winProbabilityHome * 100}%` }}
                />
                <div
                  className="bg-gray-300 dark:bg-gray-600"
                  style={{ width: `${prediction.winProbabilityDraw * 100}%` }}
                />
                <div
                  className="bg-red-500"
                  style={{ width: `${prediction.winProbabilityAway * 100}%` }}
                />
              </div>
            </div>

            {/* Over/Under */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-lg mb-4">Over/Under {prediction.overUnderLine}</h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className={`p-4 rounded-lg ${(prediction.overProbability ?? 0) > 0.5 ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <div className="text-2xl font-bold">{Math.round((prediction.overProbability ?? 0) * 100)}%</div>
                  <div className="text-sm text-gray-500 mt-1">Over</div>
                </div>
                <div className={`p-4 rounded-lg ${(prediction.underProbability ?? 0) > 0.5 ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <div className="text-2xl font-bold">{Math.round((prediction.underProbability ?? 0) * 100)}%</div>
                  <div className="text-sm text-gray-500 mt-1">Under</div>
                </div>
              </div>
            </div>

            {/* AI Confidence */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm">AI Confidence Score</p>
                  <p className="text-4xl font-bold mt-1">{Math.round(prediction.confidenceScore * 100)}%</p>
                </div>
                <div className="text-6xl opacity-20">🤖</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Prediksi belum tersedia untuk pertandingan ini.
          </div>
        )}

        <AdBanner position="mid-content" slot="pred-bottom" className="mt-8" />
      </div>
    );
  } catch {
    notFound();
  }
}
