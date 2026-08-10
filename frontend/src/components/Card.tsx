import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm:   'p-6',
  md:   'p-8 sm:p-10',
  lg:   'p-10 sm:p-12',
};

export function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'none',
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-[1.5rem] border border-zinc-200/80 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)]',
        'backdrop-blur-sm transition-all duration-200',
        paddingClasses[padding],
        hoverable ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] hover:border-zinc-300' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
