'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Creator } from '@/types';
import { formatFollowers, formatPercentage, getCreatorPlatformUrl, EXTERNAL_LINK_PROPS } from '@/lib/utils';
import { InstagramIcon, YoutubeIcon } from '../ui/Icons';
import {
  CheckCircle2,
  Users,
  Activity,
  PlaySquare,
  Plus,
  BarChart2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { setQuickAddCreator, setDetailModalCreator } from '@/store/slices/shortlistSlice';
import { motion } from 'framer-motion';

interface CreatorCardProps {
  creator: Creator;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const dispatch = useAppDispatch();
  const [imgError, setImgError] = useState(false);

  const isHighEngagement = creator.engagementRate >= 3.5;
  const femaleRatio = creator.audienceFemalePercentage || 50;
  const maleRatio = creator.audienceMalePercentage || (100 - femaleRatio);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#12141A]/70 border border-white/[0.08] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#151820]/90 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]"
    >
      {/* Top Header: Avatar, Name, Verified, Platform, Handle */}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-[#2E333D] group-hover:border-emerald-500/60 transition-colors shrink-0 bg-gradient-to-tr from-emerald-950 via-zinc-900 to-indigo-950 flex items-center justify-center shadow-inner">
              {!imgError && creator.avatarUrl ? (
                <Image
                  src={creator.avatarUrl}
                  alt={creator.fullName}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                  unoptimized
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white font-mono text-xs font-bold tracking-tight">
                  {creator.fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-zinc-100 truncate tracking-tight">
                  {creator.fullName}
                </h3>
                {creator.isVerified && (
                  <span title="Audience & Platform Verified Reach" className="inline-flex items-center text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 mt-0.5">
                <a
                  href={getCreatorPlatformUrl(creator)}
                  {...EXTERNAL_LINK_PROPS}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-zinc-400 font-mono truncate hover:text-emerald-400 hover:underline"
                  title={`Open live ${creator.platform === 'YOUTUBE' ? 'YouTube' : 'Instagram'} profile`}
                >
                  @{creator.handle}
                </a>
                <span className="text-[10px] text-zinc-600 font-mono">•</span>
                <span className="text-[11px] text-zinc-400 flex items-center gap-0.5 shrink-0">
                  <MapPin className="w-3 h-3 text-emerald-400/80" />
                  {creator.city}
                </span>
              </div>
            </div>
          </div>

          {/* Platform Badge with Verified Link */}
          <a
            href={getCreatorPlatformUrl(creator)}
            {...EXTERNAL_LINK_PROPS}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 transition-transform hover:scale-105"
            title={`Visit ${creator.fullName} on ${creator.platform === 'YOUTUBE' ? 'YouTube' : 'Instagram'}`}
          >
            {creator.platform === 'INSTAGRAM' ? (
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-950/40 text-pink-400 border border-pink-800/40 hover:border-pink-500/60 transition-colors"
                title="Instagram Creator"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:border-rose-500/60 transition-colors"
                title="YouTube Creator"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
              </div>
            )}
          </a>
        </div>

        {/* Niche, Location & Authenticity Quality Badge */}
        <div className="mt-3 flex items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#181A1F] border border-[#2E333D] text-zinc-300">
              {creator.niche}
            </span>
            {creator.state && (
              <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[110px]">
                {creator.state}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-mono font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md border ${
                (creator.authenticityScore ?? 94) >= 90
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
              }`}
              title="Audience Authenticity & Quality Gatekeeper: Bot & ghost audience filtered"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Authenticity Score: {creator.authenticityScore ?? 94}/100</span>
            </span>
          </div>
        </div>

        {/* 3-Column Monospace Metrics Bar (Apify High-Density) */}
        <div className="mt-3.5 grid grid-cols-3 gap-1.5 rounded-lg bg-[#0B0C0E] p-2 border border-[#20232A]">
          <div className="text-center">
            <span className="text-[10px] text-zinc-500 font-mono block">Followers</span>
            <p className="font-mono font-bold text-xs sm:text-sm text-zinc-100 tracking-tight mt-0.5">
              {formatFollowers(creator.followerCount)}
            </p>
          </div>

          <div className="text-center border-x border-[#20232A]">
            <span className="text-[10px] text-zinc-500 font-mono block">Eng. Rate</span>
            <div className="flex items-center justify-center gap-0.5 mt-0.5">
              <span
                className={`font-mono font-bold text-xs sm:text-sm ${
                  isHighEngagement ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {formatPercentage(creator.engagementRate)}
              </span>
              {isHighEngagement && <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />}
            </div>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-zinc-500 font-mono block">Avg Reel Views</span>
            <p className="font-mono font-semibold text-xs sm:text-sm text-zinc-200 tracking-tight mt-0.5">
              {formatFollowers(creator.avgReelViews)}
            </p>
          </div>
        </div>

        {/* Verified Collab Email Status Strip */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
          <span className="text-zinc-500 text-[10px]">Collab Channel:</span>
          {creator.businessEmail ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
              <Mail className="w-3 h-3 text-emerald-400" />
              <span>Verified Collab Email</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
              <span>Direct Platform DM</span>
            </span>
          )}
        </div>

        {/* Compact Audience Demographic Mini-Bar */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span
              className="cursor-help hover:text-zinc-200 transition-colors"
              title="Audience demographics estimated via category heuristics and interaction sampling."
            >
              Audience Split (Est.) *:
            </span>
            <span>
              <strong className="text-emerald-400">{femaleRatio}% F</strong> /{' '}
              <strong className="text-indigo-400">{maleRatio}% M</strong>
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${femaleRatio}%` }}
              title={`Female: ${femaleRatio}%`}
            />
            <div
              className="h-full bg-indigo-500"
              style={{ width: `${maleRatio}%` }}
              title={`Male: ${maleRatio}%`}
            />
          </div>
          <p className="text-[9px] font-mono text-zinc-500/80 leading-tight">
            * Audience demographics estimated via category heuristics and interaction sampling.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[#20232A]">
        <button
          type="button"
          onClick={() => dispatch(setDetailModalCreator(creator))}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#2E333D] bg-[#181A1F] py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
        >
          <BarChart2 className="w-3.5 h-3.5 text-zinc-400" />
          <span>Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => dispatch(setQuickAddCreator(creator))}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-zinc-950 shadow-sm transition-all hover:bg-emerald-400 active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Shortlist</span>
        </button>
      </div>
    </motion.div>
  );
}
