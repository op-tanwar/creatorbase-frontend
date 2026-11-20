'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-white/[0.06]', className)}
      {...props}
    />
  );
}

export function CreatorCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0C0E12] p-4 flex flex-col justify-between h-full space-y-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.05] my-3 grid grid-cols-3 gap-1">
          <Skeleton className="h-8 rounded" />
          <Skeleton className="h-8 rounded" />
          <Skeleton className="h-8 rounded" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.05]">
        <Skeleton className="h-6 w-24 rounded-md" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-18 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
