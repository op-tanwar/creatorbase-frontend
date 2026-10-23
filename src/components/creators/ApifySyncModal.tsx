'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { Creator } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatFollowers, formatPercentage } from '@/lib/utils';
import {
  Sparkles,
  Search,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  MapPin,
  Tag,
  AlertCircle,
  Radio,
  Sliders,
  Check,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

interface ApifySyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatorSynced: (creator: Creator) => void;
}

const CITIES = [
  'All',
  'Mumbai',
  'Delhi NCR',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Goa',
  'Chandigarh',
];

const NICHES = [
  'All',
  'Fashion',
  'Beauty',
  'Tech',
  'Food',
  'Fitness',
  'Travel',
  'Finance',
  'Gaming',
  'Lifestyle',
];

const QUICK_SEEDS = [
  { handle: 'ranveer.allahbadia', name: 'Ranveer Allahbadia' },
  { handle: 'komalpandeyofficial', name: 'Komal Pandey' },
  { handle: 'techburner', name: 'Tech Burner' },
  { handle: 'ankurwarikoo', name: 'Ankur Warikoo' },
  { handle: 'kusha.kapila', name: 'Kusha Kapila' },
  { handle: 'sharanhegde_', name: 'Sharan Hegde' },
];

export function ApifySyncModal({ isOpen, onClose, onCreatorSynced }: ApifySyncModalProps) {
  const [handle, setHandle] = useState('');
  const [city, setCity] = useState('All');
  const [niche, setNiche] = useState('All');
  const [forceRefresh, setForceRefresh] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [syncedCreator, setSyncedCreator] = useState<Creator | null>(null);
  const [imgError, setImgError] = useState(false);

  const steps = [
    'Connecting to Apify Actor (apify/instagram-profile-scraper)...',
    'Scraping profile, reel views, and recent posts...',
    'Calculating engagement rate & parsing demographics...',
    'Saving verified metrics to CreatorBase PostgreSQL...',
  ];

  const handleQuickSelect = (suggestedHandle: string) => {
    setHandle(suggestedHandle);
    setSyncedCreator(null);
  };

  const handleSync = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanHandle = handle.trim().replace(/^@/, '');
    if (!cleanHandle) {
      toast.error('Please enter an Instagram handle');
      return;
    }

    try {
      setIsLoading(true);
      setSyncedCreator(null);
      setImgError(false);
      setCurrentStep(0);

      // Visual progress simulator for Apify pipeline
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 900);

      const res = await api.post('/creators/sync-live', {
        handle: cleanHandle,
        city: city !== 'All' ? city : undefined,
        niche: niche !== 'All' ? niche : undefined,
        forceRefresh,
      });

      clearInterval(stepInterval);
      setCurrentStep(3);

      if (res.data.success && res.data.data) {
        const creatorData: Creator = res.data.data;
        setSyncedCreator(creatorData);
        onCreatorSynced(creatorData);
        toast.success(
          res.data.isCached
            ? `Loaded @${creatorData.handle} from verified 24h cache!`
            : `Successfully scraped and imported @${creatorData.handle} via Apify!`
        );
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to sync with Apify';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHandle('');
    setSyncedCreator(null);
    setCurrentStep(0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-6">
        {/* Header Badge & Title */}
        <div className="flex flex-col gap-2 pb-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Apify Live Instagram Sync
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Actor: apify/instagram-profile-scraper</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Import Verified Instagram Creator
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Pull live follower counts, bio metadata, reel views, and calculate dynamic engagement rate directly from Instagram into your workspace catalog.
            </p>
          </div>
        </div>

        {/* Sync Input Form */}
        {!syncedCreator ? (
          <form onSubmit={handleSync} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                INSTAGRAM USERNAME / HANDLE
              </label>
              <div className="relative flex rounded-lg shadow-sm border border-zinc-800 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 bg-zinc-950/80">
                <span className="inline-flex items-center px-3 rounded-l-lg border-r border-zinc-800 text-zinc-500 font-mono text-sm bg-zinc-900/50">
                  @
                </span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. ranveer.allahbadia or techburner"
                  disabled={isLoading}
                  className="flex-1 block w-full px-3 py-2.5 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Suggestions Chips */}
            <div>
              <span className="text-[11px] font-mono text-zinc-500 block mb-1.5">
                POPULAR INDIAN CREATORS (ONE-CLICK SEED):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SEEDS.map((item) => (
                  <button
                    key={item.handle}
                    type="button"
                    onClick={() => handleQuickSelect(item.handle)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
                      handle === item.handle
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    @{item.handle}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Overrides Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  CITY OVERRIDE (OPTIONAL)
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-300 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">Auto-detect from bio & posts</option>
                  {CITIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  NICHE OVERRIDE (OPTIONAL)
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-300 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">Auto-detect from keywords & category</option>
                  {NICHES.filter((n) => n !== 'All').map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Force Refresh Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="forceRefreshCheck"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950"
              />
              <label
                htmlFor="forceRefreshCheck"
                className="text-xs font-mono text-zinc-400 cursor-pointer select-none"
              >
                Bypass 24h cache and force live actor run on Apify
              </label>
            </div>

            {/* Stepper Progress Indicator when loading */}
            {isLoading && (
              <div className="rounded-xl border border-emerald-950/60 bg-emerald-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    Executing Apify Pipeline...
                  </span>
                  <span>Step {currentStep + 1} of 4</span>
                </div>

                <div className="space-y-2">
                  {steps.map((st, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-xs font-mono transition-opacity ${
                        idx === currentStep
                          ? 'text-emerald-300 font-medium opacity-100'
                          : idx < currentStep
                          ? 'text-zinc-500 line-through opacity-70'
                          : 'text-zinc-600 opacity-40'
                      }`}
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px]">
                        {idx < currentStep ? '✓' : idx + 1}
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading || !handle.trim()}
                leftIcon={
                  isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-zinc-950" />
                  )
                }
              >
                {isLoading ? 'Importing from Instagram...' : 'Sync via Apify'}
              </Button>
            </div>
          </form>
        ) : (
          /* Scraped Result Success Preview Card */
          <div className="space-y-5">
            <div className="rounded-xl border border-emerald-500/40 bg-[#121316] p-4.5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-emerald-500/40 shrink-0 bg-zinc-900 flex items-center justify-center shadow-lg">
                    {!imgError ? (
                      <Image
                        src={syncedCreator.avatarUrl}
                        alt={syncedCreator.fullName}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                        unoptimized
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <span className="text-sm font-mono font-bold text-emerald-400 uppercase">
                        {syncedCreator.fullName.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-zinc-100 truncate">
                        {syncedCreator.fullName}
                      </h3>
                      {syncedCreator.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href={`https://instagram.com/${syncedCreator.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        @{syncedCreator.handle}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="text-zinc-600 font-mono text-xs">•</span>
                      <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {syncedCreator.city}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3 h-3" /> Synced
                </span>
              </div>

              {syncedCreator.bio && (
                <p className="text-xs text-zinc-300 font-mono bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80 leading-relaxed">
                  {syncedCreator.bio}
                </p>
              )}

              {/* Scraped Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-[#0B0C0E] p-2.5 border border-[#20232A]">
                <div className="text-center">
                  <span className="text-[10px] text-zinc-500 font-mono block">Followers</span>
                  <span className="font-mono font-bold text-sm text-zinc-100 block mt-0.5">
                    {formatFollowers(syncedCreator.followerCount)}
                  </span>
                </div>
                <div className="text-center border-x border-[#20232A]">
                  <span className="text-[10px] text-zinc-500 font-mono block">Eng. Rate</span>
                  <span className="font-mono font-bold text-sm text-emerald-400 block mt-0.5">
                    {formatPercentage(syncedCreator.engagementRate)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-zinc-500 font-mono block">Avg Views</span>
                  <span className="font-mono font-bold text-sm text-zinc-100 block mt-0.5">
                    {formatFollowers(syncedCreator.avgReelViews)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
                <span>Niche: <strong className="text-zinc-200">{syncedCreator.niche}</strong></span>
                <span>Audience Split: <strong className="text-emerald-400">{syncedCreator.audienceFemalePercentage}% F</strong> / <strong className="text-indigo-400">{syncedCreator.audienceMalePercentage}% M</strong></span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Import Another Handle
              </Button>
              <Button variant="primary" size="sm" onClick={onClose}>
                Done & Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
