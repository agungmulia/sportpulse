import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-100 dark:border-gray-800', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-6 py-3 border-t border-gray-100 dark:border-gray-800', className)} {...props}>
      {children}
    </div>
  );
}
