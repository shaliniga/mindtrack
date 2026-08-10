import type { AlertSeverity, AlertStatus, Role } from '@/types';

type BadgeVariant =
  | AlertSeverity      // 'low' | 'medium' | 'high'
  | AlertStatus        // 'active' | 'resolved' | 'dismissed'
  | Role               // 'employee' | 'manager' | 'admin'
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
}

// Tailwind-compatible inline style pairs (colours from CSS vars can't be pre-built by Tailwind)
const variantMap: Record<string, { bg: string; color: string }> = {
  low:       { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  medium:    { bg: 'var(--color-warning-light)',  color: '#92400e' },
  high:      { bg: 'var(--color-danger-light)',   color: 'var(--color-danger)' },
  active:    { bg: 'var(--color-danger-light)',   color: 'var(--color-danger)' },
  resolved:  { bg: 'var(--color-success-light)',  color: 'var(--color-success)' },
  dismissed: { bg: 'var(--color-surface-2)',      color: 'var(--color-text-muted)' },
  employee:  { bg: 'var(--color-primary-light)',  color: 'var(--color-primary)' },
  manager:   { bg: '#fef9c3',                     color: '#854d0e' },
  admin:     { bg: '#ede9fe',                     color: '#6d28d9' },
  default:   { bg: 'var(--color-surface-2)',      color: 'var(--color-text-secondary)' },
  success:   { bg: 'var(--color-success-light)',  color: 'var(--color-success)' },
  warning:   { bg: 'var(--color-warning-light)',  color: '#92400e' },
  danger:    { bg: 'var(--color-danger-light)',   color: 'var(--color-danger)' },
  info:      { bg: 'var(--color-info-light)',     color: 'var(--color-info)' },
  purple:    { bg: '#faf5ff',                     color: '#7c3aed' },
};

export function Badge({ variant = 'default', children, size = 'sm', dot = false }: BadgeProps) {
  const { bg, color } = variantMap[variant] ?? variantMap.default;

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2.5 py-0.5 text-[0.75rem]' : 'px-3 py-1 text-[0.8125rem]',
      ].join(' ')}
      style={{ background: bg, color }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: color }}
        />
      )}
      {children}
    </span>
  );
}
