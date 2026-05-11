import type { Match } from '@/lib/api';

interface Props {
  match: Match;
}

interface StatRowProps {
  label: string;
  home: number | null;
  away: number | null;
}

function StatRow({ label, home, away }: StatRowProps) {
  const h = home ?? 0;
  const a = away ?? 0;
  const total = h + a || 1;
  const homeWidth = `${(h / total) * 100}%`;
  const awayWidth = `${(a / total) * 100}%`;

  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-1">
        <span>{h}</span>
        <span className="text-gray-400 text-xs">{label}</span>
        <span>{a}</span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 stat-bar flex justify-end overflow-hidden">
          <div className="stat-bar-fill" style={{ width: homeWidth }} />
        </div>
        <div className="flex-1 stat-bar overflow-hidden">
          <div className="h-full rounded-full bg-red-400 transition-all duration-500" style={{ width: awayWidth }} />
        </div>
      </div>
    </div>
  );
}

export function MatchStats({ match }: Props) {
  const stats = match.stats;
  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
      <h2 className="font-semibold mb-4">Statistik Pertandingan</h2>

      <div className="flex justify-between text-xs text-gray-400 mb-4 font-medium">
        <span>{match.homeTeam.name}</span>
        <span>{match.awayTeam.name}</span>
      </div>

      <div className="space-y-4">
        <StatRow label="Penguasaan Bola (%)" home={stats.homePossession} away={stats.awayPossession} />
        <StatRow label="Tembakan" home={stats.homeShots} away={stats.awayShots} />
        <StatRow label="On Target" home={stats.homeShotsOnTarget} away={stats.awayShotsOnTarget} />
        <StatRow label="Sudut" home={stats.homeCorners} away={stats.awayCorners} />
        <StatRow label="Pelanggaran" home={stats.homeFouls} away={stats.awayFouls} />
      </div>
    </div>
  );
}
