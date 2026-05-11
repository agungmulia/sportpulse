import Link from 'next/link';
import { formatProbability } from '@/lib/utils';
import type { Prediction, Match } from '@/lib/api';

interface Props {
  prediction: Prediction;
  match: Pick<Match, 'slug' | 'homeTeam' | 'awayTeam'>;
}

export function PredictionWidget({ prediction, match }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span>🤖</span>
          <h3 className="font-semibold text-sm">Prediksi AI</h3>
        </div>
        <span className="text-xs text-gray-400">
          Akurasi {formatProbability(prediction.confidenceScore)}
        </span>
      </div>

      {/* Win probability bars */}
      <div className="flex rounded-lg overflow-hidden h-8 mb-3">
        <div
          className="flex items-center justify-center text-xs font-bold text-white bg-primary-500"
          style={{ width: `${prediction.winProbabilityHome * 100}%` }}
        >
          {formatProbability(prediction.winProbabilityHome)}
        </div>
        <div
          className="flex items-center justify-center text-xs font-bold text-gray-600 bg-gray-200 dark:bg-gray-700"
          style={{ width: `${prediction.winProbabilityDraw * 100}%` }}
        >
          {formatProbability(prediction.winProbabilityDraw)}
        </div>
        <div
          className="flex items-center justify-center text-xs font-bold text-white bg-red-500"
          style={{ width: `${prediction.winProbabilityAway * 100}%` }}
        >
          {formatProbability(prediction.winProbabilityAway)}
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{match.homeTeam.name}</span>
        <span>Draw</span>
        <span>{match.awayTeam.name}</span>
      </div>

      <Link
        href={`/prediction/${match.slug}`}
        className="mt-4 block w-full text-center text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
      >
        Lihat analisis lengkap →
      </Link>
    </div>
  );
}
