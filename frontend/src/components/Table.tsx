import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  loading?: boolean;
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data found',
  emptyIcon,
  sortKey,
  sortDir,
  onSort,
  loading,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-[1.25rem] border border-zinc-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <table className="w-full border-separate border-spacing-0 text-sm">
        {/* Head */}
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/80">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => onSort?.(String(col.key))}
                style={{ width: col.width }}
                className={[
                  'py-4 px-4 font-semibold text-xs text-zinc-500 uppercase tracking-wider select-none whitespace-nowrap',
                  alignClasses[col.align ?? 'left'],
                  onSort ? 'cursor-pointer hover:text-zinc-800 transition-colors' : '',
                ].join(' ')}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.header}
                  {onSort && sortKey === String(col.key) && (
                    sortDir === 'asc'
                      ? <ChevronUp size={14} className="text-[#00E676]" />
                      : <ChevronDown size={14} className="text-[#00E676]" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-zinc-100">
          {loading ? (
            // Skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((col) => (
                  <td key={String(col.key)} className="py-4 px-4">
                    <div className="h-4 bg-zinc-100 rounded-md w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-14 px-4 text-center text-zinc-400">
                {emptyIcon && (
                  <div className="mb-2.5 flex justify-center opacity-40">{emptyIcon}</div>
                )}
                <p className="text-sm font-medium text-zinc-500 m-0">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={[
                  'transition-colors duration-150',
                  onRowClick ? 'cursor-pointer hover:bg-zinc-50/80' : 'hover:bg-zinc-50/40',
                ].join(' ')}
              >
                {columns.map((col) => {
                  const rawValue = (row as Record<string, unknown>)[String(col.key)];
                  return (
                    <td
                      key={String(col.key)}
                      className={[
                        'py-4 px-4 text-zinc-800 align-middle',
                        alignClasses[col.align ?? 'left'],
                      ].join(' ')}
                    >
                      {col.render ? col.render(rawValue, row) : String(rawValue ?? '—')}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
