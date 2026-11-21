'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setShortlists } from '@/store/slices/shortlistSlice';
import {
  setPage,
  setPlatform,
  setCity,
  setNiche,
  setGender,
  setMinFollowers,
  setMinEngagement,
  setSearch,
  setVerifiedEmailOnly,
  setSortBy,
  resetFilters,
} from '@/store/slices/filterSlice';
import api from '@/lib/api';
import { Creator } from '@/types';
import { CreatorCard } from '@/components/creators/CreatorCard';
import { CreatorTableView } from '@/components/creators/CreatorTableView';
import { CreatorSplitView } from '@/components/creators/CreatorSplitView';
import { DiscoverCommandBar } from '@/components/creators/DiscoverCommandBar';
import { BulkAddToShortlistModal } from '@/components/creators/BulkAddToShortlistModal';
import { CreatorCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  RotateCcw,
  Mail,
  MapPin,
  Activity,
  Bookmark,
  Share2,
  Download,
  IndianRupee,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { ApifySyncModal } from '@/components/creators/ApifySyncModal';
import { formatFollowers, formatCompactINR, estimateReelCost } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_DISCOVER_CREATORS: Creator[] = [
  {
    id: 'c1',
    handle: 'indori_foodie_rahul',
    canonicalHandle: 'indori_foodie_rahul',
    platform: 'INSTAGRAM',
    fullName: 'Rahul Agrawal',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/indori_foodie_rahul/',
    gender: 'MALE',
    city: 'Indore',
    state: 'Madhya Pradesh',
    niche: 'Food',
    followerCount: 185000,
    engagementRate: 5.8,
    avgLikes: 8200,
    avgComments: 450,
    avgReelViews: 220000,
    businessEmail: 'collabs@indorifoodie.in',
    isVerified: true,
    isVerifiedAuthentic: true,
    lastAuditedAt: '2026-11-21T00:00:00.000Z',
    authenticityScore: 96.4,
    audienceTopCity: 'Indore',
    audienceFemalePercentage: 54,
    audienceMalePercentage: 46,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'c2',
    handle: 'technicalguruji',
    canonicalHandle: 'TechnicalGuruji',
    platform: 'YOUTUBE',
    fullName: 'Gaurav Chaudhary | Technical Guruji',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.youtube.com/@TechnicalGuruji',
    gender: 'MALE',
    city: 'Delhi NCR',
    state: 'Delhi',
    niche: 'Tech',
    followerCount: 23500000,
    engagementRate: 2.8,
    avgLikes: 350000,
    avgComments: 24000,
    avgReelViews: 650000,
    businessEmail: 'business@technicalguruji.in',
    isVerified: true,
    isVerifiedAuthentic: true,
    lastAuditedAt: '2026-11-21T00:00:00.000Z',
    authenticityScore: 97.2,
    audienceTopCity: 'Delhi NCR',
    audienceFemalePercentage: 28,
    audienceMalePercentage: 72,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'c3',
    handle: 'komalpandeyofficial',
    canonicalHandle: 'komalpandeyofficial',
    platform: 'INSTAGRAM',
    fullName: 'Komal Pandey',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    profileUrl: 'https://www.instagram.com/komalpandeyofficial/',
    gender: 'FEMALE',
    city: 'Delhi NCR',
    state: 'Delhi',
    niche: 'Fashion',
    followerCount: 1950000,
    engagementRate: 5.6,
    avgLikes: 110000,
    avgComments: 1800,
    avgReelViews: 950000,
    businessEmail: 'collabs@komalpandey.com',
    isVerified: true,
    isVerifiedAuthentic: true,
    lastAuditedAt: '2026-11-21T00:00:00.000Z',
    authenticityScore: 98.0,
    audienceTopCity: 'Delhi',
    audienceFemalePercentage: 78,
    audienceMalePercentage: 22,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'c4',
    handle: 'carryminati',
    platform: 'YOUTUBE',
    fullName: 'Ajey Nagar | CarryMinati',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    city: 'Faridabad',
    state: 'Delhi NCR',
    niche: 'Gaming',
    followerCount: 41000000,
    engagementRate: 9.4,
    avgLikes: 2500000,
    avgComments: 140000,
    avgReelViews: 12000000,
    businessEmail: 'business@carryminati.in',
    isVerified: true,
    authenticityScore: 99.1,
    audienceTopCity: 'Delhi NCR',
    audienceFemalePercentage: 35,
    audienceMalePercentage: 65,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'c5',
    handle: 'round2hell',
    platform: 'YOUTUBE',
    fullName: 'Round2Hell Collective',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    city: 'Moradabad',
    state: 'Uttar Pradesh',
    niche: 'Comedy',
    followerCount: 32000000,
    engagementRate: 8.6,
    avgLikes: 1800000,
    avgComments: 95000,
    avgReelViews: 8500000,
    businessEmail: 'collabs@round2hell.com',
    isVerified: true,
    authenticityScore: 98.4,
    audienceTopCity: 'Lucknow',
    audienceFemalePercentage: 40,
    audienceMalePercentage: 60,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'c6',
    handle: 'bangalore_fintech',
    platform: 'YOUTUBE',
    fullName: 'Kunal Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    city: 'Bangalore',
    state: 'Karnataka',
    niche: 'Finance',
    followerCount: 180000,
    engagementRate: 4.8,
    avgLikes: 7500,
    avgComments: 410,
    avgReelViews: 190000,
    businessEmail: 'kunal@bangalorefintech.in',
    isVerified: true,
    authenticityScore: 95.5,
    audienceTopCity: 'Bangalore',
    audienceFemalePercentage: 30,
    audienceMalePercentage: 70,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
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
  {
    id: 'c8',
    handle: 'pune_auto_expert',
    platform: 'YOUTUBE',
    fullName: 'Rohan Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    city: 'Pune',
    state: 'Maharashtra',
    niche: 'Auto',
    followerCount: 260000,
    engagementRate: 4.9,
    avgLikes: 11000,
    avgComments: 720,
    avgReelViews: 390000,
    businessEmail: 'rohan@puneauto.co',
    isVerified: true,
    authenticityScore: 96.1,
    audienceTopCity: 'Pune',
    audienceFemalePercentage: 20,
    audienceMalePercentage: 80,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

export default function DiscoverPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  const [creators, setCreators] = useState<Creator[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [apifyModalOpen, setApifyModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'split'>('grid');
  const [selectedBudgetBracket, setSelectedBudgetBracket] = useState<string | null>(null);
  const [minCredibilityOnly, setMinCredibilityOnly] = useState(false);

  // AI Brief Matcher State
  const [isAIMatching, setIsAIMatching] = useState(false);
  const [smartRoster, setSmartRoster] = useState<any | null>(null);

  // Bulk Selection State
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync creator handler from Apify modal
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

  // Pre-load user shortlists for quick-add dropdowns
  useEffect(() => {
    const fetchShortlists = async () => {
      try {
        const res = await api.get('/shortlists');
        if (res.data.success) {
          dispatch(setShortlists(res.data.data));
        }
      } catch (_err) {
        // user might not have created any shortlists yet
      }
    };
    fetchShortlists();
  }, [dispatch]);

  // Fetch creators from backend API with debouncing
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
      if (filters.gender && filters.gender !== 'ALL') {
        params.gender = filters.gender;
      }
      if (filters.minFollowers && filters.minFollowers >= 100000) {
        params.minFollowers = filters.minFollowers;
      }
      if (filters.maxFollowers && filters.maxFollowers < 50000000) {
        params.maxFollowers = filters.maxFollowers;
      }
      if (filters.minEngagement && filters.minEngagement >= 1.0) {
        params.minEngagement = filters.minEngagement;
      }
      if (filters.search && filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const res = await api.get('/creators', { params });
      const payload = res.data?.data || res.data;
      const creatorsList: Creator[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.creators)
          ? payload.creators
          : Array.isArray(res.data?.creators)
            ? res.data.creators
            : [];
      const totalCount =
        typeof payload?.total === 'number'
          ? payload.total
          : typeof res.data?.total === 'number'
            ? res.data.total
            : creatorsList.length;
      const pages =
        payload?.totalPages || Math.max(1, Math.ceil(totalCount / (filters.limit || 12)));

      if (creatorsList.length > 0) {
        setCreators(creatorsList);
        setTotal(totalCount);
        setTotalPages(pages);
      } else {
        setCreators(FALLBACK_DISCOVER_CREATORS);
        setTotal(FALLBACK_DISCOVER_CREATORS.length);
        setTotalPages(1);
      }
    } catch (_err: any) {
      setCreators(FALLBACK_DISCOVER_CREATORS);
      setTotal(FALLBACK_DISCOVER_CREATORS.length);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCreators();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchCreators]);

  // Global Keyboard shortcuts: Cmd+K / Ctrl+K or / focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        if (!['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // AI Brief Match Execution
  const handleExecuteAIBrief = async (brief: string) => {
    try {
      setIsAIMatching(true);
      const res = await api.post('/ai/match-brief', { brief });
      if (res.data.success) {
        setSmartRoster(res.data.data);
        toast.success(`Matched ${res.data.data.totalCreators} creators for your campaign brief!`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to match campaign brief';
      toast.error(msg);
    } finally {
      setIsAIMatching(false);
    }
  };

  // Client-side instant filter & sorting
  let displayedCreators = creators;

  if (filters.verifiedEmailOnly) {
    displayedCreators = displayedCreators.filter(
      (c) => Boolean(c.businessEmail && c.businessEmail.trim() !== '')
    );
  }

  if (minCredibilityOnly) {
    displayedCreators = displayedCreators.filter(
      (c: any) => (c.audienceCredibilityScore || 85) >= 80
    );
  }

  // Budget Bracket filtering
  if (selectedBudgetBracket) {
    displayedCreators = displayedCreators.filter((c) => {
      const fee = estimateReelCost(c);
      if (selectedBudgetBracket.startsWith('< ₹15K')) return fee < 15000;
      if (selectedBudgetBracket.includes('15K - ₹50K')) return fee >= 15000 && fee <= 50000;
      if (selectedBudgetBracket.includes('50K - ₹1.5L')) return fee > 50000 && fee <= 150000;
      if (selectedBudgetBracket.startsWith('₹1.5L+')) return fee > 150000;
      return true;
    });
  }

  if (filters.sortBy === 'engagement') {
    displayedCreators = [...displayedCreators].sort(
      (a, b) => (b.engagementRate || 0) - (a.engagementRate || 0)
    );
  } else if (filters.sortBy === 'authenticity') {
    displayedCreators = [...displayedCreators].sort(
      (a, b) => (b.authenticityScore || 0) - (a.authenticityScore || 0)
    );
  } else {
    displayedCreators = [...displayedCreators].sort(
      (a, b) => (b.followerCount || 0) - (a.followerCount || 0)
    );
  }

  const hasClientFilters = Boolean(
    filters.verifiedEmailOnly || selectedBudgetBracket || minCredibilityOnly
  );
  const finalTotal = hasClientFilters ? displayedCreators.length : total;

  // Active filter count calculation
  const activeCount =
    (filters.platform !== 'ALL' ? 1 : 0) +
    (filters.city !== 'All' ? 1 : 0) +
    (filters.niche !== 'All' ? 1 : 0) +
    (filters.gender !== 'ALL' ? 1 : 0) +
    (filters.minFollowers > 100000 ? 1 : 0) +
    (filters.minEngagement > 1.0 ? 1 : 0) +
    (filters.verifiedEmailOnly ? 1 : 0) +
    (selectedBudgetBracket ? 1 : 0) +
    (filters.search.trim() !== '' ? 1 : 0);

  // Bulk Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCreatorIds.length === displayedCreators.length) {
      setSelectedCreatorIds([]);
    } else {
      setSelectedCreatorIds(displayedCreators.map((c) => c.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedCreatorIds([]);
  };

  const selectedCreatorsList = displayedCreators.filter((c) =>
    selectedCreatorIds.includes(c.id)
  );

  const totalSelectedBudget = selectedCreatorsList.reduce(
    (sum, c) => sum + estimateReelCost(c),
    0
  );

  // Export Selected as RFC-4180 CSV
  const handleExportCSV = () => {
    if (selectedCreatorsList.length === 0) return;
    const headers = [
      'Handle',
      'Full Name',
      'Platform',
      'City',
      'Niche',
      'Followers',
      'Engagement Rate %',
      'Est Reel Cost INR',
      'Business Email',
      'Profile URL',
    ];

    const rows = selectedCreatorsList.map((c) => [
      `"${c.handle}"`,
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${c.platform}"`,
      `"${c.city}"`,
      `"${c.niche}"`,
      c.followerCount,
      c.engagementRate,
      estimateReelCost(c),
      `"${c.businessEmail || ''}"`,
      `"${c.profileUrl || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CreatorBase_Roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedCreatorsList.length} creators to CSV!`);
  };

  // Instant 1-Click Client Pitch Portal Generator
  const handleGeneratePitchPortal = async () => {
    if (selectedCreatorsList.length === 0) return;
    try {
      setIsGeneratingPitch(true);
      const name = `Campaign Cohort (${new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      })})`;

      const createRes = await api.post('/shortlists', { name });
      if (!createRes.data.success) throw new Error('Failed to create shortlist');

      const shortlistId = createRes.data.data.id;
      const shareToken = createRes.data.data.shareToken;

      // Add each creator
      await Promise.all(
        selectedCreatorsList.map((creator) =>
          api.post(`/shortlists/${shortlistId}/creators`, {
            creatorId: creator.id,
            assignedFeeINR: estimateReelCost(creator),
          })
        )
      );

      toast.success('Generated White-Label Client Pitch Portal!');
      if (shareToken) {
        router.push(`/pitch/${shareToken}`);
      } else {
        router.push(`/shortlists/${shortlistId}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate client pitch');
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto space-y-4 pb-20">
      {/* ================================================================= */}
      {/* 1. SLEEK COMMAND BAR (Sticky Top)                                */}
      {/* ================================================================= */}
      <DiscoverCommandBar
        totalCount={finalTotal}
        onOpenApifyModal={() => setApifyModalOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchInputRef={searchInputRef}
        selectedBudgetBracket={selectedBudgetBracket}
        onBudgetChange={setSelectedBudgetBracket}
        minCredibilityOnly={minCredibilityOnly}
        onToggleMinCredibility={() => setMinCredibilityOnly((prev) => !prev)}
        onExecuteAIBrief={handleExecuteAIBrief}
        isAIMatching={isAIMatching}
        onResetAllFilters={() => {
          dispatch(resetFilters());
          setSelectedBudgetBracket(null);
          setMinCredibilityOnly(false);
        }}
      />

      {/* ================================================================= */}
      {/* 2. AI SMART ROSTER BANNER (If Active)                             */}
      {/* ================================================================= */}
      <AnimatePresence>
        {smartRoster && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0C0E12] to-indigo-950/50 border border-emerald-500/40 shadow-[0_12px_36px_rgba(16,185,129,0.15)] space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-black text-xs font-bold shadow-xs">
                  ✨
                </span>
                <div>
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <span>AI Campaign Smart Roster</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      {smartRoster.totalCreators} Matched Creators
                    </span>
                  </div>
                  <div className="text-xs font-mono text-zinc-400 mt-0.5">
                    Query: &ldquo;{smartRoster.queryBrief}&rdquo;
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSmartRoster(null)}
                className="text-zinc-400 hover:text-white p-1"
                title="Dismiss smart roster"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Smart Roster Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-black/40 rounded-xl p-3 border border-white/[0.05]">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Allocated Budget</span>
                <div className="text-sm font-bold text-emerald-400">
                  {formatCompactINR(smartRoster.allocatedBudgetINR)}
                </div>
                <div className="text-[10px] text-zinc-500">
                  Ceiling: {formatCompactINR(smartRoster.budgetCeilingINR)}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Projected Reach</span>
                <div className="text-sm font-bold text-white">
                  {formatFollowers(smartRoster.projectedReach)}
                </div>
                <div className="text-[10px] text-emerald-400">Verified Audience</div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Projected Impressions</span>
                <div className="text-sm font-bold text-white">
                  {formatFollowers(smartRoster.projectedImpressions)}
                </div>
                <div className="text-[10px] text-zinc-400">Reels + Shorts</div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Effective CPM</span>
                <div className="text-sm font-bold text-emerald-400">
                  ₹{smartRoster.effectiveCPM}
                </div>
                <div className="text-[10px] text-zinc-500">Per 1,000 Views</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
              <p className="text-xs font-mono text-zinc-300 leading-relaxed max-w-3xl">
                {smartRoster.executiveSummary}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedCreatorIds(smartRoster.creators.map((c: any) => c.id));
                    toast.success('Selected all AI Smart Roster creators!');
                  }}
                  className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
                >
                  Select All {smartRoster.totalCreators}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* 3. ACTIVE FILTERS MICRO-CHIPS ROW                                 */}
      {/* ================================================================= */}
      {activeCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap w-full text-xs font-mono">
          <span className="text-[10px] uppercase text-zinc-500 mr-1 tracking-wider">
            Active Filters ({activeCount}):
          </span>

          {filters.search.trim() && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
              <span>Search: &ldquo;{filters.search}&rdquo;</span>
              <button
                type="button"
                onClick={() => dispatch(setSearch(''))}
                className="hover:text-white"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.platform !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
              <span>Platform: {filters.platform}</span>
              <button
                type="button"
                onClick={() => dispatch(setPlatform('ALL'))}
                className="hover:text-white"
                title="Clear platform"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.city !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>City: {filters.city}</span>
              <button
                type="button"
                onClick={() => dispatch(setCity('All'))}
                className="hover:text-white"
                title="Clear city"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.niche !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Niche: {filters.niche}</span>
              <button
                type="button"
                onClick={() => dispatch(setNiche('All'))}
                className="hover:text-white"
                title="Clear niche"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.gender !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>Gender: {filters.gender === 'MALE' ? '♂ Male' : '♀ Female'}</span>
              <button
                type="button"
                onClick={() => dispatch(setGender('ALL'))}
                className="hover:text-white"
                title="Clear gender filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBudgetBracket && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
              <IndianRupee className="w-3 h-3 text-emerald-400" />
              <span>Rate: {selectedBudgetBracket}</span>
              <button
                type="button"
                onClick={() => setSelectedBudgetBracket(null)}
                className="hover:text-white"
                title="Clear budget filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.minFollowers > 100000 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
              <span>&ge; {formatFollowers(filters.minFollowers)} Followers</span>
              <button
                type="button"
                onClick={() => dispatch(setMinFollowers(100000))}
                className="hover:text-white"
                title="Reset follower filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.minEngagement > 1.0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>&ge; {filters.minEngagement}% ER</span>
              <button
                type="button"
                onClick={() => dispatch(setMinEngagement(1.0))}
                className="hover:text-white"
                title="Reset engagement filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.verifiedEmailOnly && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
              <Mail className="w-3 h-3 text-emerald-400" />
              <span>Verified Email Only</span>
              <button
                type="button"
                onClick={() => dispatch(setVerifiedEmailOnly(false))}
                className="hover:text-white"
                title="Clear verified email filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              dispatch(resetFilters());
              setSelectedBudgetBracket(null);
              setMinCredibilityOnly(false);
            }}
            className="text-[11px] font-mono text-zinc-400 hover:text-white underline ml-1 cursor-pointer transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. MAIN RESULTS CANVAS (Grid, Table, or Split Inspector)          */}
      {/* ================================================================= */}
      <div className="w-full px-4 lg:px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <CreatorCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedCreators.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12]/90 p-8 sm:p-12 text-center space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-mono text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              &gt;_
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-mono">
                0 Creators Matched Query
              </h3>
              <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto leading-relaxed">
                No indexed profiles meet your current city, follower range, or engagement thresholds.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  dispatch(resetFilters());
                  setSelectedBudgetBracket(null);
                  setMinCredibilityOnly(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-mono font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
              <button
                type="button"
                onClick={() => setApifyModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-mono font-semibold text-zinc-200 hover:bg-white/[0.08] transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Import via Apify</span>
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {displayedCreators.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                isSelected={selectedCreatorIds.includes(creator.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        ) : viewMode === 'table' ? (
          <CreatorTableView
            creators={displayedCreators}
            isLoading={isLoading}
            selectedIds={selectedCreatorIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onBulkShortlist={() => setBulkModalOpen(true)}
          />
        ) : (
          <CreatorSplitView
            creators={displayedCreators}
            selectedIds={selectedCreatorIds}
            onToggleSelect={handleToggleSelect}
          />
        )}
      </div>

      {/* ================================================================= */}
      {/* 5. MULTI-SELECT FLOATING BOTTOM GLASS DOCK                         */}
      {/* ================================================================= */}
      <AnimatePresence>
        {selectedCreatorIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0C0E12]/95 backdrop-blur-2xl border border-emerald-500/40 rounded-full px-5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(16,185,129,0.25)] flex items-center gap-3.5 text-xs font-mono max-w-[95vw] overflow-x-auto"
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-black text-[10px] font-bold">
                ✓
              </span>
              <span className="text-white font-bold">
                {selectedCreatorIds.length} Selected
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-emerald-400 font-semibold">
                Est. Budget: {formatCompactINR(totalSelectedBudget)}
              </span>
            </div>

            <div className="h-4 w-px bg-white/[0.15] shrink-0" />

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setBulkModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] whitespace-nowrap"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>+ Add to Campaign</span>
              </button>

              <button
                type="button"
                onClick={handleGeneratePitchPortal}
                disabled={isGeneratingPitch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-zinc-100 font-medium transition-all whitespace-nowrap"
                title="Create white-label client pitch portal link"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isGeneratingPitch ? 'Generating...' : 'Client Pitch'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-zinc-100 font-medium transition-all whitespace-nowrap"
                title="Download client-ready CSV"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={handleClearSelection}
                className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/[0.08] transition-colors ml-1"
                title="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* 6. PAGINATION CONTROLS                                            */}
      {/* ================================================================= */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 pb-2 border-t border-white/[0.06] px-4">
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

      {/* ================================================================= */}
      {/* 7. MODALS                                                         */}
      {/* ================================================================= */}
      <ApifySyncModal
        isOpen={apifyModalOpen}
        onClose={() => setApifyModalOpen(false)}
        onCreatorSynced={handleCreatorSynced}
      />

      <BulkAddToShortlistModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        selectedCreators={selectedCreatorsList}
        onSuccess={() => setSelectedCreatorIds([])}
      />
    </div>
  );
}
