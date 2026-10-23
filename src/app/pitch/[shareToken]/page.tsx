'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PitchData, PitchCreator } from '@/types';
import api from '@/lib/api';
import { formatFollowers, formatINR, formatPercentage, getCreatorPlatformUrl, EXTERNAL_LINK_PROPS } from '@/lib/utils';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  MapPin,
  TrendingUp,
  Users,
  ShieldCheck,
  Check,
  X,
  MessageSquare,
  Building2,
  ExternalLink,
  Copy,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicPitchPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = use(params);

  const [pitch, setPitch] = useState<PitchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local state for creator approval statuses and feedback notes
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [clientNotesState, setClientNotesState] = useState<Record<string, string>>({});

  const fetchPitch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/public/pitch/${shareToken}`);
      if (res.data.success && res.data.data) {
        setPitch(res.data.data);
        const notesMap: Record<string, string> = {};
        res.data.data.creators.forEach((c: PitchCreator) => {
          notesMap[c.creatorId] = c.clientNotes || '';
        });
        setClientNotesState(notesMap);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Pitch roster not found, expired, or disabled by the agency.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shareToken) {
      fetchPitch();
    }
  }, [shareToken]);

  const handleUpdateStatus = async (
    creatorId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING'
  ) => {
    if (!pitch) return;
    try {
      setUpdatingId(creatorId);
      const currentNote = clientNotesState[creatorId] || '';
      const res = await api.patch(
        `/public/pitch/${shareToken}/creators/${creatorId}`,
        {
          status,
          notes: currentNote.trim() || undefined,
        }
      );

      if (res.data.success) {
        setPitch((prev) => {
          if (!prev) return prev;
          const updatedCreators = prev.creators.map((c) =>
            c.creatorId === creatorId
              ? { ...c, clientApprovalStatus: status, clientNotes: currentNote }
              : c
          );
          const approvedCount = updatedCreators.filter(
            (c) => c.clientApprovalStatus === 'APPROVED'
          ).length;
          const approvedBudgetINR = updatedCreators
            .filter((c) => c.clientApprovalStatus === 'APPROVED')
            .reduce((sum, c) => sum + (c.assignedFeeINR || 0), 0);

          return {
            ...prev,
            approvedCount,
            approvedBudgetINR,
            creators: updatedCreators,
          };
        });

        toast.success(
          status === 'APPROVED'
            ? 'Creator approved for campaign ✅'
            : status === 'REJECTED'
            ? 'Creator declined ❌'
            : 'Status reset to pending ⏳'
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update creator status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNote = async (creatorId: string) => {
    if (!pitch) return;
    const currentNote = clientNotesState[creatorId] || '';
    const creator = pitch.creators.find((c) => c.creatorId === creatorId);
    if (!creator) return;

    try {
      setUpdatingId(creatorId);
      const res = await api.patch(
        `/public/pitch/${shareToken}/creators/${creatorId}`,
        {
          status: creator.clientApprovalStatus,
          notes: currentNote.trim(),
        }
      );

      if (res.data.success) {
        toast.success('Feedback note saved successfully');
      }
    } catch (err: any) {
      toast.error('Failed to save feedback note');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="font-mono text-xs text-zinc-400 tracking-wider uppercase">
            Loading Pitch Roster...
          </span>
        </div>
      </div>
    );
  }

  if (error || !pitch) {
    return (
      <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-2xl bg-[#111317] border border-[#262930] p-8 space-y-4 shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-sans">
            Pitch Roster Unavailable
          </h2>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            {error || 'This pitch link has expired or has been disabled by the agency.'}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-mono font-bold text-zinc-950 hover:bg-emerald-400 transition-colors"
            >
              <span>Visit CreatorBase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const approvedPercent = pitch.creatorCount > 0
    ? Math.round((pitch.approvedCount / pitch.creatorCount) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#08090B] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 pb-28">
      {/* Background glow & tech grid */}
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-40 -z-10" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-600/10 via-teal-500/5 to-indigo-600/10 blur-[140px]" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#24272E] bg-[#0E1014]/90 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20">
                <Sparkles className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white font-sans">
                CreatorBase
              </span>
            </Link>
            <span className="text-zinc-600 font-mono text-xs">/</span>
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Client Review Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Interactive Review Session
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Pitch portal link copied to clipboard! 📋');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-mono text-zinc-300 hover:text-white hover:border-emerald-500/50 transition-colors"
              title="Copy link to clipboard"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Pitch Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Pitch Hero Header */}
        <div className="rounded-2xl bg-[#111317] border border-[#24272E] p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  Talent Pitch Roster
                </span>
                {pitch.campaignTitle && (
                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/40 px-2.5 py-0.5 rounded border border-indigo-700/40">
                    Campaign: {pitch.campaignTitle}
                  </span>
                )}
                {pitch.campaignTargetCity && (
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {pitch.campaignTargetCity}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                {pitch.shortlistName}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                Curated and verified by <strong className="text-zinc-200">{pitch.agencyName}</strong>
              </p>
            </div>

            {/* Header Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 shrink-0">
              <div className="rounded-xl bg-[#0B0C0E] border border-[#24272E] p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Talent</span>
                <span className="text-base sm:text-lg font-bold font-mono text-white">
                  {pitch.creatorCount} Creators
                </span>
              </div>
              <div className="rounded-xl bg-[#0B0C0E] border border-[#24272E] p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Reach</span>
                <span className="text-base sm:text-lg font-bold font-mono text-indigo-300">
                  {formatFollowers(pitch.totalFollowers)}
                </span>
              </div>
              <div className="rounded-xl bg-[#0B0C0E] border border-[#24272E] p-3 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Est. Budget</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  {formatINR(pitch.totalEstimatedCostINR)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#20232A] flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>
              Instructions: Review each creator candidate below. Tap <strong className="text-emerald-400">Approve</strong> or <strong className="text-rose-400">Decline</strong> to update the agency in real time.
            </span>
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pitch.creators.map((c) => {
            const isApproved = c.clientApprovalStatus === 'APPROVED';
            const isRejected = c.clientApprovalStatus === 'REJECTED';
            const isPending = c.clientApprovalStatus === 'PENDING';
            const isUpdating = updatingId === c.creatorId;

            return (
              <motion.div
                key={c.creatorId}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl transition-all duration-200 p-5 flex flex-col justify-between shadow-lg relative overflow-hidden ${
                  isApproved
                    ? 'bg-[#0E1511] border-2 border-emerald-500/70 shadow-emerald-950/20'
                    : isRejected
                    ? 'bg-[#140D0E] border-2 border-rose-500/50 opacity-75'
                    : 'bg-[#111317] border border-[#24272E] hover:border-zinc-700'
                }`}
              >
                <div>
                  {/* Top Status Tag */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#20232A]">
                    <div className="flex items-center gap-1.5">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Approved by Client</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          <span>Declined</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Pending Review</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md border bg-emerald-950/60 border-emerald-500/40 text-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{c.authenticityScore}% Score</span>
                    </span>
                  </div>

                  {/* Creator Identity with Verified Live Link */}
                  <div className="flex items-start gap-3 mt-3.5">
                    <a
                      href={getCreatorPlatformUrl(c)}
                      {...EXTERNAL_LINK_PROPS}
                      className="relative h-12 w-12 rounded-xl overflow-hidden border border-zinc-700 shrink-0 bg-zinc-900 transition-transform hover:scale-105"
                      title={`Visit @${c.handle} on live platform`}
                    >
                      <Image
                        src={c.avatarUrl}
                        alt={c.fullName}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </a>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={getCreatorPlatformUrl(c)}
                          {...EXTERNAL_LINK_PROPS}
                          className="font-bold text-sm text-white truncate tracking-tight font-sans hover:text-emerald-400 hover:underline transition-colors"
                          title="Open verified profile"
                        >
                          {c.fullName}
                        </a>
                        {c.isVerified && (
                          <span title="Audited & Platform Verified Reach" className="inline-flex items-center text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <a
                          href={getCreatorPlatformUrl(c)}
                          {...EXTERNAL_LINK_PROPS}
                          className="text-xs text-zinc-400 font-mono truncate hover:text-emerald-400 hover:underline"
                        >
                          @{c.handle}
                        </a>
                        <span className="text-zinc-600 font-mono text-[10px]">•</span>
                        <span className="text-[11px] text-zinc-400 flex items-center gap-0.5 shrink-0 font-mono">
                          <MapPin className="w-3 h-3 text-emerald-400/80" />
                          {c.city}
                        </span>
                      </div>
                    </div>

                    <a
                      href={getCreatorPlatformUrl(c)}
                      {...EXTERNAL_LINK_PROPS}
                      className="shrink-0 transition-transform hover:scale-110"
                      title={`Open on ${c.platform === 'YOUTUBE' ? 'YouTube' : 'Instagram'}`}
                    >
                      {c.platform === 'INSTAGRAM' ? (
                        <div className="p-1.5 rounded-lg bg-pink-950/40 text-pink-400 border border-pink-800/40 hover:border-pink-500/60 transition-colors">
                          <InstagramIcon className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:border-rose-500/60 transition-colors">
                          <YoutubeIcon className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </a>
                  </div>

                  {/* Niche & Location Pills */}
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#181A1F] border border-[#2E333D] text-zinc-300">
                      {c.niche}
                    </span>
                    {c.state && (
                      <span className="text-[10px] font-mono text-zinc-500">
                        {c.state}
                      </span>
                    )}
                  </div>

                  {/* 3-Column Metrics Bar */}
                  <div className="mt-3.5 grid grid-cols-3 gap-1.5 rounded-xl bg-[#0B0C0E] p-2.5 border border-[#20232A]">
                    <div className="text-center">
                      <span className="text-[10px] text-zinc-500 font-mono block">Followers</span>
                      <p className="font-mono font-bold text-xs sm:text-sm text-zinc-100 mt-0.5">
                        {formatFollowers(c.followerCount)}
                      </p>
                    </div>
                    <div className="text-center border-x border-[#20232A]">
                      <span className="text-[10px] text-zinc-500 font-mono block">Eng. Rate</span>
                      <p className="font-mono font-bold text-xs sm:text-sm text-emerald-400 mt-0.5">
                        {formatPercentage(c.engagementRate)}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-zinc-500 font-mono block">Commercial Fee</span>
                      <p className="font-mono font-bold text-xs sm:text-sm text-zinc-200 mt-0.5">
                        {c.assignedFeeINR ? formatINR(c.assignedFeeINR) : 'Negotiating'}
                      </p>
                    </div>
                  </div>

                  {/* Agency Note if present */}
                  {c.agencyNotes && (
                    <div className="mt-3 p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-900/30">
                      <span className="text-[10px] font-mono uppercase text-indigo-400 block font-semibold">
                        Agency Deliverable Brief:
                      </span>
                      <p className="text-xs text-zinc-300 font-mono mt-0.5 leading-relaxed">
                        {c.agencyNotes}
                      </p>
                    </div>
                  )}

                  {/* Client Feedback Input */}
                  <div className="mt-3 space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-zinc-500" />
                      Client Feedback / Comments:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. Approved for Reel #1. Check brand safety..."
                        value={clientNotesState[c.creatorId] || ''}
                        onChange={(e) =>
                          setClientNotesState((prev) => ({
                            ...prev,
                            [c.creatorId]: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-lg bg-[#0B0C0E] border border-[#262930] px-2.5 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveNote(c.creatorId)}
                        disabled={isUpdating}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-zinc-200 border border-zinc-700 transition-colors shrink-0"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* Approve / Decline Buttons */}
                <div className="mt-4 pt-3 border-t border-[#20232A] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(c.creatorId, 'APPROVED')}
                    disabled={isUpdating}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-mono font-bold transition-all ${
                      isApproved
                        ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                        : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(c.creatorId, 'REJECTED')}
                    disabled={isUpdating}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-mono font-bold transition-all ${
                      isRejected
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                        : 'bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border border-rose-800/30'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>

                  {!isPending && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(c.creatorId, 'PENDING')}
                      disabled={isUpdating}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                      title="Reset to Pending"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Floating Sticky Live Tally Banner */}
      <div className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-40">
        <div className="rounded-2xl bg-[#0E1014]/95 backdrop-blur-xl border border-[#2E333D] p-3.5 sm:p-4 shadow-2xl flex items-center justify-between gap-3 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                {pitch.approvedCount} of {pitch.creatorCount} Approved
              </span>
              <span className="text-zinc-500">({approvedPercent}%)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span>Approved Spend:</span>
              <span className="font-bold text-emerald-400">
                {formatINR(pitch.approvedBudgetINR)}
              </span>
              <span>of {formatINR(pitch.totalEstimatedCostINR)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block w-28 h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${approvedPercent}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                toast.success('Your decisions are synced automatically with the agency!');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 shrink-0 font-mono"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Decisions Synced</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
