'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  tag?: string;
  tagVariant?: 'emerald' | 'indigo' | 'amber';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  tag,
  tagVariant = 'emerald',
  className,
}: StatCardProps) {
  const tagColors = {
    emerald: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40',
    indigo: 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/40',
    amber: 'bg-amber-950/60 text-amber-300 border border-amber-800/40',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition-all hover:border-slate-700/80',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800/80 text-emerald-400 border border-slate-700/60 shadow-inner">
            {icon}
          </div>
        )}
      </div>
      {tag && (
        <div className="mt-4">
          <span
            className={cn(
              'inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full',
              tagColors[tagVariant]
            )}
          >
            {tag}
          </span>
        </div>
      )}
    </div>
  );
}
