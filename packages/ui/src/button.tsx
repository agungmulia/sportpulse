import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: Props) {
  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2',
          {
            'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500': variant === 'primary',
            'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-800 dark:text-gray-200': variant === 'secondary',
            'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500': variant === 'danger',
            'px-2.5 py-1.5 text-xs': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
            'opacity-50 cursor-not-allowed': props.disabled,
          },
        ),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
