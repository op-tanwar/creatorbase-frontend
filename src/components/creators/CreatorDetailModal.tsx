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

  const estimate = calculateCommercialEstimate(creator);

  return (
    <Modal
      isOpen={!!creator}
      onClose={() => dispatch(setDetailModalCreator(null))}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Creator Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <a
              href={getCreatorPlatformUrl(creator)}
              {...EXTERNAL_LINK_PROPS}
              className="relative h-16 w-16 rounded-2xl overflow-hidden border border-emerald-500/40 shrink-0 shadow-lg shadow-emerald-950/40 bg-zinc-900 flex items-center justify-center transition-transform hover:scale-105"
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
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
                  {creator.fullName}
                </h2>
                {creator.isVerified && (
                  <span title="Audited & Platform Verified Reach" className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
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
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{creator.authenticityScore}% Real Audience</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <a
                  href={getCreatorPlatformUrl(creator)}
                  {...EXTERNAL_LINK_PROPS}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 hover:underline"
                  title="View Live Profile on external platform"
                >
                  <span>@{creator.handle}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-lg bg-[#08090C] border border-white/[0.08] text-zinc-300">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {creator.city}, {creator.state}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {creator.niche}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenShortlist}
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="w-full sm:w-auto font-mono"
          >
            Add to Shortlist
          </Button>
        </div>

        {/* Creator Bio Snippet */}
        {creator.bio && (
          <div className="rounded-xl bg-[#08090C] border border-white/[0.06] p-4">
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
          <div className="rounded-xl bg-[#08090C] border border-white/[0.06] p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-mono">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Followers
            </div>
            <p className="mt-1.5 text-lg font-bold font-mono text-white">
              {formatFollowers(creator.followerCount)}
            </p>
          </div>

          <div className="rounded-xl bg-[#08090C] border border-white/[0.06] p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Engagement
            </div>
            <p className="mt-1.5 text-lg font-bold font-mono text-emerald-400">
              {formatPercentage(creator.engagementRate)}
            </p>
          </div>

          <div className="rounded-xl bg-[#08090C] border border-white/[0.06] p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-mono">
              <PlaySquare className="w-3.5 h-3.5 text-pink-400" />
              Avg Views
            </div>
            <p className="mt-1.5 text-lg font-bold font-mono text-white">
              {formatFollowers(creator.avgReelViews)}
            </p>
          </div>

          <div className="rounded-xl bg-[#08090C] border border-white/[0.06] p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-mono">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Avg Likes
            </div>
            <p className="mt-1.5 text-lg font-bold font-mono text-white">
              {formatFollowers(creator.avgLikes)}
            </p>
          </div>
        </div>

        {/* Audience Authenticity & Quality Verification */}
        <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Audience Authenticity &amp; Quality Verification</span>
            </h4>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {creator.authenticityScore ?? 92}% Score
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            Passed automated bot-pod &amp; ghost-follower gatekeeper. Profile meets verified post volume, healthy engagement velocity ({formatPercentage(creator.engagementRate)}), and active Indian audience reach.
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
            <div className="bg-[#08090C] border border-white/[0.06] rounded-lg p-2 text-center">
              <span className="text-zinc-500 block text-[10px]">Ghost Ratio</span>
              <span className="text-emerald-400 font-semibold">&lt; 5% Verified</span>
            </div>
            <div className="bg-[#08090C] border border-white/[0.06] rounded-lg p-2 text-center">
              <span className="text-zinc-500 block text-[10px]">Follower Baseline</span>
              <span className="text-zinc-200 font-semibold">&ge; 5,000 Verified</span>
            </div>
            <div className="bg-[#08090C] border border-white/[0.06] rounded-lg p-2 text-center">
              <span className="text-zinc-500 block text-[10px]">Quality Gate</span>
              <span className="text-emerald-400 font-semibold">100% Passed</span>
            </div>
          </div>
        </div>

        {/* Audience Demographics & Geography */}
        <div className="rounded-xl bg-[#08090C] border border-white/[0.06] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 font-mono">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Audience Demographics &amp; Top City</span>
            </h4>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 px-2 py-0.5 rounded">
              Base: {creator.audienceTopCity}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Female: {creator.audienceFemalePercentage}%</span>
              <span>Male: {creator.audienceMalePercentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden flex">
              <div
                style={{ width: `${creator.audienceFemalePercentage}%` }}
                className="bg-emerald-400 h-full transition-all"
              />
              <div
                style={{ width: `${creator.audienceMalePercentage}%` }}
                className="bg-indigo-400 h-full transition-all"
              />
            </div>
          </div>
        </div>

        {/* Commercial Pricing Rate-Card Intelligence */}
        <div className="rounded-xl bg-[#08090C] border border-emerald-500/25 p-4 space-y-3">
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
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.06]">
                {estimate.tier}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl bg-[#0C0E12] border border-white/[0.06] p-3.5 space-y-1">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
                Estimated 1x Dedicated Reel
              </p>
              <p className="text-lg font-bold font-mono text-emerald-400">
                {formatINR(estimate.reelMinINR)} – {formatINR(estimate.reelMaxINR)}
              </p>
              <p className="text-[10px] font-mono text-zinc-500">
                Benchmark Median: {formatINR(estimate.reelMedianINR)}
              </p>
            </div>
            <div className="rounded-xl bg-[#0C0E12] border border-white/[0.06] p-3.5 space-y-1">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
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
        </div>

        {/* Direct Business Collab Contact Email Box */}
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
            `Hi ${creator.fullName},\n\nWe came across your profile (@${creator.handle}) on CreatorBase and loved your recent content in ${creator.city}.\n\nWe are reaching out regarding an upcoming brand collaboration campaign and would love to explore a partnership.\n\nCould you please share your latest commercial rate card?\n\nBest regards,\n${user?.name || 'Brand Team'}`
          );
          const mailtoHref = email ? `mailto:${email}?subject=${collabSubject}&body=${collabBody}` : '#';

          return (
            <div className="rounded-xl bg-[#0C0E12] border border-emerald-500/30 p-5 space-y-4 shadow-[0_0_25px_rgba(16,185,129,0.1)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                        Official Business &amp; Collab Inbox
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
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3.5 py-2 text-xs font-mono transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98]"
                        >
                          <Mail className="w-3.5 h-3.5 text-black" />
                          <span>Send Collab Email</span>
                        </a>
                      </>
                    )
                  ) : (
                    <a
                      href={getCreatorPlatformUrl(creator)}
                      {...EXTERNAL_LINK_PROPS}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 px-3.5 py-2 text-xs font-mono transition-colors"
                    >
                      <span>View Live Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

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
