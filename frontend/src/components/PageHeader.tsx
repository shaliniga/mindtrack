import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  backButton?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action, backButton }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[1.5rem] border border-zinc-200/80 bg-white/80 px-6 py-8 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:flex-row sm:items-start sm:justify-between sm:px-8 lg:px-10">
      <div className="flex min-w-0 flex-col gap-1">
        {backButton && <div className="mb-1">{backButton}</div>}
        <h1 className="m-0 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="m-0 mt-1 max-w-3xl text-sm leading-relaxed text-zinc-500">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-4">{action}</div>}
    </div>
  );
}
