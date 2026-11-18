'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setShortlists } from '@/store/slices/shortlistSlice';
import { setPage, resetFilters } from '@/store/slices/filterSlice';
import api from '@/lib/api';
import { Creator } from '@/types';
import { CreatorFilters } from '@/components/creators/CreatorFilters';
import { CreatorCard } from '@/components/creators/CreatorCard';
import { CreatorCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Compass,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';
import { ApifySyncModal } from '@/components/creators/ApifySyncModal';

export default function DiscoverPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  const [creators, setCreators] = useState<Creator[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [apifyModalOpen, setApifyModalOpen] = useState(false);

  const handleCreatorSynced = (newCreator: Creator) => {
    setCreators((prev) => {
      const exists = prev.some((c) => c.id === newCreator.id || c.handle === newCreator.handle);
      if (exists) {
        return prev.map((c) =>
          c.id === newCreator.id || c.handle === newCreator.handle ? newCreator : c
        );
      }
      return [newCreator, ...prev];
    });
    setTotal((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchShortlists = async () => {
      try {
        const res = await api.get('/shortlists');
        if (res.data.success) {
          dispatch(setShortlists(res.data.data));
        }
      } catch (err) {
        // user might not have created any shortlists yet
      }
    };
    fetchShortlists();
  }, [dispatch]);

  const fetchCreators = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.platform && filters.platform !== 'ALL') {
        params.platform = filters.platform;
      }
      if (filters.city && filters.city !== 'All') {
        params.city = filters.city;
      }
      if (filters.niche && filters.niche !== 'All') {
        params.niche = filters.niche;
      }
      if (filters.minFollowers && filters.minFollowers >= 5000) {
        params.minFollowers = filters.minFollowers;
      }
      if (filters.maxFollowers && filters.maxFollowers < 500000) {
        params.maxFollowers = filters.maxFollowers;
      }
      if (filters.minEngagement && filters.minEngagement >= 1.0) {
        params.minEngagement = filters.minEngagement;
      }
      if (filters.search && filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const res = await api.get('/creators', { params });
      if (res.data.success && res.data.data) {
        setCreators(res.data.data.creators || []);
        setTotal(res.data.data.total || 0);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err: any) {
      toast.error('Failed to load creators');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCreators();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchCreators]);

  return (
    <div className="space-y-6">
      {/* Top Command-Bar Filter Header */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#060709]/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <CreatorFilters />
      </div>

      {/* Results Header Info Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-mono font-bold text-white">
              {total.toLocaleString('en-IN')} verified creator{total === 1 ? '' : 's'} indexed
            </span>
            <span className="text-[11px] font-mono text-zinc-500 block">
              PAGE {filters.page} OF {totalPages} • REAL-TIME AP-SOUTH-1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/enrich"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-[#0C0E12] text-xs font-mono font-semibold text-zinc-300 hover:text-white hover:border-emerald-500/40 transition-all shadow-sm active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bulk CSV Enrich</span>
          </Link>

          <button
            type="button"
            onClick={() => setApifyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs font-mono font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import Live Creator (Apify)</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Apify sync active</span>
          </div>
        </div>
      </div>

      {/* Creator Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <CreatorCardSkeleton key={i} />
          ))}
        </div>
      ) : creators.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12]/90 p-12 text-center space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-mono text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            &gt;_
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-mono">0 Creators Matched Query</h3>
            <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto leading-relaxed">
              No indexed profiles meet your current city, follower range, or engagement thresholds.
            </p>
          </div>
          <div>
            <button
              onClick={() => dispatch(resetFilters())}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-mono font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <span>reset_filters()</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-white/[0.06]">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1 || isLoading}
            onClick={() => dispatch(setPage(filters.page - 1))}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="font-mono text-xs border-white/[0.08] bg-[#0C0E12] hover:bg-white/[0.06]"
          >
            Previous
          </Button>

          <span className="text-xs font-mono text-zinc-400">
            Page <span className="text-white font-bold">{filters.page}</span> of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= totalPages || isLoading}
            onClick={() => dispatch(setPage(filters.page + 1))}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="font-mono text-xs border-white/[0.08] bg-[#0C0E12] hover:bg-white/[0.06]"
          >
            Next
          </Button>
        </div>
      )}

      {/* Apify Live Sync Modal */}
      <ApifySyncModal
        isOpen={apifyModalOpen}
        onClose={() => setApifyModalOpen(false)}
        onCreatorSynced={handleCreatorSynced}
      />
    </div>
  );
}
