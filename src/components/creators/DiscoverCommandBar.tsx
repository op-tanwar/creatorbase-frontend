'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPlatform,
  setCity,
  setNiche,
  setMinFollowers,
  setMinEngagement,
  setSearch,
  setVerifiedEmailOnly,
  setSortBy,
  resetFilters,
} from '@/store/slices/filterSlice';
import {
  Search,
  X,
  ChevronDown,
  MapPin,
  Sparkles,
  Activity,
  Mail,
  ArrowUpDown,
  LayoutGrid,
  List,
  Columns,
  Command,
  Check,
  RotateCcw,
  SlidersHorizontal,
  IndianRupee,
  Bot,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import { INDIAN_CITIES_LIST, PAN_INDIA_CITY_MAP, FULL_SPECTRUM_NICHES, PAN_INDIA_NICHE_MAP } from '@/lib/constants';
import { formatFollowers } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const FOLLOWER_PRESETS = [
  { label: '5K+', value: 5000 },
  { label: '25K+', value: 25000 },
  { label: '50K+', value: 50000 },
  { label: '100K+', value: 100000 },
  { label: '250K+', value: 250000 },
];

const ENGAGEMENT_PRESETS = [
  { label: '1%+', value: 1.0 },
  { label: '2%+', value: 2.0 },
  { label: '3.5%+', value: 3.5 },
  { label: '5%+', value: 5.0 },
];

const BUDGET_PRESETS = [
  { label: 'All Budgets', min: 0, max: 9999999 },
  { label: '< ₹15K (Micro)', min: 0, max: 15000 },
  { label: '₹15K - ₹50K (Mid)', min: 15000, max: 50000 },
  { label: '₹50K - ₹1.5L (Macro)', min: 50000, max: 150000 },
  { label: '₹1.5L+ (Celeb/Top)', min: 150000, max: 9999999 },
];

const TOP_CITIES_QUICK = [
  'All',
  'Indore',
  'Mumbai',
  'Delhi NCR',
  'Bangalore',
  'Pune',
  'Jaipur',
  'Hyderabad',
  'Ahmedabad',
];

interface DiscoverCommandBarProps {
  totalCount: number;
  onOpenApifyModal: () => void;
  viewMode: 'grid' | 'table' | 'split';
  onViewModeChange: (mode: 'grid' | 'table' | 'split') => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  selectedBudgetBracket?: string | null;
  onBudgetChange?: (bracketLabel: string | null) => void;
  minCredibilityOnly?: boolean;
  onToggleMinCredibility?: () => void;
  onExecuteAIBrief?: (brief: string) => void;
  isAIMatching?: boolean;
}

export function DiscoverCommandBar({
  totalCount,
  onOpenApifyModal,
  viewMode,
  onViewModeChange,
  searchInputRef,
  selectedBudgetBracket,
  onBudgetChange,
  minCredibilityOnly,
  onToggleMinCredibility,
  onExecuteAIBrief,
  isAIMatching,
}: DiscoverCommandBarProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  // Active popover state: 'platform' | 'city' | 'niche' | 'metrics' | 'budget' | null
  const [activePopover, setActivePopover] = useState<string | null>(null);

  // AI Brief Drawer State
  const [aiBriefOpen, setAiBriefOpen] = useState(false);
  const [briefInput, setBriefInput] = useState('');

  // Search inside City popover
  const [cityFilterSearch, setCityFilterSearch] = useState('');

  // Local values for Metrics popover sliders
  const [localFollowers, setLocalFollowers] = useState(filters.minFollowers);
  const [localEngagement, setLocalEngagement] = useState(filters.minEngagement);

  const popoverContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalFollowers(filters.minFollowers);
  }, [filters.minFollowers]);

  useEffect(() => {
    setLocalEngagement(filters.minEngagement);
  }, [filters.minEngagement]);

  // Click outside to dismiss popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverContainerRef.current &&
        !popoverContainerRef.current.contains(event.target as Node)
      ) {
        setActivePopover(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePopover(null);
        setAiBriefOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const togglePopover = (name: string) => {
    setActivePopover((prev) => (prev === name ? null : name));
  };

  const handleRunBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (briefInput.trim() && onExecuteAIBrief) {
      onExecuteAIBrief(briefInput.trim());
      setAiBriefOpen(false);
    }
  };

  // Filtered cities for popover
  const filteredCities = INDIAN_CITIES_LIST.filter((city) =>
    city.toLowerCase().includes(cityFilterSearch.toLowerCase())
  );

  const isPlatformActive = filters.platform !== 'ALL';
  const isCityActive = filters.city !== 'All';
  const isNicheActive = filters.niche !== 'All';
  const isMetricsActive = filters.minFollowers > 5000 || filters.minEngagement > 1.0;
  const isBudgetActive = !!selectedBudgetBracket;

  return (
    <div className="sticky top-0 z-30 w-full bg-[#08090B]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-2.5 space-y-2">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* ============================================================= */}
          {/* LEFT: SEARCH & AI BRIEF MAGIC TRIGGER                        */}
          {/* ============================================================= */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Standard Search Bar */}
            <div className="relative w-full sm:w-64 lg:w-64 xl:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search handle, name, bio..."
                value={filters.search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="w-full h-9 rounded-lg bg-white/[0.03] border border-white/[0.08] pl-9 pr-14 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 font-mono shadow-xs transition-all focus:border-emerald-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {filters.search ? (
                  <button
                    type="button"
                    onClick={() => dispatch(setSearch(''))}
                    className="text-zinc-500 hover:text-white p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/[0.08] bg-[#0C0E12] px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                  </span>
                )}
              </div>
            </div>

            {/* AI Brief Magic Button */}
            <button
              type="button"
              onClick={() => setAiBriefOpen(!aiBriefOpen)}
              className={`h-9 px-3 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 border transition-all ${
                aiBriefOpen
                  ? 'bg-emerald-500 text-black border-emerald-500 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">✨ AI Brief</span>
            </button>
          </div>

          {/* ============================================================= */}
          {/* CENTER: INTERACTIVE POPOVER FILTER PILLS (Raycast Style)       */}
          {/* ============================================================= */}
          <div
            ref={popoverContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 relative"
          >
            {/* 1. Platform Pill */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => togglePopover('platform')}
                className={`h-8 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                  isPlatformActive
                    ? 'bg-emerald-500/12 border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20'
                }`}
              >
                {filters.platform === 'INSTAGRAM' ? (
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                ) : filters.platform === 'YOUTUBE' ? (
                  <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
                ) : null}
                <span>
                  {filters.platform === 'INSTAGRAM'
                    ? 'Instagram'
                    : filters.platform === 'YOUTUBE'
                    ? 'YouTube'
                    : 'Platform'}
                </span>
                {isPlatformActive ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setPlatform('ALL'));
                    }}
                    className="hover:text-white ml-0.5"
                    title="Clear platform"
                  >
                    <X className="w-3 h-3" />
                  </span>
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                )}
              </button>

              {/* Platform Popover */}
              <AnimatePresence>
                {activePopover === 'platform' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-white/[0.1] bg-[#0C0E12] p-1.5 shadow-2xl backdrop-blur-2xl z-50"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 py-1">
                      Select Platform
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setPlatform('ALL'));
                        setActivePopover(null);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-colors ${
                        filters.platform === 'ALL'
                          ? 'bg-emerald-500/15 text-emerald-300 font-bold'
                          : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span>All Platforms</span>
                      {filters.platform === 'ALL' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setPlatform('INSTAGRAM'));
                        setActivePopover(null);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-colors ${
                        filters.platform === 'INSTAGRAM'
                          ? 'bg-pink-500/15 text-pink-300 font-bold'
                          : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                        <span>Instagram</span>
                      </div>
                      {filters.platform === 'INSTAGRAM' && (
                        <Check className="w-3.5 h-3.5 text-pink-400" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setPlatform('YOUTUBE'));
                        setActivePopover(null);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-colors ${
                        filters.platform === 'YOUTUBE'
                          ? 'bg-rose-500/15 text-rose-300 font-bold'
                          : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
                        <span>YouTube</span>
                      </div>
                      {filters.platform === 'YOUTUBE' && (
                        <Check className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. City Hub Pill */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => togglePopover('city')}
                className={`h-8 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                  isCityActive
                    ? 'bg-emerald-500/12 border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isCityActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span className="max-w-[110px] truncate">
                  {isCityActive ? filters.city : '50+ Cities'}
                </span>
                {isCityActive ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setCity('All'));
                    }}
                    className="hover:text-white ml-0.5"
                    title="Clear city"
                  >
                    <X className="w-3 h-3" />
                  </span>
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                )}
              </button>

              {/* City Popover */}
              <AnimatePresence>
                {activePopover === 'city' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-white/[0.1] bg-[#0C0E12] p-3 shadow-2xl backdrop-blur-2xl z-50 space-y-2.5"
                  >
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search 50+ Indian hubs..."
                        value={cityFilterSearch}
                        onChange={(e) => setCityFilterSearch(e.target.value)}
                        className="w-full h-8 rounded-lg bg-[#08090B] border border-white/[0.08] pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 font-mono focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                        Top Commercial Hubs
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {TOP_CITIES_QUICK.map((metro) => (
                          <button
                            key={metro}
                            type="button"
                            onClick={() => {
                              dispatch(setCity(metro));
                              setActivePopover(null);
                            }}
                            className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                              filters.city === metro
                                ? 'bg-emerald-500 text-black font-bold border-emerald-500'
                                : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-white hover:border-white/20'
                            }`}
                          >
                            {metro === 'Indore' ? 'Indore HQ' : metro}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="max-h-48 overflow-y-auto custom-scrollbar border-t border-white/[0.06] pt-1.5 space-y-0.5">
                      {filteredCities.map((city) => {
                        const cityMeta = PAN_INDIA_CITY_MAP[city.toLowerCase().replace(/ /g, '-')];
                        const isSelected = filters.city === city;
                        return (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              dispatch(setCity(city));
                              setActivePopover(null);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left ${
                              isSelected
                                ? 'bg-emerald-500/15 text-emerald-300 font-bold'
                                : 'text-zinc-300 hover:bg-white/[0.04] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span>{city}</span>
                              {cityMeta?.tier && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-white/[0.05] text-zinc-400">
                                  T{cityMeta.tier}
                                </span>
                              )}
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Category / Niche Pill */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => togglePopover('niche')}
                className={`h-8 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                  isNicheActive
                    ? 'bg-emerald-500/12 border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isNicheActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span className="max-w-[110px] truncate">
                  {isNicheActive ? filters.niche : 'All Niches'}
                </span>
                {isNicheActive ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setNiche('All'));
                    }}
                    className="hover:text-white ml-0.5"
                    title="Clear niche"
                  >
                    <X className="w-3 h-3" />
                  </span>
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                )}
              </button>

              {/* Niche Popover */}
              <AnimatePresence>
                {activePopover === 'niche' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-white/[0.1] bg-[#0C0E12] p-3 shadow-2xl backdrop-blur-2xl z-50 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
                      <span>Select Industry Niche</span>
                      {isNicheActive && (
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(setNiche('All'));
                            setActivePopover(null);
                          }}
                          className="text-emerald-400 hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto custom-scrollbar p-0.5">
                      {FULL_SPECTRUM_NICHES.map((niche) => {
                        const isSelected = filters.niche === niche;
                        const nicheKey = Object.keys(PAN_INDIA_NICHE_MAP).find(
                          (k) => PAN_INDIA_NICHE_MAP[k].label === niche
                        );
                        const icon = nicheKey ? PAN_INDIA_NICHE_MAP[nicheKey].icon : '⚡';

                        return (
                          <button
                            key={niche}
                            type="button"
                            onClick={() => {
                              dispatch(setNiche(niche));
                              setActivePopover(null);
                            }}
                            className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all text-left border ${
                              isSelected
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                                : 'bg-[#08090B] border-white/[0.05] text-zinc-300 hover:bg-white/[0.04] hover:text-white'
                            }`}
                          >
                            <span className="truncate">
                              {icon} {niche}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. Reach & ER Pill (Metrics) */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => togglePopover('metrics')}
                className={`h-8 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                  isMetricsActive
                    ? 'bg-emerald-500/12 border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${isMetricsActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span>
                  {isMetricsActive
                    ? `${filters.minFollowers > 5000 ? `≥${formatFollowers(filters.minFollowers)}` : ''}${
                        filters.minFollowers > 5000 && filters.minEngagement > 1.0 ? ' • ' : ''
                      }${filters.minEngagement > 1.0 ? `≥${filters.minEngagement}% ER` : ''}`
                    : 'Metrics'}
                </span>
                {isMetricsActive ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setMinFollowers(5000));
                      dispatch(setMinEngagement(1.0));
                    }}
                    className="hover:text-white ml-0.5"
                    title="Reset metrics"
                  >
                    <X className="w-3 h-3" />
                  </span>
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                )}
              </button>

              {/* Metrics Popover */}
              <AnimatePresence>
                {activePopover === 'metrics' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-white/[0.1] bg-[#0C0E12] p-4 shadow-2xl backdrop-blur-2xl z-50 space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400">Min Followers</span>
                        <span className="text-white font-bold">{formatFollowers(localFollowers)}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="500000"
                        step="5000"
                        value={localFollowers}
                        onChange={(e) => setLocalFollowers(Number(e.target.value))}
                        onMouseUp={() => dispatch(setMinFollowers(localFollowers))}
                        onTouchEnd={() => dispatch(setMinFollowers(localFollowers))}
                        className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex items-center gap-1 justify-between pt-1">
                        {FOLLOWER_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => {
                              setLocalFollowers(preset.value);
                              dispatch(setMinFollowers(preset.value));
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                              filters.minFollowers === preset.value
                                ? 'bg-emerald-500 text-black font-bold border-emerald-500'
                                : 'bg-[#08090B] text-zinc-400 border-white/[0.06] hover:text-white'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-white/[0.06] pt-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400">Min Engagement Rate</span>
                        <span className="text-emerald-400 font-bold">{localEngagement.toFixed(1)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="10.0"
                        step="0.5"
                        value={localEngagement}
                        onChange={(e) => setLocalEngagement(Number(e.target.value))}
                        onMouseUp={() => dispatch(setMinEngagement(localEngagement))}
                        onTouchEnd={() => dispatch(setMinEngagement(localEngagement))}
                        className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex items-center gap-1 justify-between pt-1">
                        {ENGAGEMENT_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => {
                              setLocalEngagement(preset.value);
                              dispatch(setMinEngagement(preset.value));
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                              filters.minEngagement === preset.value
                                ? 'bg-amber-500 text-black font-bold border-amber-500'
                                : 'bg-[#08090B] text-zinc-400 border-white/[0.06] hover:text-white'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 5. Budget Range Pill */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => togglePopover('budget')}
                className={`h-8 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                  isBudgetActive
                    ? 'bg-emerald-500/12 border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20'
                }`}
              >
                <IndianRupee className={`w-3.5 h-3.5 ${isBudgetActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span className="max-w-[110px] truncate">
                  {selectedBudgetBracket || 'Budget ▾'}
                </span>
                {isBudgetActive ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBudgetChange) onBudgetChange(null);
                    }}
                    className="hover:text-white ml-0.5"
                    title="Clear budget filter"
                  >
                    <X className="w-3 h-3" />
                  </span>
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                )}
              </button>

              {/* Budget Popover */}
              <AnimatePresence>
                {activePopover === 'budget' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-white/[0.1] bg-[#0C0E12] p-1.5 shadow-2xl backdrop-blur-2xl z-50"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 py-1">
                      Filter by Estimated Reel Rate
                    </div>
                    {BUDGET_PRESETS.map((preset) => {
                      const isSelected = selectedBudgetBracket === preset.label || (!selectedBudgetBracket && preset.label === 'All Budgets');
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            if (onBudgetChange) {
                              onBudgetChange(preset.label === 'All Budgets' ? null : preset.label);
                            }
                            setActivePopover(null);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-colors ${
                            isSelected
                              ? 'bg-emerald-500/15 text-emerald-300 font-bold'
                              : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <span>{preset.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 6. Credibility >80% Pill (Modash standard) */}
            <button
              type="button"
              onClick={onToggleMinCredibility}
              className={`h-8 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all shrink-0 ${
                minCredibilityOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)] font-semibold'
                  : 'bg-white/[0.03] text-zinc-400 border-white/[0.08] hover:text-white hover:border-white/20'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${minCredibilityOnly ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>Credibility &gt;80%</span>
            </button>

            {/* 7. Direct Contact Toggle Pill */}
            <button
              type="button"
              onClick={() => dispatch(setVerifiedEmailOnly(!filters.verifiedEmailOnly))}
              className={`h-8 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all shrink-0 ${
                filters.verifiedEmailOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)] font-semibold'
                  : 'bg-white/[0.03] text-zinc-400 border-white/[0.08] hover:text-white hover:border-white/20'
              }`}
            >
              <Mail className={`w-3.5 h-3.5 ${filters.verifiedEmailOnly ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>⚡ Verified Email</span>
            </button>
          </div>

          {/* ============================================================= */}
          {/* RIGHT: TELEMETRY & 3-WAY VIEW SWITCHER                        */}
          {/* ============================================================= */}
          <div className="flex items-center gap-2 justify-between lg:justify-end shrink-0 pt-1 lg:pt-0">
            {/* Live Counter */}
            <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">
              <strong className="text-white">{totalCount.toLocaleString('en-IN')}</strong> creators
            </span>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value as any))}
                aria-label="Sort creators"
                className="h-8 appearance-none rounded-lg bg-white/[0.03] border border-white/[0.08] pl-2.5 pr-7 text-xs font-mono text-zinc-300 focus:border-emerald-500/50 focus:outline-none cursor-pointer hover:bg-white/[0.06] transition-colors"
              >
                <option value="followers">Followers (High → Low)</option>
                <option value="engagement">Engagement (High → Low)</option>
                <option value="authenticity">Authenticity (High → Low)</option>
              </select>
              <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
            </div>

            {/* 3-WAY VIEW SWITCHER: Grid vs Table vs Split Inspector */}
            <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500 text-black shadow-xs font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Cards Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-emerald-500 text-black shadow-xs font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Pro Data Table View"
                aria-label="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('split')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'split'
                    ? 'bg-emerald-500 text-black shadow-xs font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Split Live Inspector View"
                aria-label="Split Inspector View"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Import (Apify Scraper) Shortcut */}
            <button
              type="button"
              onClick={onOpenApifyModal}
              className="h-8 inline-flex items-center gap-1 px-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-mono font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-xs shrink-0"
              title="Import influencer via live Apify scraper"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* EXPANDABLE AI BRIEF MAGIC BAR                                 */}
        {/* ============================================================= */}
        <AnimatePresence>
          {aiBriefOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRunBrief}
              className="overflow-hidden pt-2"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl bg-[#0C0E12] border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-2 px-2 shrink-0">
                  <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-mono font-bold text-white whitespace-nowrap">
                    AI Brief Matcher:
                  </span>
                </div>
                <input
                  type="text"
                  placeholder='e.g. "Need 10 skincare creators in Mumbai & Indore under ₹1.5L budget with >3.5% engagement"'
                  value={briefInput}
                  onChange={(e) => setBriefInput(e.target.value)}
                  className="flex-1 h-8 rounded-lg bg-[#08090B] border border-white/[0.08] px-3 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none"
                  autoFocus
                />
                <div className="flex items-center gap-1.5 justify-end">
                  <button
                    type="submit"
                    disabled={isAIMatching || !briefInput.trim()}
                    className="h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isAIMatching ? (
                      <span>Synthesizing...</span>
                    ) : (
                      <>
                        <span>Execute Match</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiBriefOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
