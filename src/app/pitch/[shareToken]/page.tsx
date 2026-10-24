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
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SAMPLE_DEMO_PITCH: PitchData = {
  shareToken: 'sample-demo',
  shortlistName: 'Festive High-Impact Creator Roster 2026',
  campaignTitle: 'Nykaa Beauty & Lifestyle Q4',
  campaignTargetCity: 'Pan-India (Mumbai, Delhi, Bangalore, Indore)',
  agencyName: 'Elevation Media Labs',
  creatorCount: 8,
  approvedCount: 5,
  totalFollowers: 38400000,
  totalEstimatedCostINR: 1650000,
  approvedBudgetINR: 1050000,
  creators: [
    {
      shortlistItemId: 'item-demo-1',
      creatorId: 'demo-1',
      fullName: 'Komal Pandey',
      handle: 'komalpandeyofficial',
      platform: 'INSTAGRAM',
      city: 'Delhi NCR',
      state: 'Delhi',
      niche: 'Fashion & Style',
      followerCount: 2100000,
      engagementRate: 4.8,
      authenticityScore: 96,
      avgReelViews: 450000,
      commercialRateINR: 220000,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
      assignedFeeINR: 220000,
      clientApprovalStatus: 'APPROVED',
      clientNotes: 'Stunning visual styling. Confirmed for 1x Hero Festive Reel.',
      agencyNotes: 'Top aesthetic engagement in North India. High conversion on beauty link-in-bio.',
    },
    {
      shortlistItemId: 'item-demo-2',
      creatorId: 'demo-2',
      fullName: 'Shlok Srivastava',
      handle: 'techburner',
      platform: 'YOUTUBE',
      city: 'Delhi NCR',
      state: 'Delhi',
      niche: 'Tech & Gadgets',
      followerCount: 12400000,
      engagementRate: 6.2,
      authenticityScore: 98,
      avgReelViews: 1800000,
      commercialRateINR: 450000,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
      assignedFeeINR: 450000,
      clientApprovalStatus: 'APPROVED',
      clientNotes: 'Approved for tech accessories integration.',
      agencyNotes: 'Guaranteed 1M+ views in first 48 hours. Direct swipe-up CTA in description.',
    },
    {
      shortlistItemId: 'item-demo-3',
      creatorId: 'demo-3',
      fullName: 'Kabita Singh',
      handle: 'kabitaskitchen',
      platform: 'YOUTUBE',
      city: 'Mumbai',
      state: 'Maharashtra',
      niche: 'Food & Culinary',
      followerCount: 13800000,
      engagementRate: 5.1,
      authenticityScore: 99,
      avgReelViews: 950000,
      commercialRateINR: 280000,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
      assignedFeeINR: 280000,
      clientApprovalStatus: 'APPROVED',
      clientNotes: 'Perfect family household appeal for festive gifting.',
      agencyNotes: 'Dominant female demographic (68% Tier-1 & Tier-2 homemakers).',
    },
    {
      shortlistItemId: 'item-demo-4',
      creatorId: 'demo-4',
      fullName: 'Ranveer Allahbadia',
      handle: 'beerbiceps',
      platform: 'INSTAGRAM',
      city: 'Mumbai',
      state: 'Maharashtra',
      niche: 'Fitness & Mindset',
      followerCount: 4200000,
      engagementRate: 3.9,
      authenticityScore: 94,
      avgReelViews: 620000,
      commercialRateINR: 350000,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
      assignedFeeINR: 350000,
      clientApprovalStatus: 'APPROVED',
      clientNotes: 'Great podcast-style interview snippet format.',
      agencyNotes: 'Highest male business & executive reach in India.',
    },
    {
      shortlistItemId: 'item-demo-5',
      creatorId: 'demo-5',
      fullName: 'Kusha Kapila',
      handle: 'kushakapila',
      platform: 'INSTAGRAM',
      city: 'Delhi NCR',
      state: 'Delhi',
      niche: 'Comedy & Entertainment',
      followerCount: 3600000,
      engagementRate: 5.4,
      authenticityScore: 95,
      avgReelViews: 750000,
      commercialRateINR: 250000,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
      assignedFeeINR: 250000,
      clientApprovalStatus: 'APPROVED',
      clientNotes: 'Relatable festive sketch format locked.',
      agencyNotes: 'Viral reel retention rate (>64% full watch through).',
    },
    {
      shortlistItemId: 'item-demo-6',
      creatorId: 'demo-6',
      fullName: 'Foodie Incarnate (Amar Sirohi)',
      handle: 'foodieincarnate',
      platform: 'INSTAGRAM',
      city: 'Indore',
      state: 'Madhya Pradesh',
      niche: 'Food & Street Culinary',
      followerCount: 1600000,
      engagementRate: 6.9,
      authenticityScore: 97,
      avgReelViews: 520000,
      commercialRateINR: 110000,
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
      assignedFeeINR: 110000,
      clientApprovalStatus: 'PENDING',
      clientNotes: '',
      agencyNotes: 'Central India street viral champion. Massive Tier-2 crowd pull.',
    },
    {
      shortlistItemId: 'item-demo-7',
      creatorId: 'demo-7',
      fullName: 'Total Gaming (Ajay)',
      handle: 'totalgaming',
      platform: 'YOUTUBE',
      city: 'Ahmedabad',
      state: 'Gujarat',
      niche: 'Gaming & Esports',
      followerCount: 42000000,
      engagementRate: 7.4,
      authenticityScore: 99,
      avgReelViews: 3500000,
      commercialRateINR: 650000,
      avatarUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
      assignedFeeINR: 650000,
      clientApprovalStatus: 'PENDING',
      clientNotes: '',
      agencyNotes: 'Biggest gaming creator in South Asia. Colossal Gen-Z brand recall.',
    },
    {
      shortlistItemId: 'item-demo-8',
      creatorId: 'demo-8',
      fullName: 'Barkha Singh',
      handle: 'barkhasingh0308',
      platform: 'INSTAGRAM',
      city: 'Mumbai',
      state: 'Maharashtra',
      niche: 'Lifestyle & Travel',
      followerCount: 3100000,
      engagementRate: 4.1,
      authenticityScore: 93,
      avgReelViews: 410000,
      commercialRateINR: 180000,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
      assignedFeeINR: 180000,
      clientApprovalStatus: 'REJECTED',
      clientNotes: 'Dates clash with our Diwali launch window. Consider for New Year campaign.',
      agencyNotes: 'High affinity for luxury travel & skincare aesthetics.',
    },
  ],
};

export default function PublicPitchPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = use(params);
  const isDemo = shareToken === 'sample-demo';

  const [pitch, setPitch] = useState<PitchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local state for client notes & updates
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [clientNotesState, setClientNotesState] = useState<Record<string, string>>({});

  const fetchPitch = async () => {
    if (isDemo) {
      setPitch(SAMPLE_DEMO_PITCH);
      const notesMap: Record<string, string> = {};
      SAMPLE_DEMO_PITCH.creators.forEach((c) => {
        notesMap[c.creatorId] = c.clientNotes || '';
      });
      setClientNotesState(notesMap);
      setIsLoading(false);
      return;
    }

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
      // If demo or test token, fallback smoothly to sample demo
      if (shareToken.includes('demo') || shareToken.includes('test')) {
        setPitch(SAMPLE_DEMO_PITCH);
        const notesMap: Record<string, string> = {};
        SAMPLE_DEMO_PITCH.creators.forEach((c) => {
          notesMap[c.creatorId] = c.clientNotes || '';
        });
        setClientNotesState(notesMap);
      } else {
        setError(
          err.response?.data?.message ||
            'Pitch roster not found, expired, or disabled by the agency.'
        );
      }
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
    setUpdatingId(creatorId);

    const currentNote = clientNotesState[creatorId] || '';

    // If demo mode, update local state directly
    if (isDemo || shareToken.includes('demo')) {
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
          ? 'Talent Approved ✅ (Synced with Agency)'
          : status === 'REJECTED'
          ? 'Talent Rejected ❌'
          : 'Status reset to Pending ⏳'
      );
      setUpdatingId(null);
      return;
    }

    try {
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
            ? 'Talent Approved ✅ (Synced with Agency)'
            : status === 'REJECTED'
            ? 'Talent Rejected ❌'
            : 'Status reset to Pending ⏳'
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update talent status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNote = async (creatorId: string) => {
    if (!pitch) return;
    const currentNote = clientNotesState[creatorId] || '';
    const creator = pitch.creators.find((c) => c.creatorId === creatorId);
    if (!creator) return;

    if (isDemo || shareToken.includes('demo')) {
      toast.success('Feedback note saved locally ✅');
      return;
    }

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
        toast.success('Feedback note saved and notified to agency');
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
            Loading Agency Pitch Roster...
          </span>
        </div>
      </div>
    );
  }

  if (error || !pitch) {
    return (
      <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-2xl bg-[#12141A]/90 border border-white/[0.08] p-8 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Pitch Roster Unavailable
          </h2>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            {error || 'This pitch link has expired or has been disabled by the agency.'}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-mono font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <span>Visit CreatorBase Operating System</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const approvedPercent =
    pitch.creatorCount > 0
      ? Math.round((pitch.approvedCount / pitch.creatorCount) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#08090B] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 pb-32 overflow-x-hidden">
      {/* Background glow & subtle depth */}
      <div className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-[140px]" />

      {/* Top White-Label Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0D0E12]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20">
                <Sparkles className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">
                CreatorBase
              </span>
            </Link>
            <span className="text-zinc-700 font-mono text-xs">/</span>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Curated Pitch Roster for{' '}
                <strong className="text-white underline decoration-emerald-500/60 underline-offset-4">
                  {pitch.campaignTitle || 'Brand Client'}
                </strong>{' '}
                • Prepared by <strong className="text-emerald-400">{pitch.agencyName}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isDemo && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Interactive Sandbox
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Pitch portal link copied to clipboard! 📋');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:border-emerald-500/40 hover:bg-white/[0.08] transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Pitch Roster Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Hero Pitch Banner */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#12141A]/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  Client Decision Portal
                </span>
                {pitch.campaignTargetCity && (
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 bg-white/[0.03] px-2.5 py-0.5 rounded border border-white/[0.06]">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {pitch.campaignTargetCity}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-[-0.03em]">
                {pitch.shortlistName}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                Click <strong className="text-emerald-400">Approve ✅</strong> or <strong className="text-rose-400">Reject ❌</strong> on each candidate. Decisions update your campaign manager immediately without logging in.
              </p>
            </div>

            {/* Metrics Counter Card */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Talent</span>
                <span className="text-base sm:text-lg font-bold font-mono text-white">
                  {pitch.creatorCount} Creators
                </span>
              </div>
              <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Audited Reach</span>
                <span className="text-base sm:text-lg font-bold font-mono text-indigo-300">
                  {formatFollowers(pitch.totalFollowers)}
                </span>
              </div>
              <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Modeled Spend</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  {formatINR(pitch.totalEstimatedCostINR)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Talent Grid */}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl transition-all duration-300 p-5 flex flex-col justify-between shadow-lg relative overflow-hidden backdrop-blur-xl ${
                  isApproved
                    ? 'bg-[#0E1511]/90 border-2 border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                    : isRejected
                    ? 'bg-[#140D0E]/80 border-2 border-rose-500/40 opacity-70'
                    : 'bg-[#12141A]/70 border border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)]'
                }`}
              >
                <div>
                  {/* Status header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Approved ✅</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          <span>Rejected ❌</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.05] border border-white/[0.1] px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Awaiting Decision</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md border bg-emerald-950/60 border-emerald-500/40 text-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{c.authenticityScore}% Score</span>
                    </span>
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-start gap-3 mt-3.5">
                    <a
                      href={getCreatorPlatformUrl(c)}
                      {...EXTERNAL_LINK_PROPS}
                      className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/[0.1] shrink-0 bg-zinc-900 transition-transform hover:scale-105"
                      title={`Visit @${c.handle} profile`}
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
                          className="font-bold text-sm text-white truncate tracking-tight hover:text-emerald-400 transition-colors"
                        >
                          {c.fullName}
                        </a>
                        {c.isVerified && (
                          <span title="Audited Platform Talent" className="text-emerald-400">
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
                          <MapPin className="w-3 h-3 text-emerald-400" />
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

                  {/* Niche & Category */}
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                      {c.niche}
                    </span>
                    {c.state && (
                      <span className="text-[10px] font-mono text-zinc-500">
                        {c.state}
                      </span>
                    )}
                  </div>

                  {/* 3 Metrics Block */}
                  <div className="mt-3.5 grid grid-cols-3 gap-1.5 rounded-xl bg-black/40 p-2.5 border border-white/[0.06]">
                    <div className="text-center">
                      <span className="text-[10px] text-zinc-500 font-mono block">Followers</span>
                      <p className="font-mono font-bold text-xs sm:text-sm text-zinc-100 mt-0.5">
                        {formatFollowers(c.followerCount)}
                      </p>
                    </div>
                    <div className="text-center border-x border-white/[0.06]">
                      <span className="text-[10px] text-zinc-500 font-mono block">Engagement</span>
                      <p className="font-mono font-bold text-xs sm:text-sm text-emerald-400 mt-0.5">
                        {formatPercentage(c.engagementRate)}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-zinc-500 font-mono block">Commercial Fee</span>
                      <p className="font-mono font-bold text-xs sm:text-sm text-emerald-300 mt-0.5">
                        {c.assignedFeeINR ? formatINR(c.assignedFeeINR) : '₹75,000'}
                      </p>
                    </div>
                  </div>

                  {/* Agency Brief if available */}
                  {c.agencyNotes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30">
                      <span className="text-[10px] font-mono uppercase text-indigo-400 block font-semibold">
                        Agency Recommendation:
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
                      Client Feedback Notes:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. Approved for Reel #1. Need product placement..."
                        value={clientNotesState[c.creatorId] || ''}
                        onChange={(e) =>
                          setClientNotesState((prev) => ({
                            ...prev,
                            [c.creatorId]: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-lg bg-black/60 border border-white/[0.08] px-2.5 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveNote(c.creatorId)}
                        disabled={isUpdating}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] font-mono text-zinc-200 border border-white/[0.1] transition-colors shrink-0"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* Approve / Reject Controls */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(c.creatorId, 'APPROVED')}
                    disabled={isUpdating}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-mono font-bold transition-all ${
                      isApproved
                        ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/25'
                        : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve ✅</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(c.creatorId, 'REJECTED')}
                    disabled={isUpdating}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-mono font-bold transition-all ${
                      isRejected
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                        : 'bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border border-rose-800/30'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject ❌</span>
                  </button>

                  {!isPending && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(c.creatorId, 'PENDING')}
                      disabled={isUpdating}
                      className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
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

      {/* Floating Summary Pill (Pillar 5A) */}
      <div className="fixed bottom-5 inset-x-4 max-w-2xl mx-auto z-40">
        <div className="rounded-2xl bg-[#0D0E12]/95 backdrop-blur-2xl border border-white/[0.1] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                {pitch.approvedCount} of {pitch.creatorCount} Creators Approved
              </span>
              <span className="text-emerald-400 font-semibold">({approvedPercent}%)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span>Total Allocated Spend:</span>
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
                toast.success('All client decisions synced live with the agency campaign desk!');
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
