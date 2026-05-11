import type { MatchEvent } from '@/lib/api';

const EVENT_ICONS: Record<string, string> = {
  GOAL: '⚽',
  OWN_GOAL: '⚽',
  YELLOW_CARD: '🟨',
  RED_CARD: '🟥',
  SUBSTITUTION: '🔄',
  VAR: '📺',
  PENALTY_SCORED: '⚽',
  PENALTY_MISSED: '❌',
};

interface Props {
  events?: MatchEvent[];
}

export function MatchEvents({ events }: Props) {
  if (!events?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
      <h2 className="font-semibold mb-4">Timeline Pertandingan</h2>
      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-3 text-sm py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <span className="w-8 text-right text-gray-400 text-xs font-mono shrink-0">{event.minute}&apos;</span>
            <span className="text-lg">{EVENT_ICONS[event.type] ?? '•'}</span>
            <span className="flex-1 text-gray-700 dark:text-gray-300">{event.detail ?? event.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
