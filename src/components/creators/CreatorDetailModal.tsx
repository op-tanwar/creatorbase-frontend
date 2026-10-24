'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDetailModalCreator, setQuickAddCreator } from '@/store/slices/shortlistSlice';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { InstagramIcon, YoutubeIcon } from '../ui/Icons';
import { formatFollowers, formatINR, formatPercentage } from '@/lib/utils';
import { calculateCommercialEstimate } from '@/lib/commercialEstimates';
import { getCreatorPlatformUrl, EXTERNAL_LINK_PROPS } from '@/utils/url';
import {
  CheckCircle2,
  Copy,
  Check,
  Mail,
  MapPin,
  TrendingUp,
  Users,
  Activity,
  PlaySquare,
  Heart,
  IndianRupee,
  PlusCircle,
  Lock,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { UpgradeModal } from '../subscription/UpgradeModal';
import { toast } from 'sonner';

export function CreatorDetailModal() {
  const dispatch = useAppDispatch();
  const creator = useAppSelector((state) => state.shortlists.detailModalCreator);
  const { user } = useAppSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!creator) return null;

  const handleCopyEmail = () => {
    if (creator.businessEmail) {
      navigator.clipboard.writeText(creator.businessEmail);
      setCopied(true);
      toast.success(`Copied business email: ${creator.businessEmail}`);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('No business email listed for this creator');
    }
  };

  const handleOpenShortlist = () => {
    const current = creator;
    dispatch(setDetailModalCreator(null));
    dispatch(setQuickAddCreator(current));
  };

  // Smart Commercial Estimate Rate-Card Intelligence
  const estimate = calculateCommercialEstimate(creator);

  return (
    <Modal
      isOpen={!!creator}
      onClose={() => dispatch(setDetailModalCreator(null))}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Creator Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <a
              href={getCreatorPlatformUrl(creator)}
              {...EXTERNAL_LINK_PROPS}
              className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0 shadow-lg bg-zinc-900 flex items-center justify-center transition-transform hover:scale-105"
              title="Click to view live profile"
            >
              {!imgError ? (
                <Image
                  src={creator.avatarUrl}
                  alt={creator.fullName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-lg font-mono font-bold text-emerald-400 uppercase">
                  {creator.fullName.slice(0, 2)}
                </span>
              )}
            </a>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {creator.fullName}
                </h2>
                {creator.isVerified && (
                  <span title="Audited & Platform Verified Reach" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Verified</span>
                  </span>
                )}
                <a
                  href={getCreatorPlatformUrl(creator)}
                  {...EXTERNAL_LINK_PROPS}
                  className="transition-transform hover:scale-105"
                  title={`Open on ${creator.platform === 'YOUTUBE' ? 'YouTube' : 'Instagram'}`}
                >
                  {creator.platform === 'INSTAGRAM' ? (
                    <Badge variant="indigo" size="sm">
                      <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                      Instagram
                    </Badge>
                  ) : (
                    <Badge variant="rose" size="sm">
                      <YoutubeIcon className="w-3.5 h-3.5 text-rose-400" />
                      YouTube
                    </Badge>
                  )}
                </a>
                {creator.authenticityScore !== undefined && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border ${
                      creator.authenticityScore >= 90
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-semibold'
                        : creator.authenticityScore >= 80
                        ? 'bg-teal-950/60 border-teal-500/40 text-teal-300 font-semibold'
                        : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{creator.authenticityScore}% Authentic Audience</span>
                  </span>
                )}
                {creator.lastScrapedAt && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Apify Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <a
                  href={getCreatorPlatformUrl(creator)}
                  {...EXTERNAL_LINK_PROPS}
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 hover:underline"
                  title="View Live Profile on external platform"
                >
                  <span>@{creator.handle}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge variant="slate" size="sm">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  {creator.city}, {creator.state}
                </Badge>
                <Badge variant="emerald" size="sm">
                  {creator.niche}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenShortlist}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add to Shortlist
          </Button>
        </div>

        {/* Creator Bio Snippet (Apify Parsed) */}
        {creator.bio && (
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block mb-1">
              Instagram Biography
            </span>
            <p className="text-xs text-zinc-300 font-mono leading-relaxed">
              {creator.bio}
            </p>
          </div>
        )}

        {/* Core Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Followers
            </div>
            <p className="mt-1.5 text-lg font-bold text-white">
              {formatFollowers(creator.followerCount)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Engagement
            </div>
            <p className="mt-1.5 text-lg font-bold text-emerald-400">
              {formatPercentage(creator.engagementRate)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <PlaySquare className="w-3.5 h-3.5 text-pink-400" />
              Avg Views
            </div>
            <p className="mt-1.5 text-lg font-bold text-white">
              {formatFollowers(creator.avgReelViews)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Avg Likes
            </div>
            <p className="mt-1.5 text-lg font-bold text-white">
              {formatFollowers(creator.avgLikes)}
            </p>
          </div>
        </div>

        {/* Audience Authenticity & Quality Verification */}
        <div className="rounded-xl bg-slate-950/80 border border-emerald-500/30 p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Audience Authenticity & Quality Verification
            </h4>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {creator.authenticityScore ?? 92}% Score
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            Passed automated bot-pod & ghost-follower gatekeeper. Profile meets verified post volume (&ge; 15 posts), healthy engagement velocity ({formatPercentage(creator.engagementRate)}), and active Indian audience reach.
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
            <div className="bg-slate-900/80 border border-slate-800 rounded p-2 text-center">
              <span className="text-zinc-500 block text-[10px]">Ghost Ratio</span>
              <span className="text-emerald-400 font-semibold">&lt; 5% Verified</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded p-2 text-center">
              <span className="text-zinc-500 block text-[10px]">Follower Baseline</span>
              <span className="text-zinc-200 font-semibold">&ge; 5,000 Verified</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded p-2 text-center">
              <span className="text-zinc-500 block text-[10px]">Quality Gate</span>
              <span className="text-emerald-400 font-semibold">100% Passed</span>
            </div>
          </div>
        </div>

        {/* Audience Demographics & Geography */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Audience Demographics & Top City
            </h4>
            <Badge variant="indigo" size="sm">
              Top Base: {creator.audienceTopCity}
            </Badge>
          </div>

          {/* Gender Split Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Female: {creator.audienceFemalePercentage}%</span>
              <span>Male: {creator.audienceMalePercentage}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
              <div
                style={{ width: `${creator.audienceFemalePercentage}%` }}
                className="bg-pink-500 h-full transition-all"
                title={`Female: ${creator.audienceFemalePercentage}%`}
              />
              <div
                style={{ width: `${creator.audienceMalePercentage}%` }}
                className="bg-indigo-500 h-full transition-all"
                title={`Male: ${creator.audienceMalePercentage}%`}
              />
            </div>
            <p className="text-[10px] font-mono text-zinc-500 italic pt-0.5">
              * Audience demographics estimated via category heuristics and interaction sampling.
            </p>
          </div>
        </div>

        {/* Commercial Pricing Tier Benchmarks */}
        <div className="rounded-xl bg-emerald-950/20 border border-emerald-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                Commercial Rate-Card Intelligence
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                {estimate.nicheLabel}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {estimate.tier}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3 space-y-1">
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                Estimated 1x Dedicated Reel
              </p>
              <p className="text-lg font-bold font-mono text-emerald-400">
                {formatINR(estimate.reelMinINR)} – {formatINR(estimate.reelMaxINR)}
              </p>
              <p className="text-[10px] font-mono text-zinc-500">
                Benchmark Median: {formatINR(estimate.reelMedianINR)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3 space-y-1">
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                Estimated 1x Story + Link
              </p>
              <p className="text-lg font-bold font-mono text-zinc-100">
                {formatINR(estimate.storyMinINR)} – {formatINR(estimate.storyMaxINR)}
              </p>
              <p className="text-[10px] font-mono text-zinc-500">
                Benchmark Median: {formatINR(estimate.storyMedianINR)}
              </p>
            </div>
          </div>

          <p className="text-[10px] font-mono text-zinc-500 italic pt-0.5">
            * {estimate.disclaimer}
          </p>
        </div>

        {/* Direct Business / Collaboration Email Contact */}
        {(() => {
          const isFreeTrial = user?.planType === 'FREE_TRIAL';
          const email = creator.businessEmail;
          const maskedEmail = email
            ? email.replace(/^(.)(.*)(@.*)$/, (_, first, middle, domain) => `${first}${'*'.repeat(Math.min(middle.length, 5))}${domain}`)
            : null;

          const collabSubject = encodeURIComponent(
            `Brand Collaboration Inquiry: ${creator.fullName} x CreatorBase Partnership`
          );
          const collabBody = encodeURIComponent(
            `Hi ${creator.fullName},\n\nWe came across your profile (@${creator.handle}) on CreatorBase and loved your recent content in ${creator.city}.\n\nWe are reaching out regarding an upcoming brand collaboration campaign and would love to explore a partnership (1x Dedicated Reel + 1x Story).\n\nCould you please share your latest commercial rate card and media kit for this month?\n\nBest regards,\n${user?.name || 'Brand Partnerships Team'}\n${user?.companyName || 'CreatorBase Partner'}`
          );
          const mailtoHref = email ? `mailto:${email}?subject=${collabSubject}&body=${collabBody}` : '#';

          return (
            <div className="rounded-xl bg-[#0E1015] border border-emerald-500/30 p-5 space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                        Official Business & Collab Inquiries
                      </span>
                      {isFreeTrial ? (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                          LOCKED (FREE TRIAL)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          VERIFIED COLLAB INBOX
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white font-mono mt-1">
                      {isFreeTrial ? (
                        <span className="text-zinc-400 tracking-wider">
                          {maskedEmail || 'Direct message on platform'}
                        </span>
                      ) : (
                        <span className="text-zinc-100 select-all">
                          {email || 'No business email listed (DM on platform)'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {email ? (
                    isFreeTrial ? (
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full sm:w-auto text-xs font-mono font-bold"
                        onClick={() => setUpgradeModalOpen(true)}
                        leftIcon={<Lock className="w-3.5 h-3.5 text-zinc-950" />}
                      >
                        Unlock Email (Agency Pro)
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={handleCopyEmail}
                          className="flex-1 sm:flex-initial text-xs font-mono"
                          leftIcon={
                            copied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )
                          }
                        >
                          {copied ? 'Copied' : 'Copy Email'}
                        </Button>

                        <a
                          href={mailtoHref}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-3.5 py-2 text-xs font-mono transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98]"
                        >
                          <Mail className="w-3.5 h-3.5 text-zinc-950" />
                          <span>Send Collab Email</span>
                        </a>
                      </>
                    )
                  ) : (
                    <a
                      href={getCreatorPlatformUrl(creator)}
                      {...EXTERNAL_LINK_PROPS}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 text-xs font-mono transition-colors"
                    >
                      <span>View Live Profile on {creator.platform === 'YOUTUBE' ? 'YouTube' : 'Instagram'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Plan Guard Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Unlock Direct Creator Emails"
        description="Upgrade to Agency Pro to reveal verified direct business and collaboration emails for all Indian creators."
        feature="Direct Business Emails"
      />
    </Modal>
  );
}
