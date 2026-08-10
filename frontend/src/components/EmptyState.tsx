import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3.5rem 1.5rem',
      textAlign: 'center',
      gap: '0.75rem',
    }}>
      <div style={{
        width: 56, height: 56,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-surface-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)',
        marginBottom: '0.25rem',
      }}>
        <Icon size={24} />
      </div>

      {title && (
        <h3 style={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          {title}
        </h3>
      )}

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--color-text-muted)',
        margin: 0,
        maxWidth: 320,
        lineHeight: 1.6,
      }}>
        {message}
      </p>

      {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
    </div>
  );
}
