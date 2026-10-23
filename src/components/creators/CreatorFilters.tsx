'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPlatform,
  setCity,
  setNiche,
  setMinFollowers,
  setMinEngagement,
  setSearch,
  resetFilters,
} from '@/store/slices/filterSlice';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  Tag,
  Users,
  Activity,
  X,
  Check,
  Command,
} from 'lucide-react';
import { formatFollowers } from '@/lib/utils';
import { Button } from '../ui/Button';
import { InstagramIcon, YoutubeIcon } from '../ui/Icons';

const INDIAN_CITIES = [
  'All',
  'Indore',
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Pune',
  'Jaipur',
  'Hyderabad',
  'Goa',
  'Bhopal',
  'Ahmedabad',
  'Surat',
  'Chandigarh',
];

const NICHES = [
  'All',
  'Food',
  'Tech',
  'Fashion',
  'Travel',
  'Fitness',
  'Finance',
  'Lifestyle',
  'Gaming',
  'Comedy',
  'Beauty',
];

// Presets matching Apify / Linear / Vercel filter standards (Enforcing 5K+ nano baseline)
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

const formatFollowerBadge = (val: number): string => {
  if (val <= 5000) return '5K+ (Active Baseline)';
  return `${formatFollowers(val)}+ Followers`;
};

const formatEngagementBadge = (val: number): string => {
  if (val <= 1.0) return '1.0%+ (Quality Floor)';
  return `${val.toFixed(1)}% Min ER`;
};

/* ------------------------------------------------------------------
   1. Minimum Followers Custom Slider Component
------------------------------------------------------------------ */
interface FollowersSliderProps {
  value: number;
  onChange: (val: number) => void;
  onPreset: (val: number) => void;
}

function FollowersSlider({ value, onChange, onPreset }: FollowersSliderProps) {
  const min = 5000;
  const max = 500000;
  const clampedValue = Math.max(min, value);
  const fillPercentage = Math.min(100, Math.max(0, ((clampedValue - min) / (max - min)) * 100));

  return (
    <div className="space-y-2">
      {/* 1. Dual-Value Visual Display & Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Minimum Followers</span>
        </div>
        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs px-2 py-0.5 rounded-full font-semibold shadow-xs">
          {formatFollowerBadge(clampedValue)}
        </span>
      </div>

      {/* 2. Custom Range Track & Glowing Thumb */}
      <div className="relative py-3 sm:py-2 flex items-center w-full touch-pan-x">
        <input
          type="range"
          min={min}
          max={max}
          step="5000"
          value={clampedValue}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${fillPercentage}%, #27272a ${fillPercentage}%, #27272a 100%)`,
          }}
          className="custom-range-slider w-full h-2 rounded-full cursor-pointer appearance-none bg-transparent select-none focus:outline-none"
          aria-label="Minimum Followers"
        />
      </div>

      {/* Scale Indicator */}
      <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-0.5 -mt-1 select-none">
        <span>5K</span>
        <span>100K</span>
        <span>250K</span>
        <span>500K+</span>
      </div>

      {/* 3. Quick-Select Preset Chips / Pills */}
      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
        <span className="text-[10px] font-mono text-zinc-500 mr-0.5">Presets:</span>
        {FOLLOWER_PRESETS.map((preset) => {
          const isActive = clampedValue === preset.value;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPreset(preset.value)}
              className={`px-2 py-0.5 rounded-md font-mono text-[10px] sm:text-[11px] border transition-all ${
                isActive
                  ? 'bg-zinc-800 text-emerald-400 border-emerald-500/40 font-semibold shadow-xs'
                  : 'bg-[#181A1F] text-zinc-400 border-[#2E333D] hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   2. Min. Engagement Rate Custom Slider Component
------------------------------------------------------------------ */
interface EngagementSliderProps {
  value: number;
  onChange: (val: number) => void;
  onPreset: (val: number) => void;
}

function EngagementSlider({ value, onChange, onPreset }: EngagementSliderProps) {
  const min = 1.0;
  const max = 10;
  const clampedValue = Math.max(min, value);
  const fillPercentage = Math.min(100, Math.max(0, ((clampedValue - min) / (max - min)) * 100));

  return (
    <div className="space-y-2">
      {/* 1. Dual-Value Visual Display & Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Min. Engagement Rate</span>
        </div>
        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs px-2 py-0.5 rounded-full font-semibold shadow-xs">
          {formatEngagementBadge(clampedValue)}
        </span>
      </div>

      {/* 2. Custom Range Track & Glowing Thumb */}
      <div className="relative py-3 sm:py-2 flex items-center w-full touch-pan-x">
        <input
          type="range"
          min={min}
          max={max}
          step="0.5"
          value={clampedValue}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${fillPercentage}%, #27272a ${fillPercentage}%, #27272a 100%)`,
          }}
          className="custom-range-slider w-full h-2 rounded-full cursor-pointer appearance-none bg-transparent select-none focus:outline-none"
          aria-label="Minimum Engagement Rate"
        />
      </div>

      {/* Scale Indicator */}
      <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-0.5 -mt-1 select-none">
        <span>1.0%</span>
        <span>2.5%</span>
        <span>5.0%</span>
        <span>10.0%+</span>
      </div>

      {/* 3. Quick-Select Preset Chips / Pills */}
      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
        <span className="text-[10px] font-mono text-zinc-500 mr-0.5">Presets:</span>
        {ENGAGEMENT_PRESETS.map((preset) => {
          const isActive = clampedValue === preset.value;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPreset(preset.value)}
              className={`px-2 py-0.5 rounded-md font-mono text-[10px] sm:text-[11px] border transition-all ${
                isActive
                  ? 'bg-zinc-800 text-emerald-400 border-emerald-500/40 font-semibold shadow-xs'
                  : 'bg-[#181A1F] text-zinc-400 border-[#2E333D] hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   3. Main CreatorFilters Component
------------------------------------------------------------------ */
export function CreatorFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Local state for smooth 60fps dragging
  const [localFollowers, setLocalFollowers] = useState<number>(filters.minFollowers);
  const [localEngagement, setLocalEngagement] = useState<number>(filters.minEngagement);

  // Synchronize local states when Redux filters change externally (reset, chip clear)
  useEffect(() => {
    setLocalFollowers(filters.minFollowers);
  }, [filters.minFollowers]);

  useEffect(() => {
    setLocalEngagement(filters.minEngagement);
  }, [filters.minEngagement]);

  // Debounce timer references
  const followersDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const engagementDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (followersDebounceRef.current) clearTimeout(followersDebounceRef.current);
      if (engagementDebounceRef.current) clearTimeout(engagementDebounceRef.current);
    };
  }, []);

  // Drag handlers with debouncing to prevent API spamming
  const handleFollowersChange = useCallback((val: number) => {
    setLocalFollowers(val);
    if (followersDebounceRef.current) clearTimeout(followersDebounceRef.current);
    followersDebounceRef.current = setTimeout(() => {
      dispatch(setMinFollowers(val));
    }, 200);
  }, [dispatch]);

  const handleEngagementChange = useCallback((val: number) => {
    setLocalEngagement(val);
    if (engagementDebounceRef.current) clearTimeout(engagementDebounceRef.current);
    engagementDebounceRef.current = setTimeout(() => {
      dispatch(setMinEngagement(val));
    }, 200);
  }, [dispatch]);

  // Fast 1-click preset handlers
  const handleFollowersPreset = useCallback((val: number) => {
    if (followersDebounceRef.current) clearTimeout(followersDebounceRef.current);
    setLocalFollowers(val);
    dispatch(setMinFollowers(val));
  }, [dispatch]);

  const handleEngagementPreset = useCallback((val: number) => {
    if (engagementDebounceRef.current) clearTimeout(engagementDebounceRef.current);
    setLocalEngagement(val);
    dispatch(setMinEngagement(val));
  }, [dispatch]);

  // Master reset
  const handleResetAll = useCallback(() => {
    if (followersDebounceRef.current) clearTimeout(followersDebounceRef.current);
    if (engagementDebounceRef.current) clearTimeout(engagementDebounceRef.current);
    setLocalFollowers(5000);
    setLocalEngagement(1.0);
    dispatch(resetFilters());
  }, [dispatch]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K or /)
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

  const activeFilterCount =
    (filters.platform !== 'ALL' ? 1 : 0) +
    (filters.city !== 'All' ? 1 : 0) +
    (filters.niche !== 'All' ? 1 : 0) +
    (filters.minFollowers > 5000 ? 1 : 0) +
    (filters.minEngagement > 1.0 ? 1 : 0) +
    (filters.search.trim() !== '' ? 1 : 0);

  return (
    <div className="space-y-2.5">
      {/* Top Search & Primary Filter Bar */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Apify-Style High-Tech Search Box */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search creators by handle, name, city or niche keyword..."
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full rounded-xl bg-[#121316] border border-[#262930] pl-10 pr-20 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 font-mono shadow-sm transition-all focus:border-emerald-500 focus:bg-[#16181D] focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          {/* Shortcut badge or clear button */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {filters.search ? (
              <button
                type="button"
                onClick={() => dispatch(setSearch(''))}
                className="text-zinc-500 hover:text-zinc-200 p-0.5 rounded"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[#2E333D] bg-[#181A1F] px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </span>
            )}
          </div>
        </div>

        {/* Platform Selector Segmented Control (All / Instagram / YouTube) */}
        <div className="flex items-center rounded-xl bg-[#121316] border border-[#262930] p-1 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => dispatch(setPlatform('ALL'))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              filters.platform === 'ALL'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <span>All</span>
          </button>
          <button
            type="button"
            onClick={() => dispatch(setPlatform('INSTAGRAM'))}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              filters.platform === 'INSTAGRAM'
                ? 'bg-pink-950/60 text-pink-300 shadow-sm border border-pink-700/60'
                : 'text-zinc-400 hover:text-pink-400 hover:bg-pink-950/20'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden lg:inline">Instagram</span>
          </button>
          <button
            type="button"
            onClick={() => dispatch(setPlatform('YOUTUBE'))}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              filters.platform === 'YOUTUBE'
                ? 'bg-rose-950/60 text-rose-300 shadow-sm border border-rose-700/60'
                : 'text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20'
            }`}
          >
            <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden lg:inline">YouTube</span>
          </button>
        </div>

        {/* City Select Dropdown (Desktop & Tablet) */}
        <div className="relative shrink-0 hidden sm:block min-w-[150px] lg:min-w-[170px]">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400 pointer-events-none" />
          <select
            value={filters.city}
            onChange={(e) => dispatch(setCity(e.target.value))}
            className="w-full appearance-none rounded-xl bg-[#121316] border border-[#262930] pl-9 pr-8 py-2.5 text-xs sm:text-sm text-zinc-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-mono"
          >
            {INDIAN_CITIES.map((c) => (
              <option key={c} value={c} className="bg-[#121316] text-zinc-200">
                {c === 'All' ? 'Pan-India (All Cities)' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Slide-Over Filters Trigger Button */}
        <Button
          variant="secondary"
          size="md"
          className="relative shrink-0 md:hidden border-[#262930] bg-[#121316]"
          leftIcon={<SlidersHorizontal className="w-4 h-4 text-emerald-400" />}
          onClick={() => setMobileDrawerOpen(true)}
        >
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-mono font-bold text-zinc-950">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Quick Reset All (Desktop) */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetAll}
            className="hidden md:inline-flex items-center gap-1.5 shrink-0 rounded-xl border border-[#262930] bg-[#121316] px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-colors"
            title="Reset all active filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Active Filters Summary Pill Ribbon */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-zinc-500 mr-1">Active:</span>

          {filters.platform !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[11px] font-mono text-zinc-300">
              <span>Platform: {filters.platform === 'INSTAGRAM' ? 'Instagram' : 'YouTube'}</span>
              <button onClick={() => dispatch(setPlatform('ALL'))} className="hover:text-white" title="Remove platform filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.city !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 text-[11px] font-mono text-emerald-300">
              <span>City: {filters.city}</span>
              <button onClick={() => dispatch(setCity('All'))} className="hover:text-white" title="Remove city filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.niche !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/40 bg-indigo-950/40 px-2 py-0.5 text-[11px] font-mono text-indigo-300">
              <span>Niche: {filters.niche}</span>
              <button onClick={() => dispatch(setNiche('All'))} className="hover:text-white" title="Remove niche filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.minFollowers > 5000 && (
            <span className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[11px] font-mono text-zinc-300">
              <span>Followers: &gt; {formatFollowers(filters.minFollowers)}</span>
              <button onClick={() => handleFollowersPreset(5000)} className="hover:text-white" title="Reset followers to 5K baseline">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.minEngagement > 1.0 && (
            <span className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[11px] font-mono text-zinc-300">
              <span>ER: &gt; {filters.minEngagement}%</span>
              <button onClick={() => handleEngagementPreset(1.0)} className="hover:text-white" title="Reset engagement to 1.0% baseline">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.search && (
            <span className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[11px] font-mono text-zinc-300">
              <span>&ldquo;{filters.search}&rdquo;</span>
              <button onClick={() => dispatch(setSearch(''))} className="hover:text-white" title="Remove search filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetAll}
            className="text-[11px] font-mono text-zinc-400 hover:text-emerald-400 ml-1 underline transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Desktop Horizontal Controls Panel */}
      <div className="hidden md:block rounded-xl bg-[#121316] border border-[#24272E] p-4 space-y-4 shadow-sm">
        {/* Niche Pills */}
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-zinc-400 mr-2 flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-400" />
              Category:
            </span>
            {NICHES.map((n) => {
              const isSelected = filters.niche === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => dispatch(setNiche(n))}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                      : 'bg-[#181A1F] text-zinc-300 hover:bg-zinc-800 hover:text-white border border-[#2E333D]'
                  }`}
                >
                  {n === 'All' ? 'All Niches' : n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders Grid: Followers & Engagement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3.5 border-t border-[#20232A]">
          <FollowersSlider
            value={localFollowers}
            onChange={handleFollowersChange}
            onPreset={handleFollowersPreset}
          />
          <EngagementSlider
            value={localEngagement}
            onChange={handleEngagementChange}
            onPreset={handleEngagementPreset}
          />
        </div>
      </div>

      {/* Mobile Slide-Over Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-[#121316] border-l border-[#262930] p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-right duration-250">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#24272E]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm font-sans">Filter Influencers</h3>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/40">
                      {activeFilterCount} Active
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Platform Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300">
                  Platform
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => dispatch(setPlatform('ALL'))}
                    className={`py-2 rounded-lg text-xs font-mono font-medium border text-center transition-all ${
                      filters.platform === 'ALL'
                        ? 'bg-zinc-800 text-zinc-100 border-zinc-600'
                        : 'bg-[#121316] text-zinc-400 border-[#262930]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(setPlatform('INSTAGRAM'))}
                    className={`py-2 flex items-center justify-center gap-1 rounded-lg text-xs font-mono font-medium border text-center transition-all ${
                      filters.platform === 'INSTAGRAM'
                        ? 'bg-pink-950/60 text-pink-300 border-pink-700/60'
                        : 'bg-[#121316] text-zinc-400 border-[#262930]'
                    }`}
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(setPlatform('YOUTUBE'))}
                    className={`py-2 flex items-center justify-center gap-1 rounded-lg text-xs font-mono font-medium border text-center transition-all ${
                      filters.platform === 'YOUTUBE'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-700/60'
                        : 'bg-[#121316] text-zinc-400 border-[#262930]'
                    }`}
                  >
                    <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
                    <span>YouTube</span>
                  </button>
                </div>
              </div>

              {/* City Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Target City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => dispatch(setCity(e.target.value))}
                  className="w-full appearance-none rounded-xl bg-[#0B0C0E] border border-[#2E333D] p-2.5 text-xs font-mono text-zinc-200"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-[#121316]">
                      {c === 'All' ? 'Pan-India (All Cities)' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Niche Categories */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {NICHES.map((n) => {
                    const isSelected = filters.niche === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => dispatch(setNiche(n))}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-mono transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-zinc-950 font-bold'
                            : 'bg-[#181A1F] text-zinc-300 border border-[#2E333D]'
                        }`}
                      >
                        {n === 'All' ? 'All Niches' : n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Followers Slider */}
              <FollowersSlider
                value={localFollowers}
                onChange={handleFollowersChange}
                onPreset={handleFollowersPreset}
              />

              {/* Mobile Engagement Slider */}
              <EngagementSlider
                value={localEngagement}
                onChange={handleEngagementChange}
                onPreset={handleEngagementPreset}
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#24272E] flex items-center gap-2.5 mt-6">
              <Button
                variant="outline"
                size="md"
                className="flex-1 text-xs font-mono"
                onClick={handleResetAll}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset All
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 text-xs font-mono font-bold"
                onClick={() => setMobileDrawerOpen(false)}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
