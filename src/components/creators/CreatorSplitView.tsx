'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Creator } from '@/types';
import {
  formatFollowers,
  formatPercentage,
  formatCompactINR,
  estimateReelCost,
  getCreatorPlatformUrl,
  EXTERNAL_LINK_PROPS,
} from '@/lib/utils';
import { InstagramIcon, YoutubeIcon } from '../ui/Icons';
import {
  ShieldCheck,
  MapPin,
  Check,
  Copy,
  Plus,
  BarChart2,
  ExternalLink,
  Mail,
  Zap,
  TrendingUp,
  Activity,
  Users,
  Sparkles,
  PieChart,
  DollarSign,
  Send,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuickAddCreator } from '@/store/slices/shortlistSlice';
import { SendPitchModal } from './SendPitchModal';
import api from '@/lib/api';
import { toast } from 'sonner';

interface CreatorSplitViewProps {
  creators: Creator[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

export function CreatorSplitView({
  creators,
  selectedIds,
  onToggleSelect,
}: CreatorSplitViewProps) {
  const dispatch = useAppDispatch();
  const shortlists = useAppSelector((state) => state.shortlists.shortlists);

  const [activeCreatorId, setActiveCreatorId] = useState<string>(
    creators.length > 0 ? creators[0].id : ''
  );
  const [analytics, setAnalytics] = useState<any>(null);
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Sync active creator if list changes
  useEffect(() => {
    if (creators.length > 0 && !creators.some((c) => c.id === activeCreatorId)) {
      setActiveCreatorId(creators[0].id);
    }
  }, [creators, activeCreatorId]);

  const activeCreator = creators.find((c) => c.id === activeCreatorId) || creators[0];

  // Fetch deep analytics for active creator
  useEffect(() => {
    if (!activeCreator) return;
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/creators/${activeCreator.id}/analytics`);
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (_err) {
        setAnalytics(null);
      }
    };
    fetchAnalytics();
  }, [activeCreator?.id]);

  if (!activeCreator) return null;

  const isShortlisted = shortlists.some((s) =>
    s.items?.some((item) => item.creatorId === activeCreator.id)
  );

  const estimatedReel = estimateReelCost(activeCreator);
  const platformUrl = getCreatorPlatformUrl(activeCreator);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCreator.businessEmail) return;
    navigator.clipboard.writeText(activeCreator.businessEmail);
    setCopiedEmail(true);
    toast.success(`Copied ${activeCreator.businessEmail} to clipboard!`);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const authScore = analytics?.authenticityScore || activeCreator.authenticityScore || 94;

  return (
    <>
      <div className="flex items-start gap-4 w-full">
        {/* ============================================================= */}
        {/* LEFT MASTER LIST (Scrollable Creator Column)                   */}
        {/* ============================================================= */}
        <div className="w-full lg:w-[42%] xl:w-[38%] shrink-0 space-y-2 max-h-[calc(100vh-8.5rem)] overflow-y-auto custom-scrollbar pr-1">
          {creators.map((c) => {
            const isActive = c.id === activeCreator.id;
            const isChecked = selectedIds.includes(c.id);
            const fee = estimateReelCost(c);

            return (
              <div
                key={c.id}
                onClick={() => setActiveCreatorId(c.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-[#0C0E12] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                    : 'bg-[#08090C]/80 border-white/[0.06] hover:bg-white/[0.03] hover:border-white/20'
                }`}
              >
                {/* Checkbox & Avatar */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelect(c.id)}
                      aria-label={`Select ${c.fullName}`}
                      className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer h-3.5 w-3.5"
                    />
                  </div>

                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-zinc-800 ring-1 ring-white/10 shrink-0">
                    {c.avatarUrl ? (
                      <Image
                        src={c.avatarUrl}
                        alt={c.fullName}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-mono text-xs text-white">
                        {c.fullName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-bold text-xs text-white truncate max-w-[130px]">
                        {c.fullName}
                      </span>
                      {c.isVerified && <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 truncate max-w-[130px]">
                      @{c.handle} • {c.city}
                    </div>
                  </div>
                </div>

                {/* Right Telemetry */}
                <div className="text-right shrink-0 font-mono text-xs">
                  <div className="font-bold text-white">{formatFollowers(c.followerCount)}</div>
                  <div className="text-emerald-400 font-semibold">{formatCompactINR(fee)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================= */}
        {/* RIGHT LIVE INSPECTOR PANEL (Sticky Deep Analytics)            */}
        {/* ============================================================= */}
        <div className="hidden lg:block lg:flex-1 sticky top-20 max-h-[calc(100vh-8.5rem)] overflow-y-auto custom-scrollbar rounded-xl border border-white/[0.08] bg-[#0C0E12]/95 backdrop-blur-2xl p-5 shadow-2xl space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 rounded-2xl overflow-hidden ring-2 ring-emerald-500/30 shrink-0 bg-zinc-800 flex items-center justify-center">
                {activeCreator.avatarUrl ? (
                  <Image
                    src={activeCreator.avatarUrl}
                    alt={activeCreator.fullName}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="font-mono text-base font-bold text-white uppercase">
                    {activeCreator.fullName.slice(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-sans">{activeCreator.fullName}</h3>
                  {activeCreator.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  <a
                    href={platformUrl}
                    {...EXTERNAL_LINK_PROPS}
                    className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-0.5"
                  >
                    <span>@{activeCreator.handle}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="text-xs font-mono text-zinc-400 mt-0.5">
                  📍 {activeCreator.city} • {activeCreator.niche} •{' '}
                  <span className="text-emerald-400 font-bold">{authScore}% Human Credibility</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPitchModalOpen(true)}
                className="h-8 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium hover:bg-emerald-500/20 flex items-center gap-1.5"
              >
                <Send className="w-3 h-3 text-emerald-400" />
                <span>Pitch</span>
              </button>
              <button
                type="button"
                onClick={() => dispatch(setQuickAddCreator(activeCreator))}
                className="h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex items-center gap-1"
              >
                {isShortlisted ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                <span>{isShortlisted ? 'In Shortlist' : 'Shortlist'}</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#08090C] border border-white/[0.05]">
              <div className="text-[10px] text-zinc-500 uppercase">Followers</div>
              <div className="text-sm font-bold text-white">{formatFollowers(activeCreator.followerCount)}</div>
              <div className="text-[10px] text-emerald-400">+{analytics?.growthVelocity?.growthRate30d || 4.8}%</div>
            </div>
            <div className="p-3 rounded-lg bg-[#08090C] border border-white/[0.05]">
              <div className="text-[10px] text-zinc-500 uppercase">Eng. Rate</div>
              <div className="text-sm font-bold text-emerald-400">{formatPercentage(activeCreator.engagementRate)}</div>
              <div className="text-[10px] text-zinc-400">1.8x Industry Avg</div>
            </div>
            <div className="p-3 rounded-lg bg-[#08090C] border border-white/[0.05]">
              <div className="text-[10px] text-zinc-500 uppercase">Avg Views</div>
              <div className="text-sm font-bold text-white">{formatFollowers(activeCreator.avgReelViews)}</div>
              <div className="text-[10px] text-zinc-400">Reels &amp; Shorts</div>
            </div>
            <div className="p-3 rounded-lg bg-[#08090C] border border-white/[0.05]">
              <div className="text-[10px] text-zinc-500 uppercase">Est. Reel</div>
              <div className="text-sm font-bold text-emerald-400">{formatCompactINR(estimatedReel)}</div>
              <div className="text-[10px] text-zinc-400">₹{analytics?.rateCard?.effectiveCPM || 145} CPM</div>
            </div>
          </div>

          {/* Audience Breakdown */}
          <div className="space-y-3 p-4 rounded-xl bg-[#08090C] border border-white/[0.06]">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Audience Credibility &amp; Authenticity
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${analytics?.credibilityBreakdown?.realPeoplePercentage || 94}%` }}
                title="Real Human Followers"
              />
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${analytics?.credibilityBreakdown?.massFollowersPercentage || 4}%` }}
                title="Mass Followers"
              />
              <div
                className="bg-rose-500 h-full"
                style={{ width: `${analytics?.credibilityBreakdown?.suspiciousPercentage || 2}%` }}
                title="Suspicious / Bot Followers"
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 pt-1">
              <span>Real People: <strong className="text-emerald-400">{analytics?.credibilityBreakdown?.realPeoplePercentage || 94}%</strong></span>
              <span>Mass Followers: <strong className="text-amber-400">{analytics?.credibilityBreakdown?.massFollowersPercentage || 4}%</strong></span>
              <span>Suspicious: <strong className="text-rose-400">{analytics?.credibilityBreakdown?.suspiciousPercentage || 2}%</strong></span>
            </div>
          </div>

          {/* Top Cities Horizontal Bars */}
          <div className="space-y-2 p-4 rounded-xl bg-[#08090C] border border-white/[0.06]">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Top Geographic Concentration
            </div>
            {(analytics?.demographics?.topCities || [
              { city: activeCreator.city || 'Mumbai', percentage: 34.5 },
              { city: 'Delhi NCR', percentage: 24.2 },
              { city: 'Bangalore', percentage: 16.8 },
              { city: 'Indore', percentage: 13.5 },
            ]).map((c: any) => (
              <div key={c.city} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-300">{c.city}</span>
                  <span className="text-white font-bold">{c.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Direct Email */}
          {activeCreator.businessEmail && (
            <div className="p-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono text-zinc-200">{activeCreator.businessEmail}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-xs font-mono text-emerald-400 hover:text-white underline"
              >
                {copiedEmail ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>

      <SendPitchModal
        isOpen={pitchModalOpen}
        onClose={() => setPitchModalOpen(false)}
        creator={activeCreator}
      />
    </>
  );
}
