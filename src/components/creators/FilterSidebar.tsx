'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPlatform,
  setCity,
  setNiche,
  setMinFollowers,
  setMinEngagement,
  setVerifiedEmailOnly,
  resetFilters,
} from '@/store/slices/filterSlice';
import {
  ChevronDown,
  MapPin,
  Sparkles,
  Users,
  Activity,
  Mail,
  RotateCcw,
  Check,
  Search,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import { INDIAN_CITIES_LIST, FULL_SPECTRUM_NICHES } from '@/lib/constants';
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

interface FilterSidebarProps {
  className?: string;
  totalResults?: number;
  onApplyMobile?: () => void;
  isMobileDrawer?: boolean;
}

export function FilterSidebar({
  className = '',
  totalResults,
  onApplyMobile,
  isMobileDrawer = false,
}: FilterSidebarProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    platform: true,
    city: true,
    niche: true,
    followers: false,
    engagement: false,
    email: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Search states inside accordions
  const [citySearch, setCitySearch] = useState('');
  const [nicheSearch, setNicheSearch] = useState('');

  // Local slider states for smooth dragging
  const [localFollowers, setLocalFollowers] = useState(filters.minFollowers);
  const [localEngagement, setLocalEngagement] = useState(filters.minEngagement);

  useEffect(() => {
    setLocalFollowers(filters.minFollowers);
  }, [filters.minFollowers]);

  useEffect(() => {
    setLocalEngagement(filters.minEngagement);
  }, [filters.minEngagement]);

  // Debounce timers for range sliders
  const followersTimer = useRef<NodeJS.Timeout | null>(null);
  const engagementTimer = useRef<NodeJS.Timeout | null>(null);

  const handleFollowersChange = useCallback(
    (val: number) => {
      setLocalFollowers(val);
      if (followersTimer.current) clearTimeout(followersTimer.current);
      followersTimer.current = setTimeout(() => {
        dispatch(setMinFollowers(val));
      }, 150);
    },
    [dispatch]
  );

  const handleEngagementChange = useCallback(
    (val: number) => {
      setLocalEngagement(val);
      if (engagementTimer.current) clearTimeout(engagementTimer.current);
      engagementTimer.current = setTimeout(() => {
        dispatch(setMinEngagement(val));
      }, 150);
    },
    [dispatch]
  );

  const handleResetAll = useCallback(() => {
    if (followersTimer.current) clearTimeout(followersTimer.current);
    if (engagementTimer.current) clearTimeout(engagementTimer.current);
    setLocalFollowers(5000);
    setLocalEngagement(1.0);
    dispatch(resetFilters());
  }, [dispatch]);

  // Filtered lists
  const filteredCities = INDIAN_CITIES_LIST.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredNiches = FULL_SPECTRUM_NICHES.filter((n) =>
    n.toLowerCase().includes(nicheSearch.toLowerCase())
  );

  // Active filter count
  const activeCount =
    (filters.platform !== 'ALL' ? 1 : 0) +
    (filters.city !== 'All' ? 1 : 0) +
    (filters.niche !== 'All' ? 1 : 0) +
    (filters.minFollowers > 5000 ? 1 : 0) +
    (filters.minEngagement > 1.0 ? 1 : 0) +
    (filters.verifiedEmailOnly ? 1 : 0);

  // Follower fill percentage
  const minF = 5000;
  const maxF = 500000;
  const clampedF = Math.max(minF, localFollowers);
  const fillF = Math.min(100, Math.max(0, ((clampedF - minF) / (maxF - minF)) * 100));

  // Engagement fill percentage
  const minE = 1.0;
  const maxE = 10.0;
  const clampedE = Math.max(minE, localEngagement);
  const fillE = Math.min(100, Math.max(0, ((clampedE - minE) / (maxE - minE)) * 100));

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#0C0E12]/90 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${className}`}
    >
      {/* Scrollable Filters Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 divide-y divide-white/[0.05] custom-scrollbar">
        {/* Header Title & Active Badge */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Filter Engine
            </span>
          </div>
          {activeCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{activeCount} Active</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              All Indexed
            </span>
          )}
        </div>

        {/* 1. Platform Accordion */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => toggleSection('platform')}
            className="flex w-full items-center justify-between text-xs font-mono font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <span>Platform</span>
              {filters.platform !== 'ALL' && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                openSections.platform ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.platform && (
            <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-xl bg-[#08090C] p-1 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => dispatch(setPlatform('ALL'))}
                className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  filters.platform === 'ALL'
                    ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => dispatch(setPlatform('INSTAGRAM'))}
                className={`py-1.5 flex items-center justify-center gap-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  filters.platform === 'INSTAGRAM'
                    ? 'bg-pink-950/70 text-pink-300 border border-pink-700/50 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-pink-300'
                }`}
                title="Instagram Creators"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Insta</span>
              </button>
              <button
                type="button"
                onClick={() => dispatch(setPlatform('YOUTUBE'))}
                className={`py-1.5 flex items-center justify-center gap-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  filters.platform === 'YOUTUBE'
                    ? 'bg-rose-950/70 text-rose-300 border border-rose-700/50 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-rose-300'
                }`}
                title="YouTube Creators"
              >
                <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>YT</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. City (50+ Hubs) Accordion */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => toggleSection('city')}
            className="flex w-full items-center justify-between text-xs font-mono font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>City / Regional Hub</span>
              {filters.city !== 'All' && (
                <span className="text-[10px] text-emerald-400 font-bold">
                  ({filters.city})
                </span>
              )}
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                openSections.city ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.city && (
            <div className="mt-2.5 space-y-2">
              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1">
                {TOP_CITIES_QUICK.map((c) => {
                  const isSelected = filters.city === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => dispatch(setCity(c))}
                      className={`text-[11px] font-mono px-2 py-1 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-black font-bold shadow-xs'
                          : 'bg-[#08090C] text-zinc-400 border border-white/[0.06] hover:text-white hover:border-white/[0.12]'
                      }`}
                    >
                      {c === 'All' ? 'Pan-India' : c}
                      {c === 'Indore' && (
                        <span className="ml-1 text-[9px] opacity-75">HQ</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Search input for 50+ Cities */}
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter 50+ Indian cities..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full rounded-lg bg-[#08090C] border border-white/[0.06] pl-7 pr-6 py-1.5 text-[11px] font-mono text-zinc-200 placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none"
                />
                {citySearch && (
                  <button
                    type="button"
                    onClick={() => setCitySearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Scrollable City List if searched */}
              {citySearch && (
                <div className="max-h-36 overflow-y-auto no-scrollbar space-y-0.5 rounded-lg border border-white/[0.06] bg-[#08090C] p-1">
                  {filteredCities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        dispatch(setCity(c));
                        setCitySearch('');
                      }}
                      className={`w-full text-left px-2 py-1 text-xs font-mono rounded flex items-center justify-between ${
                        filters.city === c
                          ? 'bg-emerald-500/10 text-emerald-300 font-bold'
                          : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <span>{c === 'All' ? 'Pan-India (All Cities)' : c}</span>
                      {filters.city === c && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  ))}
                  {filteredCities.length === 0 && (
                    <p className="p-2 text-[11px] font-mono text-zinc-500 text-center">
                      No matching cities
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Niche / Category Accordion */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => toggleSection('niche')}
            className="flex w-full items-center justify-between text-xs font-mono font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Niche / Category</span>
              {filters.niche !== 'All' && (
                <span className="text-[10px] text-emerald-400 font-bold truncate max-w-[100px]">
                  ({filters.niche})
                </span>
              )}
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                openSections.niche ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.niche && (
            <div className="mt-2.5 space-y-2">
              <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                {FULL_SPECTRUM_NICHES.map((n) => {
                  const isSelected = filters.niche === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => dispatch(setNiche(n))}
                      className={`text-[11px] font-mono px-2 py-1 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-black font-bold shadow-xs'
                          : 'bg-[#08090C] text-zinc-400 border border-white/[0.06] hover:text-white hover:border-white/[0.12]'
                      }`}
                    >
                      {n === 'All' ? 'All Niches' : n}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Follower Range Accordion */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => toggleSection('followers')}
            className="flex w-full items-center justify-between text-xs font-mono font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Min. Followers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {clampedF <= 5000 ? '5K+ (All)' : `${formatFollowers(clampedF)}+`}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                  openSections.followers ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {openSections.followers && (
            <div className="mt-2.5 space-y-2">
              <div className="relative py-2 flex items-center w-full">
                <input
                  type="range"
                  min={minF}
                  max={maxF}
                  step="5000"
                  value={clampedF}
                  onChange={(e) => handleFollowersChange(parseInt(e.target.value, 10))}
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${fillF}%, #27272a ${fillF}%, #27272a 100%)`,
                  }}
                  className="custom-range-slider w-full h-2 rounded-full cursor-pointer appearance-none bg-transparent focus:outline-none"
                  aria-label="Minimum Followers"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1 flex-wrap">
                {FOLLOWER_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setLocalFollowers(p.value);
                      dispatch(setMinFollowers(p.value));
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      clampedF === p.value
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-[#08090C] text-zinc-400 border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Engagement Rate Accordion */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => toggleSection('engagement')}
            className="flex w-full items-center justify-between text-xs font-mono font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Min. Engagement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {clampedE <= 1.0 ? '1.0%+ (Floor)' : `${clampedE.toFixed(1)}%+`}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                  openSections.engagement ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {openSections.engagement && (
            <div className="mt-2.5 space-y-2">
              <div className="relative py-2 flex items-center w-full">
                <input
                  type="range"
                  min={minE}
                  max={maxE}
                  step="0.5"
                  value={clampedE}
                  onChange={(e) => handleEngagementChange(parseFloat(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${fillE}%, #27272a ${fillE}%, #27272a 100%)`,
                  }}
                  className="custom-range-slider w-full h-2 rounded-full cursor-pointer appearance-none bg-transparent focus:outline-none"
                  aria-label="Minimum Engagement"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1 flex-wrap">
                {ENGAGEMENT_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setLocalEngagement(p.value);
                      dispatch(setMinEngagement(p.value));
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      clampedE === p.value
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-[#08090C] text-zinc-400 border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. Verified Email Toggle */}
        <div className="pt-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <span className="text-xs font-mono font-semibold text-zinc-200 block group-hover:text-white transition-colors">
                  Verified Email Only
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  535+ Direct Collab Inboxes
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={filters.verifiedEmailOnly}
              onClick={() => dispatch(setVerifiedEmailOnly(!filters.verifiedEmailOnly))}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                filters.verifiedEmailOnly ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  filters.verifiedEmailOnly ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Sticky Sidebar Footer */}
      <div className="p-3 border-t border-white/[0.06] bg-[#090B0E]/80 backdrop-blur-md rounded-b-2xl flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleResetAll}
          disabled={activeCount === 0}
          className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg border transition-colors ${
            activeCount > 0
              ? 'border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/[0.15] bg-[#0C0E12]'
              : 'border-transparent text-zinc-600 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>

        {isMobileDrawer ? (
          <button
            type="button"
            onClick={onApplyMobile}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-mono font-bold text-black shadow-md shadow-emerald-500/20 active:scale-98"
          >
            <span>Show {totalResults !== undefined ? `${totalResults} ` : ''}Creators</span>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        ) : (
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Real-Time Index</span>
          </div>
        )}
      </div>
    </div>
  );
}
