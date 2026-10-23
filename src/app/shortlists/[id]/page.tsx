'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shortlist } from '@/types';
import api from '@/lib/api';
import { ShortlistTable } from '@/components/shortlists/ShortlistTable';
import { KanbanBoard } from '@/components/shortlists/KanbanBoard';
import { Button } from '@/components/ui/Button';
import {
  BookmarkCheck,
  ChevronLeft,
  LayoutList,
  Kanban,
  Loader2,
  ExternalLink,
  Share2,
  Copy,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

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

  // View state: 'kanban' | 'table'
  const initialView = (searchParams.get('view') as 'table' | 'kanban') || 'kanban';
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>(initialView);

  const fetchShortlist = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/shortlists/${id}`);
      if (res.data.success && res.data.data) {
        setShortlist(res.data.data);
      }
    } catch (_err) {
      toast.error('Failed to load shortlist details');
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
      <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!shortlist) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
        <h3 className="text-base font-bold text-white mb-2">Shortlist Not Found</h3>
        <p className="text-xs text-zinc-400 mb-6">
          The shortlist you are trying to view does not exist or has been removed.
        </p>
        <Link
          href="/shortlists"
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
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
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-mono font-normal text-zinc-400">
              {shortlist.items?.length || shortlist.creatorCount || 0} Creators
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track deliverable execution, log commercial agreements, and monitor live reel publications.
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Apify-Style View Switcher */}
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-inner">
            <button
              onClick={() => handleSwitchView('table')}
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
              onClick={() => handleSwitchView('kanban')}
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

          {/* Quick Pitch Portal Link & 1-Click Copy */}
          {shortlist.shareToken && (
            <div className="flex items-center gap-1.5">
              <Link
                href={`/pitch/${shortlist.shareToken}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
                title="Open client pitch portal in new tab"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Client Pitch</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/pitch/${shortlist.shareToken}`;
                  navigator.clipboard.writeText(url);
                  toast.success('Client pitch link copied to clipboard! 📋');
                }}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800/80 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:border-emerald-500/50 hover:bg-zinc-700 transition-colors"
                title="Copy public client pitch link"
              >
                <Copy className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copy</span>
              </button>
            </div>
          )}

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
    </div>
  );
}
