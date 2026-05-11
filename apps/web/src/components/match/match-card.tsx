import Link from 'next/link';
import Image from 'next/image';
import { cn, formatKickoff, getStatusLabel, getStatusColor } from '@/lib/utils';
import type { Match } from '@/lib/api';

interface Props {
  match: Match;
  className?: string;
}

export function MatchCard({ match, className }: Props) {
  const isLive = ['LIVE', 'HALF_TIME'].includes(match.status);
  const isFinished = match.status === 'FINISHED';
  const showScore = isLive || isFinished;

  return (
    <Link href={`/match/${match.slug}`} className={cn('score-card group', className)}>
      {/* League */}
      <div className="flex items-center gap-1.5 mb-3">
        {match.league.logo && (
          <Image src={match.league.logo} alt={match.league.name} width={16} height={16} className="object-contain" />
        )}
        <span className="text-xs text-gray-400 uppercase tracking-wide">{match.league.name}</span>
        <span className={cn('ml-auto text-xs font-semibold', getStatusColor(match.status))}>
          {isLive && <span className="live-badge mr-2">LIVE</span>}
          {getStatusLabel(match.status)}
        </span>
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {match.homeTeam.logo && (
            <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={28} height={28} className="object-contain shrink-0" />
          )}
          <span className="font-medium text-sm truncate">{match.homeTeam.name}</span>
        </div>

        {/* Score / time */}
        <div className="shrink-0 text-center min-w-[60px]">
          {showScore ? (
            <div className="font-bold text-lg">
              {match.homeScore ?? 0} <span className="text-gray-300 dark:text-gray-600">-</span> {match.awayScore ?? 0}
            </div>
          ) : (
            <div className="text-sm text-gray-500">{formatKickoff(match.kickoffAt)}</div>
          )}
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="font-medium text-sm truncate text-right">{match.awayTeam.name}</span>
          {match.awayTeam.logo && (
            <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={28} height={28} className="object-contain shrink-0" />
          )}
        </div>
      </div>
    </Link>
  );
}
