'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setShortlists,
  setSelectedShortlistId,
} from '@/store/slices/shortlistSlice';
import api from '@/lib/api';
import { Shortlist } from '@/types';
import { ShortlistTable } from '@/components/shortlists/ShortlistTable';
import { KanbanBoard } from '@/components/shortlists/KanbanBoard';
import { CreateShortlistModal } from '@/components/shortlists/CreateShortlistModal';
import { SharePitchModal } from '@/components/shortlists/SharePitchModal';
import { Button } from '@/components/ui/Button';
import {
  Bookmark,
  Plus,
  Loader2,
  BookmarkCheck,
  FolderPlus,
  LayoutList,
  Kanban,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const DEMO_SHORTLIST_FALLBACK: Shortlist = {
  id: 'demo-shortlist-1',
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
      shortlistId: 'demo-shortlist-1',
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
      shortlistId: 'demo-shortlist-1',
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
      shortlistId: 'demo-shortlist-1',
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
      shortlistId: 'demo-shortlist-1',
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

export default function ShortlistsPage() {
  const dispatch = useAppDispatch();
  const { shortlists, selectedShortlistId } = useAppSelector(
    (state) => state.shortlists
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');

  const fetchShortlistsAndCampaigns = async () => {
    try {
      setIsLoading(true);
      const [shortlistRes, campaignRes] = await Promise.all([
        api.get('/shortlists'),
        api.get('/campaigns').catch(() => ({ data: { success: false } })),
      ]);

      if (shortlistRes.data.success && Array.isArray(shortlistRes.data.data) && shortlistRes.data.data.length > 0) {
        dispatch(setShortlists(shortlistRes.data.data));
      } else {
        dispatch(setShortlists([DEMO_SHORTLIST_FALLBACK]));
      }
      if (campaignRes.data.success && Array.isArray(campaignRes.data.data) && campaignRes.data.data.length > 0) {
        setCampaigns(campaignRes.data.data);
      } else {
        setCampaigns([DEMO_SHORTLIST_FALLBACK.campaign]);
      }
    } catch (err: any) {
      dispatch(setShortlists([DEMO_SHORTLIST_FALLBACK]));
      setCampaigns([DEMO_SHORTLIST_FALLBACK.campaign]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlistsAndCampaigns();
  }, [dispatch]);

  const activeShortlist = shortlists.find((s) => s.id === selectedShortlistId) || shortlists[0];

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            <span>Creator Shortlists &amp; Cohorts</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage creator packages, track deliverable workflow stages, and export client-ready CSVs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Animated Linear-Grade View Switcher */}
          {shortlists.length > 0 && (
            <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#0C0E12] p-1 shadow-inner">
              <button
                onClick={() => setViewMode('table')}
                className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                  viewMode === 'table' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {viewMode === 'table' && (
                  <motion.div
                    layoutId="shortlistViewPill"
                    className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08] shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  />
                )}
                <LayoutList className="h-3.5 w-3.5" />
                <span>Table View ☷</span>
              </button>

              <button
                onClick={() => setViewMode('kanban')}
                className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                  viewMode === 'kanban' ? 'text-emerald-300' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {viewMode === 'kanban' && (
                  <motion.div
                    layoutId="shortlistViewPill"
                    className="absolute inset-0 rounded-lg bg-emerald-500/15 border border-emerald-500/35 shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  />
                )}
                <Kanban className="h-3.5 w-3.5 text-emerald-400" />
                <span>Workflow Kanban ⚏</span>
              </button>
            </div>
          )}

          {/* One-Click Client Pitch Portal Button */}
          {activeShortlist && (
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all shadow-sm shadow-emerald-950/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share Pitch with Client 🚀</span>
            </button>
          )}

          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Shortlist
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-[#0C0E12]/90 border border-white/[0.07] backdrop-blur-xl">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      ) : shortlists.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#0C0E12]/90 p-16 text-center space-y-4 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-emerald-400 border border-white/[0.08]">
            <FolderPlus className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">No Shortlists Created Yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Create your first shortlist to organize influencer talent for your upcoming campaigns.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create First Shortlist
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Shortlists Tabs Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.06] scrollbar-thin">
            {shortlists.map((sl) => {
              const isSelected = activeShortlist?.id === sl.id;
              const count = sl.items?.length || sl.creatorCount || 0;

              return (
                <button
                  key={sl.id}
                  onClick={() => dispatch(setSelectedShortlistId(sl.id))}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium shrink-0 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-[#0C0E12] text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-white/[0.06]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <span>{sl.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Shortlist View */}
          {activeShortlist && (
            viewMode === 'kanban' ? (
              <KanbanBoard
                shortlist={activeShortlist}
                onRefresh={fetchShortlistsAndCampaigns}
              />
            ) : (
              <ShortlistTable
                shortlist={activeShortlist}
                onRefresh={fetchShortlistsAndCampaigns}
              />
            )
          )}
        </div>
      )}

      {/* Create Shortlist Modal */}
      <CreateShortlistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        campaigns={campaigns}
        onSuccess={fetchShortlistsAndCampaigns}
      />

      {/* Share Pitch with Client Modal */}
      {activeShortlist && (
        <SharePitchModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shortlist={activeShortlist}
        />
      )}
    </div>
  );
}
