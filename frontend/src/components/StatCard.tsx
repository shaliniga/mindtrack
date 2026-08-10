import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
}

const trendStyles: Record<string, { color: string; bg: string }> = {
  up:     { color: 'text-emerald-700', bg: 'bg-emerald-50' },
  down:   { color: 'text-rose-700',    bg: 'bg-rose-50' },
  stable: { color: 'text-zinc-600',    bg: 'bg-zinc-100' },
};

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon,
  color = '#00E676',
  loading = false,
}: StatCardProps) {
  const TrendIcon =
    trend === 'up' ? TrendingUp :
    trend === 'down' ? TrendingDown :
    Minus;

  const currentTrend = trend ? (trendStyles[trend] ?? trendStyles.stable) : null;

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-[1.5rem] border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50/70 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </span>
        {icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: `${color}18`, color }}
          >
            {icon}
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-100" />
        ) : (
          <div className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-none">
            {value}
          </div>
        )}
      </div>

      {trend && trendLabel && currentTrend ? (
        <div className="mt-auto flex items-center gap-2 border-t border-zinc-100 pt-4">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${currentTrend.bg} ${currentTrend.color}`}>
            <TrendIcon size={13} />
            <span>{trendLabel}</span>
          </span>
        </div>
      ) : (
        <div className="mt-auto border-t border-zinc-100 pt-4 text-xs text-zinc-400">
          Updated in real-time
        </div>
      )}
    </div>
  );
}
