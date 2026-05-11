'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { cn, formatKickoff, getStatusLabel, getStatusColor } from '@/lib/utils';
import type { Match } from '@/lib/api';

interface Props {
  match: Match;
}

export function MatchHeader({ match: initialMatch }: Props) {
  const [match, setMatch] = useState(initialMatch);
  const isLive = ['LIVE', 'HALF_TIME'].includes(match.status);

  useEffect(() => {
    if (!isLive) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3001', {
      path: '/socket.io',
      namespace: '/live',
    });

    socket.emit('join-match', match.id);
    socket.on('match-update', (data: Partial<Match>) => {
      setMatch((prev) => ({ ...prev, ...data }));
    });

    return () => { socket.disconnect(); };
  }, [match.id, isLive]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
      {/* League + status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {match.league.logo && (
            <Image src={match.league.logo} alt={match.league.name} width={20} height={20} className="object-contain" />
          )}
          <span className="text-sm text-gray-500">{match.league.name}</span>
        </div>
        <span className={cn('text-sm font-bold', getStatusColor(match.status))}>
          {isLive && <span className="live-badge mr-2">LIVE</span>}
          {getStatusLabel(match.status)}
        </span>
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home */}
        <div className="flex flex-col items-center gap-2 flex-1">
          {match.homeTeam.logo && (
            <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={64} height={64} className="object-contain" />
          )}
          <span className="font-bold text-center text-sm sm:text-base">{match.homeTeam.name}</span>
        </div>

        {/* Score */}
        <div className="text-center shrink-0">
          {['LIVE', 'HALF_TIME', 'FINISHED'].includes(match.status) ? (
            <div className="text-4xl sm:text-5xl font-black tabular-nums">
              {match.homeScore ?? 0}
              <span className="text-gray-300 dark:text-gray-700 mx-2">—</span>
              {match.awayScore ?? 0}
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold text-gray-400">vs</div>
              <div className="text-sm text-gray-500 mt-1">{formatKickoff(match.kickoffAt)}</div>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-2 flex-1">
          {match.awayTeam.logo && (
            <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={64} height={64} className="object-contain" />
          )}
          <span className="font-bold text-center text-sm sm:text-base">{match.awayTeam.name}</span>
        </div>
      </div>
    </div>
  );
}
