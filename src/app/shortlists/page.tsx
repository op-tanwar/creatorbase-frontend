'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setShortlists,
  setSelectedShortlistId,
} from '@/store/slices/shortlistSlice';
import api from '@/lib/api';
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
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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

      if (shortlistRes.data.success) {
        dispatch(setShortlists(shortlistRes.data.data));
      }
      if (campaignRes.data.success) {
        setCampaigns(campaignRes.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load shortlists');
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
            Creator Shortlists &amp; Cohorts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage creator packages, track deliverable workflow stages, and export client-ready CSVs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Apify-Style View Switcher */}
          {shortlists.length > 0 && (
            <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-inner">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <LayoutList className="h-3.5 w-3.5" />
                <span>Table View ☷</span>
              </button>

              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Kanban className="h-3.5 w-3.5" />
                <span>Workflow Kanban ⚏</span>
              </button>
            </div>
          )}

          {/* One-Click Client Pitch Portal */}
          {activeShortlist && (
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all shadow-sm"
            >
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
        <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      ) : shortlists.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-16 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-emerald-400 border border-zinc-700/60">
            <FolderPlus className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Shortlists Created Yet</h3>
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
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 scrollbar-thin">
            {shortlists.map((sl) => {
              const isSelected = activeShortlist?.id === sl.id;
              const count = sl.items?.length || sl.creatorCount || 0;

              return (
                <button
                  key={sl.id}
                  onClick={() => dispatch(setSelectedShortlistId(sl.id))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <span>{sl.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400'
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
