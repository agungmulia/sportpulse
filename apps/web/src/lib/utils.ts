import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
dayjs.locale('id');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKickoff(date: string | Date) {
  return dayjs(date).format('ddd, DD MMM · HH:mm');
}

export function formatRelative(date: string | Date) {
  return dayjs(date).fromNow();
}

export function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    LIVE: 'LIVE',
    HALF_TIME: 'HT',
    FINISHED: 'FT',
    SCHEDULED: 'Upcoming',
    POSTPONED: 'Postponed',
    CANCELLED: 'Cancelled',
  };
  return map[status] ?? status;
}

export function getStatusColor(status: string) {
  if (['LIVE', 'HALF_TIME'].includes(status)) return 'text-red-500';
  if (status === 'FINISHED') return 'text-gray-500';
  return 'text-primary-600';
}

export function formatProbability(value: number) {
  return `${Math.round(value * 100)}%`;
}
