'use client';

import React from 'react';
import Link from 'next/link';
import { Campaign } from '@/types';
import { formatFollowers, formatINR } from '@/lib/utils';
import {
  MapPin,
  Users,
  IndianRupee,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const analytics = campaign.analytics || {
    allocatedBudgetINR: 0,
    remainingBudgetINR: campaign.budgetINR,
    budgetUtilizationPercent: 0,
    totalCreatorsCount: 0,
    totalEstimatedReach: 0,
  };

  const formattedDate = new Date(campaign.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isActive = campaign.status === 'ACTIVE';

  return (
    <div className="flex flex-col justify-between rounded-xl bg-[#121316] border border-[#24272E] p-5 shadow-md transition-all hover:border-zinc-700 hover:bg-[#16181D]">
      <div>
        {/* Header: Status Indicator Dot, Date */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#20232A]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isActive ? 'bg-emerald-500' : 'bg-zinc-500'
                }`}
              ></span>
            </span>
            <span
              className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isActive ? 'text-emerald-400' : 'text-zinc-400'
              }`}
            >
              {campaign.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Campaign Title & Description */}
        <div className="mt-3">
          <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 font-sans">
            {campaign.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {campaign.description}
          </p>
        </div>

        {/* Target City & Linked Shortlists */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {campaign.targetCity && (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#181A1F] border border-[#2E333D] px-2 py-0.5 text-[11px] font-mono text-indigo-300">
              <MapPin className="w-3 h-3 text-indigo-400" />
              <span>{campaign.targetCity}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-md bg-[#181A1F] border border-[#2E333D] px-2 py-0.5 text-[11px] font-mono text-zinc-400">
            <Layers className="w-3 h-3 text-zinc-500" />
            <span>{campaign.shortlists?.length || 0} Shortlists</span>
          </span>
        </div>

        {/* Budget Progress Bar */}
        <div className="mt-4 space-y-2 rounded-lg bg-[#0B0C0E] p-3 border border-[#20232A]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-emerald-400" />
              Budget Utilization
            </span>
            <span className="font-bold text-white font-mono text-xs">
              {analytics.budgetUtilizationPercent}%
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              style={{ width: `${Math.min(100, analytics.budgetUtilizationPercent)}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                analytics.budgetUtilizationPercent > 90
                  ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-0.5">
            <span>Committed: <strong className="text-zinc-200">{formatINR(analytics.allocatedBudgetINR)}</strong></span>
            <span>Total: <strong className="text-zinc-200">{formatINR(campaign.budgetINR)}</strong></span>
          </div>
        </div>

        {/* Key Reach & Creators Metrics */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg bg-[#0B0C0E] p-2 border border-[#20232A]">
            <span className="text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" />
              Cohort Reach
            </span>
            <span className="font-mono font-bold text-xs sm:text-sm text-zinc-100 mt-0.5 block">
              {formatFollowers(analytics.totalEstimatedReach)}
            </span>
          </div>

          <div className="rounded-lg bg-[#0B0C0E] p-2 border border-[#20232A]">
            <span className="text-[10px] font-mono text-zinc-500 block">
              Active Talent
            </span>
            <span className="font-mono font-bold text-xs sm:text-sm text-emerald-400 mt-0.5 block">
              {analytics.totalCreatorsCount} Creators
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#20232A] flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-mono text-[11px]">
          Balance: <strong className="text-zinc-200">{formatINR(analytics.remainingBudgetINR)}</strong>
        </span>

        <Link
          href="/shortlists"
          className="text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>Open Shortlists</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
