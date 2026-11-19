import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFollowers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return count.toLocaleString('en-IN');
}

export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactINR(amount: number | null | undefined): string {
  if (!amount) return '₹0';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')}L`;
  if (amount >= 1000) return `₹${Math.round(amount / 1000)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function estimateReelCost(creator: {
  followerCount: number;
  avgReelViews?: number;
  analytics?: { estimatedCostPerReelINR?: number };
}): number {
  if (creator.analytics?.estimatedCostPerReelINR && creator.analytics.estimatedCostPerReelINR > 0) {
    return creator.analytics.estimatedCostPerReelINR;
  }
  const views = creator.avgReelViews || creator.followerCount * 0.25;
  const raw = creator.followerCount * 0.35 + views * 0.12;
  return Math.max(5000, Math.round(raw / 500) * 500);
}

export function formatPercentage(val: number | null | undefined): string {
  if (val === null || val === undefined) return '0%';
  return `${val.toFixed(1)}%`;
}

export * from '@/utils/url';
