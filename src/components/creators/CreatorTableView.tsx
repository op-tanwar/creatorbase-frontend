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
import { PAN_INDIA_CITY_MAP, PAN_INDIA_NICHE_MAP } from '@/lib/constants';
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
  Bookmark,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuickAddCreator, setDetailModalCreator } from '@/store/slices/shortlistSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CreatorTableViewProps {
  creators: Creator[];
  isLoading: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkShortlist: () => void;
}

export function CreatorTableView({
  creators,
  isLoading,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onBulkShortlist,
}: CreatorTableViewProps) {
  const dispatch = useAppDispatch();
  const shortlists = useAppSelector((state) => state.shortlists.shortlists);

  // Email copy state tracking
  const [copiedEmailMap, setCopiedEmailMap] = useState<Record<string, boolean>>({});

  const handleCopyEmail = (e: React.MouseEvent, email: string, creatorId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmailMap((prev) => ({ ...prev, [creatorId]: true }));
    toast.success(`Copied ${email} to clipboard!`);
    setTimeout(() => {
      setCopiedEmailMap((prev) => ({ ...prev, [creatorId]: false }));
    }, 2000);
  };

  const isAllSelected = creators.length > 0 && selectedIds.length === creators.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < creators.length;

  return (
    <div className="relative w-full space-y-4">
      {/* ============================================================= */}
      {/* HIGH-DENSITY LINEAR-STYLE DATA TABLE                          */}
      {/* ============================================================= */}
      <div className="w-full overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0C0E12]/90 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <table className="w-full text-left border-collapse min-w-[1050px]">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {/* Checkbox */}
              <th className="w-12 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={onSelectAll}
                  aria-label="Select all creators on page"
                  className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer h-4 w-4"
                />
              </th>
              <th className="px-3 py-3">Creator</th>
              <th className="px-3 py-3">Platform</th>
              <th className="px-3 py-3">City / Hub</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Followers</th>
              <th className="px-3 py-3">Engagement</th>
              <th className="px-3 py-3">Est. Reel Rate</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-white/[0.04] text-xs font-mono">
            {creators.map((creator) => {
              const isSelected = selectedIds.includes(creator.id);
              const isShortlisted = shortlists.some((s) =>
                s.items?.some((item) => item.creatorId === creator.id)
              );
              const platformUrl = getCreatorPlatformUrl(creator);
              const estimatedReel = estimateReelCost(creator);
              const cityMeta = PAN_INDIA_CITY_MAP[creator.city.toLowerCase().replace(/ /g, '-')];
              const nicheKey = Object.keys(PAN_INDIA_NICHE_MAP).find(
                (k) => PAN_INDIA_NICHE_MAP[k].label === creator.niche
              );
              const nicheIcon = nicheKey ? PAN_INDIA_NICHE_MAP[nicheKey].icon : '⚡';

              // Visual follower progress bar (relative to 1M cap)
              const followerProgress = Math.min(
                100,
                Math.max(8, (creator.followerCount / 1000000) * 100)
              );

              // ER Badge coloring
              const er = creator.engagementRate || 0;
              const erBadgeClass =
                er >= 4.0
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-bold'
                  : er >= 2.0
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-zinc-500/10 text-zinc-400 border-white/[0.08]';

              return (
                <tr
                  key={creator.id}
                  onClick={() => dispatch(setDetailModalCreator(creator))}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/[0.07] hover:bg-emerald-500/[0.1]'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Checkbox */}
                  <td
                    className="w-12 px-4 py-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(creator.id)}
                      aria-label={`Select ${creator.fullName}`}
                      className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer h-4 w-4"
                    />
                  </td>

                  {/* Creator Identity */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-9 w-9 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0 bg-gradient-to-tr from-emerald-950 via-zinc-900 to-indigo-950 flex items-center justify-center">
                        {creator.avatarUrl ? (
                          <Image
                            src={creator.avatarUrl}
                            alt={creator.fullName}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="font-mono text-xs font-bold text-white uppercase">
                            {creator.fullName.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-sans font-semibold text-white truncate max-w-[150px] group-hover:text-emerald-300 transition-colors">
                            {creator.fullName}
                          </span>
                          {creator.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 block truncate max-w-[150px]">
                          @{creator.handle}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={platformUrl}
                      {...EXTERNAL_LINK_PROPS}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-zinc-300 hover:text-white hover:border-emerald-500/40 transition-colors"
                    >
                      {creator.platform === 'INSTAGRAM' ? (
                        <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                      ) : (
                        <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span className="text-[11px] capitalize">
                        {creator.platform.toLowerCase()}
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                    </a>
                  </td>

                  {/* City / Hub */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 text-zinc-300">
                      <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span className="truncate max-w-[120px]">{creator.city}</span>
                      {cityMeta?.tier && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-white/[0.05] text-zinc-400 shrink-0">
                          T{cityMeta.tier}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] text-zinc-300 max-w-[130px] truncate">
                      <span>{nicheIcon}</span>
                      <span className="truncate">{creator.niche}</span>
                    </span>
                  </td>

                  {/* Followers + Mini Bar */}
                  <td className="px-3 py-3">
                    <div className="space-y-1 min-w-[90px]">
                      <span className="font-bold text-white block">
                        {formatFollowers(creator.followerCount)}
                      </span>
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${followerProgress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Engagement Rate */}
                  <td className="px-3 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] border ${erBadgeClass}`}
                    >
                      {formatPercentage(creator.engagementRate)}
                    </span>
                  </td>

                  {/* Est. Reel Rate */}
                  <td className="px-3 py-3">
                    <span className="font-bold text-emerald-400 text-xs">
                      {formatCompactINR(estimatedReel)}
                    </span>
                  </td>

                  {/* Direct Contact */}
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    {creator.businessEmail ? (
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCopyEmail(e, creator.businessEmail!, creator.id)
                        }
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                        title={creator.businessEmail}
                      >
                        {copiedEmailMap[creator.id] ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-emerald-400" />
                            <span className="max-w-[100px] truncate">
                              {creator.businessEmail}
                            </span>
                            <Copy className="w-2.5 h-2.5 text-emerald-400/70" />
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-500">DM Only</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Inspect */}
                      <button
                        type="button"
                        onClick={() => dispatch(setDetailModalCreator(creator))}
                        className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                        title="Inspect Analytics"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Shortlist */}
                      <button
                        type="button"
                        onClick={() => dispatch(setQuickAddCreator(creator))}
                        className={`h-7 px-2.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1 border transition-all ${
                          isShortlisted
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {isShortlisted ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Shortlist</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ============================================================= */}
      {/* FLOATING BULK SELECTION DOCK (Linear Style)                   */}
      {/* ============================================================= */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0C0E12]/95 backdrop-blur-2xl border border-emerald-500/40 rounded-full px-5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(16,185,129,0.25)] flex items-center gap-4 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-black text-[10px] font-bold">
                ✓
              </span>
              <span className="text-white font-bold">
                {selectedIds.length} creator{selectedIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="h-4 w-px bg-white/[0.15]" />

            <button
              type="button"
              onClick={onBulkShortlist}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>+ Add to Shortlist</span>
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/[0.08] transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
