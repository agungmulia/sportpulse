'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useDebounce } from '@/hooks/use-debounce';

interface Props {
  onClose: () => void;
}

export function SearchBar({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ teams: unknown[]; leagues: unknown[]; players: unknown[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions(null);
      return;
    }

    setLoading(true);
    api.search
      .autocomplete(debouncedQuery)
      .then((data) => setSuggestions(data as { teams: unknown[]; leagues: unknown[]; players: unknown[] }))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      }
    },
    [query, router, onClose],
  );

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tim, liga, pemain..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-400 hover:text-gray-600 px-2"
        >
          Batal
        </button>
      </form>

      {/* Suggestions dropdown */}
      {suggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          {Object.entries(suggestions).map(([type, items]) =>
            (items as Array<{ name: string; slug: string }>).length > 0 ? (
              <div key={type}>
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                  {type}
                </div>
                {(items as Array<{ name: string; slug: string }>).map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => {
                      router.push(`/${type.slice(0, -1)}/${item.slug}`);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
