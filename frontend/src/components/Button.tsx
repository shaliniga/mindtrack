import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[0_10px_24px_rgba(0,230,118,0.18)] hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)] hover:-translate-y-0.5',
  secondary: 'bg-white text-[var(--color-text-primary)] border-[var(--color-border)] hover:bg-[var(--color-surface-2)] hover:border-zinc-300',
  ghost:     'bg-transparent text-[var(--color-text-secondary)] border-transparent hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]',
  danger:    'bg-[var(--color-danger)] text-white border-[var(--color-danger)] hover:opacity-90 hover:-translate-y-0.5',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-[0.8125rem] px-4 h-9',
  md: 'text-sm px-6 h-10',
  lg: 'text-[0.9375rem] px-6 h-12',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-1.5 font-medium',
        'rounded-[var(--radius-md)] border cursor-pointer select-none',
        'transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        (disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className,
      ].join(' ')}
    >
      {loading ? (
        <span
          className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full"
        />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
