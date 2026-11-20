'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shortlist } from '@/types';
import api from '@/lib/api';
import { ShortlistTable } from '@/components/shortlists/ShortlistTable';
import { KanbanBoard } from '@/components/shortlists/KanbanBoard';
import { SharePitchModal } from '@/components/shortlists/SharePitchModal';
import {
  BookmarkCheck,
  ChevronLeft,
  LayoutList,
  Kanban,
  Loader2,
  Share2,
  Plus,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const DEMO_SHORTLIST_FALLBACK: Shortlist = {
  id: 'sample-cohort',
  userId: 'user-demo',
  campaignId: 'camp-1',
  name: 'Festive High-Impact Creator Roster 2026',
  shareToken: 'sample-demo',
  isPubliclyShared: true,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  creatorCount: 4,
  totalEstimatedCostINR: 285000,
  totalFollowers: 950000,
  avgEngagement: 5.4,
  campaign: {
    id: 'camp-1',
    title: 'Festive D2C Campaign',
    budgetINR: 500000,
    status: 'ACTIVE',
  },
  items: [
    {
      id: 'item-1',
      shortlistId: 'sample-cohort',
      creatorId: 'c1',
      notes: 'Hero creator for Indore food & lifestyle segment',
      assignedFeeINR: 14000,
      agreedFeeINR: 14000,
      stage: 'SHORTLISTED',
      clientApprovalStatus: 'APPROVED',
      createdAt: '2026-01-01',
      creator: {
        id: 'c1',
        handle: 'indori_foodie_rahul',
        platform: 'INSTAGRAM',
        fullName: 'Rahul Agrawal',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        city: 'Indore',
        state: 'Madhya Pradesh',
        niche: 'Food',
        followerCount: 148000,
        engagementRate: 5.8,
        avgLikes: 8200,
        avgComments: 450,
        avgReelViews: 220000,
        businessEmail: 'collabs@indorifoodie.in',
        isVerified: true,
        authenticityScore: 96.4,
        audienceTopCity: 'Indore',
        audienceFemalePercentage: 54,
        audienceMalePercentage: 46,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    },
    {
      id: 'item-2',
      shortlistId: 'sample-cohort',
      creatorId: 'c2',
      notes: 'Tech review reel scheduled for launch day',
      assignedFeeINR: 35000,
      agreedFeeINR: 35000,
      stage: 'EMAIL_SENT',
      clientApprovalStatus: 'APPROVED',
      createdAt: '2026-01-01',
      creator: {
        id: 'c2',
        handle: 'mumbai_tech_review',
        platform: 'YOUTUBE',
        fullName: 'Aarav Mehta',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        city: 'Mumbai',
        state: 'Maharashtra',
        niche: 'Tech',
        followerCount: 385000,
        engagementRate: 4.2,
        avgLikes: 15400,
        avgComments: 890,
        avgReelViews: 410000,
        businessEmail: 'aarav@mumbaitech.co',
        isVerified: true,
        authenticityScore: 97.2,
        audienceTopCity: 'Mumbai',
        audienceFemalePercentage: 28,
        audienceMalePercentage: 72,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    },
    {
      id: 'item-3',
      shortlistId: 'sample-cohort',
      creatorId: 'c3',
      notes: 'Fashion styling reel with coupon code',
      assignedFeeINR: 22000,
      agreedFeeINR: 22000,
      stage: 'COMMERCIALS_AGREED',
      clientApprovalStatus: 'APPROVED',
      createdAt: '2026-01-01',
      creator: {
        id: 'c3',
        handle: 'delhi_street_style',
        platform: 'INSTAGRAM',
        fullName: 'Ananya Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        city: 'Delhi',
        state: 'Delhi NCR',
        niche: 'Fashion',
        followerCount: 215000,
        engagementRate: 6.1,
        avgLikes: 12800,
        avgComments: 640,
        avgReelViews: 350000,
        businessEmail: 'collabs@delhitech.in',
        isVerified: true,
        authenticityScore: 98.0,
        audienceTopCity: 'Delhi',
        audienceFemalePercentage: 78,
        audienceMalePercentage: 22,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    },
    {
      id: 'item-4',
      shortlistId: 'sample-cohort',
      creatorId: 'c7',
      notes: 'Travel vlog destination feature',
      assignedFeeINR: 18500,
      agreedFeeINR: 18500,
      stage: 'LIVE_AND_PAID',
      clientApprovalStatus: 'APPROVED',
      createdAt: '2026-01-01',
      creator: {
        id: 'c7',
        handle: 'jaipur_vlogs_vikram',
        platform: 'YOUTUBE',
        fullName: 'Vikram Rajput',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        city: 'Jaipur',
        state: 'Rajasthan',
        niche: 'Travel',
        followerCount: 190000,
        engagementRate: 5.2,
        avgLikes: 9800,
        avgComments: 510,
        avgReelViews: 280000,
        businessEmail: 'vikram@jaipurvlogs.com',
        isVerified: true,
        authenticityScore: 94.8,
        audienceTopCity: 'Jaipur',
        audienceFemalePercentage: 42,
        audienceMalePercentage: 58,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    },
  ],
};

export default function ShortlistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [shortlist, setShortlist] = useState<Shortlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // View state: 'kanban' | 'table'
  const initialView = (searchParams.get('view') as 'table' | 'kanban') || 'kanban';
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>(initialView);

  const fetchShortlist = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/shortlists/${id}`);
      if (res.data.success && res.data.data) {
        setShortlist(res.data.data);
      } else {
        setShortlist(DEMO_SHORTLIST_FALLBACK);
      }
    } catch (_err) {
      setShortlist(DEMO_SHORTLIST_FALLBACK);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, [id]);

  const handleSwitchView = (mode: 'table' | 'kanban') => {
    setViewMode(mode);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('view', mode);
    router.replace(`/shortlists/${id}?${newParams.toString()}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-[#0C0E12]/90 border border-white/[0.07] backdrop-blur-xl">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!shortlist) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#0C0E12]/90 p-12 text-center backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <h3 className="text-base font-bold text-white mb-2">Shortlist Not Found</h3>
        <p className="text-xs text-zinc-400 mb-6">
          The shortlist you are trying to view does not exist or has been removed.
        </p>
        <Link
          href="/shortlists"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-2 text-xs font-mono text-zinc-200 hover:bg-white/[0.1] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Shortlists</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/shortlists"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>All Shortlists</span>
            </Link>
            <span className="text-zinc-600">•</span>
            {shortlist.campaign && (
              <span className="rounded bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
                Campaign: {shortlist.campaign.title}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookmarkCheck className="h-6 w-6 text-emerald-400" />
            <span>{shortlist.name}</span>
            <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 text-xs font-mono font-normal text-zinc-400">
              {shortlist.items?.length || shortlist.creatorCount || 0} Creators
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track deliverable execution, log commercial agreements, and monitor live reel publications.
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Animated Linear-Grade View Switcher */}
          <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#0C0E12] p-1 shadow-inner">
            <button
              onClick={() => handleSwitchView('table')}
              className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                viewMode === 'table' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {viewMode === 'table' && (
                <motion.div
                  layoutId="shortlistDetailViewPill"
                  className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08] shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />
              )}
              <LayoutList className="h-3.5 w-3.5" />
              <span>Table View ☷</span>
            </button>

            <button
              onClick={() => handleSwitchView('kanban')}
              className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                viewMode === 'kanban' ? 'text-emerald-300' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {viewMode === 'kanban' && (
                <motion.div
                  layoutId="shortlistDetailViewPill"
                  className="absolute inset-0 rounded-lg bg-emerald-500/15 border border-emerald-500/35 shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />
              )}
              <Kanban className="h-3.5 w-3.5 text-emerald-400" />
              <span>Workflow Kanban ⚏</span>
            </button>
          </div>

          {/* Prominent "Share Pitch with Client" Button */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-950/40 px-3.5 py-2 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all shadow-md shadow-emerald-950/30"
            title="Generate client pitch portal link"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Share Pitch with Client 🚀</span>
          </button>

          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Creators</span>
          </Link>
        </div>
      </div>

      {/* Render Table or Kanban View */}
      {viewMode === 'kanban' ? (
        <KanbanBoard shortlist={shortlist} onRefresh={fetchShortlist} />
      ) : (
        <ShortlistTable shortlist={shortlist} onRefresh={fetchShortlist} />
      )}

      {/* Reusable Share Pitch Portal Modal */}
      {shortlist && (
        <SharePitchModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shortlist={shortlist}
        />
      )}
    </div>
  );
}
