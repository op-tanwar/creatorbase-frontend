'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Creator } from '@/types';
import {
  formatFollowers,
  formatPercentage,
  formatCompactINR,
  estimateReelCost,
  getCreatorPlatformUrl,
  EXTERNAL_LINK_PROPS,
} from '@/lib/utils';
import { InstagramIcon, YoutubeIcon } from '../ui/Icons';
import {
  ShieldCheck,
  MapPin,
  Check,
  Copy,
  Plus,
  BarChart2,
  ExternalLink,
  Mail,
  Zap,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuickAddCreator, setDetailModalCreator } from '@/store/slices/shortlistSlice';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface CreatorCardProps {
  creator: Creator;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function CreatorCard({ creator, isSelected = false, onToggleSelect }: CreatorCardProps) {
  const dispatch = useAppDispatch();
  const shortlists = useAppSelector((state) => state.shortlists.shortlists);

  const [imgError, setImgError] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Check if creator is already added to any shortlist
  const isShortlisted = shortlists.some((s) =>
    s.items?.some((item) => item.creatorId === creator.id)
  );

  const estimatedReelFee = estimateReelCost(creator);
  const platformUrl = creator.profileUrl || getCreatorPlatformUrl(creator);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!creator.businessEmail) return;
    navigator.clipboard.writeText(creator.businessEmail);
    setCopiedEmail(true);
    toast.success(`Copied ${creator.businessEmail} to clipboard!`);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#0C0E12] border border-white/[0.08] p-4 hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl h-full w-full min-w-0"
    >
      <div>
        {/* 1. Header Row: Avatar, Name, Handle, City & External Platform Icon */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* 44px circular avatar with crisp ring border */}
            <div className="relative h-11 w-11 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0 bg-gradient-to-tr from-emerald-950 via-zinc-900 to-indigo-950 flex items-center justify-center">
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
                <span className="font-mono text-xs font-bold text-white uppercase tracking-tight">
                  {creator.fullName ? creator.fullName.slice(0, 2).toUpperCase() : 'CB'}
                </span>
              )}
            </div>

            {/* Creator Identity, City & Niche */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <h3 className="font-bold text-sm text-white truncate font-sans tracking-tight" title={creator.fullName}>
                  {creator.fullName}
                </h3>
                {creator.isVerified && (
                  <span title="Verified Audience Reach" className="text-emerald-400 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 mt-0.5 min-w-0 overflow-hidden">
                <a
                  href={platformUrl}
                  {...EXTERNAL_LINK_PROPS}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-zinc-400 font-mono truncate hover:text-emerald-400 transition-colors shrink-0 max-w-[110px]"
                  title={`Open canonical @${creator.handle}`}
                >
                  @{creator.handle}
                </a>
                <span className="text-[10px] text-zinc-600 font-mono shrink-0">•</span>
                <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-0.5 shrink-0">
                  <MapPin className="w-3 h-3 text-emerald-400/80 shrink-0" />
                  <span className="truncate max-w-[80px]">{creator.city}</span>
                </span>
                {creator.niche && (
                  <>
                    <span className="text-[10px] text-zinc-600 font-mono shrink-0">•</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.08] truncate max-w-[90px] shrink-0">
                      {creator.niche}
                    </span>
                  </>
                )}
                {creator.gender && creator.gender !== 'UNSPECIFIED' && (
                  <>
                    <span className="text-[10px] text-zinc-600 font-mono shrink-0">•</span>
                    <span
                      title={creator.gender === 'MALE' ? 'Male Creator' : 'Female Creator'}
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 font-medium ${
                        creator.gender === 'FEMALE'
                          ? 'text-pink-300 bg-pink-500/10 border border-pink-500/20'
                          : 'text-sky-300 bg-sky-500/10 border border-sky-500/20'
                      }`}
                    >
                      {creator.gender === 'FEMALE' ? '♀ Female' : '♂ Male'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Top-Right Controls: Selection Checkbox & Platform Icon */}
          <div className="flex items-center gap-2 shrink-0">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(creator.id)}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer h-4 w-4 shrink-0"
                aria-label={`Select ${creator.fullName}`}
              />
            )}
            <a
              href={platformUrl}
              {...EXTERNAL_LINK_PROPS}
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-[#08090C] hover:border-white/20 transition-all shrink-0 hover:scale-105"
              title={`Open verified ${creator.platform === 'YOUTUBE' ? 'YouTube' : 'Instagram'} profile`}
            >
              {creator.platform === 'INSTAGRAM' ? (
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
              ) : (
                <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
              )}
            </a>
          </div>
        </div>

        {/* 2. Three-Column Key Telemetry Strip (Linear / Stripe Caliber) */}
        <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.05] my-3 grid grid-cols-3 gap-1 text-center">
          {/* Column 1: Followers */}
          <div className="pr-1 border-r border-white/[0.04]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">
              Followers
            </span>
            <span className="font-mono font-semibold text-white text-xs sm:text-sm block mt-0.5">
              {formatFollowers(creator.followerCount)}
            </span>
          </div>

          {/* Column 2: Engagement */}
          <div className="px-1 border-r border-white/[0.04]">
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">
              Eng. Rate
            </span>
            <span className="font-mono font-semibold text-emerald-400 text-xs sm:text-sm block mt-0.5">
              {formatPercentage(creator.engagementRate)}
            </span>
          </div>

          {/* Column 3: Est. Reel INR Rate */}
          <div className="pl-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">
              Est. Reel
            </span>
            <span className="font-mono font-semibold text-zinc-200 text-xs sm:text-sm block mt-0.5">
              {formatCompactINR(estimatedReelFee)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Footer Action Row: Direct Email Status + Action Buttons */}
      <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Direct Collab Email pill with 1-click copy */}
        <div className="shrink-0 min-w-0">
          {creator.businessEmail ? (
            <button
              type="button"
              onClick={handleCopyEmail}
              className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1.5 rounded-md border transition-all whitespace-nowrap shrink-0 ${
                copiedEmail
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20 hover:bg-emerald-900/40 hover:text-emerald-300'
              }`}
              title={`Click to copy: ${creator.businessEmail}`}
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="whitespace-nowrap">⚡ Email Ready</span>
                </>
              )}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-white/[0.02] border border-white/[0.04] px-2 py-1.5 rounded-md whitespace-nowrap shrink-0">
              <span>Direct DM</span>
            </span>
          )}
        </div>

        {/* Right: Inspect & Shortlist CTAs */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => dispatch(setDetailModalCreator(creator))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-[11px] font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-98 whitespace-nowrap shrink-0"
            title="Inspect full analytics & demographic breakdown"
          >
            <BarChart2 className="w-3 h-3 text-zinc-400 shrink-0" />
            <span>Inspect</span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setQuickAddCreator(creator))}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all active:scale-98 shadow-sm whitespace-nowrap shrink-0 ${
              isShortlisted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {isShortlisted ? (
              <>
                <Check className="w-3 h-3 stroke-[3] shrink-0" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 stroke-[2.5] shrink-0" />
                <span>Shortlist</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
