interface Props {
  lineups?: unknown[];
}

export function MatchLineup({ lineups }: Props) {
  if (!lineups?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
      <h2 className="font-semibold mb-4">Susunan Pemain</h2>
      <p className="text-sm text-gray-500">Lineup data tersedia — {lineups.length} entri</p>
    </div>
  );
}
