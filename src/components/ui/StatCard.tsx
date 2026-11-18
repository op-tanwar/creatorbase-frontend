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
    emerald: 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30',
    indigo: 'bg-indigo-950/50 text-indigo-300 border border-indigo-500/30',
    amber: 'bg-amber-950/50 text-amber-300 border border-amber-500/30',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-[#0C0E12]/90 border border-white/[0.07] p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all hover:border-emerald-500/30 group',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-sans">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
            {icon}
          </div>
        )}
      </div>
      {tag && (
        <div className="mt-4">
          <span
            className={cn(
              'inline-flex items-center text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full',
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
