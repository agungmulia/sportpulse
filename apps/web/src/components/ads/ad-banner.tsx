'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  position: 'above-fold' | 'mid-content' | 'sidebar' | 'sticky-footer' | 'inline';
  slot: string;
  className?: string;
  format?: string;
}

const SIZE_MAP: Record<Props['position'], { width: number; height: number; label: string }> = {
  'above-fold': { width: 728, height: 90, label: 'Leaderboard' },
  'mid-content': { width: 728, height: 90, label: 'Banner' },
  sidebar: { width: 300, height: 250, label: 'Rectangle' },
  'sticky-footer': { width: 728, height: 90, label: 'Sticky Footer' },
  inline: { width: 336, height: 280, label: 'Large Rectangle' },
};

export function AdBanner({ position, slot, className, format = 'auto' }: Props) {
  const adRef = useRef<HTMLDivElement>(null);
  const config = SIZE_MAP[position];
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  useEffect(() => {
    if (!adsenseId || !adRef.current) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded
    }
  }, [adsenseId]);

  const isStickyFooter = position === 'sticky-footer';

  if (!adsenseId) {
    // Dev placeholder
    return (
      <div
        className={cn(
          'ad-container',
          isStickyFooter && 'fixed bottom-0 left-0 right-0 z-40 rounded-none border-x-0 border-b-0',
          className,
        )}
        style={{ minHeight: config.height, maxWidth: config.width }}
      >
        <div className="text-center text-gray-300 dark:text-gray-600">
          <p className="text-xs font-mono">Ad ({config.label})</p>
          <p className="text-[10px]">{config.width}×{config.height}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={adRef}
      className={cn(
        isStickyFooter && 'fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex justify-center',
        className,
      )}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: config.width, height: config.height }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
