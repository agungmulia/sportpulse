import dayjs from 'dayjs';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateMatchSlug(homeTeam: string, awayTeam: string, date: Date): string {
  const d = dayjs(date).format('YYYY-MM-DD');
  return `${slugify(homeTeam)}-vs-${slugify(awayTeam)}-${d}`;
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    total: items.length,
    page,
    limit,
    pages: Math.ceil(items.length / limit),
  };
}

export function formatScore(home: number | null, away: number | null): string {
  return `${home ?? 0}-${away ?? 0}`;
}

export { dayjs };
