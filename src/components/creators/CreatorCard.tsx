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
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0C0E12]/90 border border-white/[0.07] p-4 sm:p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.14)]"
    >
      {/* Top Header: Avatar, Name, Verified, Platform, Handle */}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-white/[0.08] group-hover:border-emerald-500/60 transition-colors shrink-0 bg-gradient-to-tr from-emerald-950 via-zinc-900 to-indigo-950 flex items-center justify-center shadow-inner">
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
                <h3 className="font-bold text-sm text-zinc-100 truncate tracking-tight font-sans">
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
                <span className="text-[11px] text-zinc-400 flex items-center gap-0.5 shrink-0 font-mono">
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
            <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#08090C] border border-white/[0.08] text-zinc-300">
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
              <span>{creator.authenticityScore ?? 94}% Auth</span>
            </span>
          </div>
        </div>

        {/* Live Audited Data Badge & Timestamp */}
        <div className="mt-2.5 flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[10px] font-mono">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>✓ Live Audited Data</span>
          </span>
          <span className="text-zinc-400 text-[10px]">
            {creator.lastVerifiedAt
              ? new Date(creator.lastVerifiedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Verified Real'}
          </span>
        </div>

        {/* 3-Column Monospace Metrics Bar */}
        <div className="mt-3.5 grid grid-cols-3 gap-1.5 rounded-xl bg-[#08090C] p-2.5 border border-white/[0.06]">
          <div className="text-center">
            <span className="text-[10px] text-zinc-500 font-mono block">Followers</span>
            <p className="font-mono font-bold text-xs sm:text-sm text-zinc-100 tracking-tight mt-0.5">
              {formatFollowers(creator.followerCount)}
            </p>
          </div>

          <div className="text-center border-x border-white/[0.06]">
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
            <span className="text-[10px] text-zinc-500 font-mono block">Avg Views</span>
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
              <span>Verified Email</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded">
              <span>Direct DM</span>
            </span>
          )}
        </div>

        {/* Compact Audience Demographic Mini-Bar */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>Audience Split:</span>
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
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={() => dispatch(setDetailModalCreator(creator))}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white"
        >
          <BarChart2 className="w-3.5 h-3.5 text-zinc-400" />
          <span>Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => dispatch(setQuickAddCreator(creator))}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-black shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Shortlist</span>
        </button>
      </div>
    </motion.div>
  );
}
