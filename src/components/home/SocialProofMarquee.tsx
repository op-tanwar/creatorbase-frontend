'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AgencyCardData {
  name: string;
  monogram: string;
  category: string;
  metric: string;
  accent?: string;
}

interface TelemetryItemData {
  icon: string;
  title: string;
  highlight: string;
}

const AGENCY_CARDS: AgencyCardData[] = [
  {
    name: 'Elevation Media',
    monogram: 'EM',
    category: 'Performance Agency',
    metric: '₹42L+ Campaign Spend',
    accent: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'Kairon D2C Labs',
    monogram: 'KL',
    category: 'D2C Growth Studio',
    metric: '3.8x Avg ROAS',
    accent: 'from-teal-400 to-emerald-600',
  },
  {
    name: 'Verve Digital',
    monogram: 'VD',
    category: 'Omnichannel Scale',
    metric: '14 hrs saved / pitch',
    accent: 'from-emerald-400 to-cyan-500',
  },
  {
    name: 'ZestCommerce',
    monogram: 'ZC',
    category: 'Beauty & Lifestyle D2C',
    metric: '98% Client Approval',
    accent: 'from-emerald-500 to-teal-400',
  },
  {
    name: 'ScaleUp Studio',
    monogram: 'SU',
    category: 'Performance Marketing',
    metric: '₹85L+ Modeled Spend',
    accent: 'from-emerald-400 to-green-500',
  },
  {
    name: 'PulseCreator Network',
    monogram: 'PC',
    category: 'Talent Management',
    metric: '420+ Collab Deals',
    accent: 'from-teal-300 to-emerald-500',
  },
  {
    name: 'Schbang',
    monogram: 'SB',
    category: 'Integrated Solutions',
    metric: '18% GST ITC Verified',
    accent: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'FoxyMoron',
    monogram: 'FM',
    category: 'Creative Media',
    metric: '24ms Engine Latency',
    accent: 'from-teal-400 to-emerald-600',
  },
  {
    name: 'Monk-E Talent',
    monogram: 'ME',
    category: 'Creator Management',
    metric: '94.8% Authenticity',
    accent: 'from-emerald-400 to-cyan-500',
  },
  {
    name: 'Kinnect',
    monogram: 'KN',
    category: 'Digital Agency',
    metric: '₹1.2CR+ Quarter Spend',
    accent: 'from-teal-300 to-emerald-500',
  },
];

const TELEMETRY_ITEMS: TelemetryItemData[] = [
  { icon: '📍', title: 'Indore', highlight: '140+ Audited Creators' },
  { icon: '📍', title: 'Mumbai', highlight: '310+ Vetted Profiles' },
  { icon: '📍', title: 'Bangalore', highlight: 'Tech & SaaS Hub' },
  { icon: '📍', title: 'Delhi NCR', highlight: '280+ Lifestyle & Fashion' },
  { icon: '🛡️', title: 'Audience Audit', highlight: '100% Real-Time' },
  { icon: '⚡', title: 'Direct Access', highlight: '535+ Direct Collab Emails' },
  { icon: '🧾', title: 'Tax Compliant', highlight: 'GST ITC Compliant Invoicing' },
  { icon: '📊', title: 'Rate Intelligence', highlight: 'Live Reel CPM Tracking' },
  { icon: '📍', title: 'Jaipur', highlight: '95+ D2C Storytellers' },
  { icon: '📍', title: 'Pune', highlight: '115+ Auto & Tech Creators' },
  { icon: '📍', title: 'Hyderabad', highlight: '160+ Regional Creators' },
  { icon: '🔒', title: 'Direct Deal Flow', highlight: 'Zero Broker Markups' },
];

function AgencyGlassCard({ card }: { card: AgencyCardData }) {
  return (
    <div className="group/card relative flex shrink-0 items-center gap-3.5 rounded-xl border border-white/[0.08] bg-[#0C0E12]/90 px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#0E1117] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_rgba(0,0,0,0.6)] select-none">
      {/* Crisp Geometric Brand Monogram Icon */}
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#12151B] font-mono text-[11px] font-bold tracking-wider text-emerald-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 group-hover/card:border-emerald-500/40 group-hover/card:shadow-[0_0_12px_rgba(16,185,129,0.25)]">
        <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent transition-colors group-hover/card:from-emerald-200 group-hover/card:to-emerald-400">
          {card.monogram}
        </span>
        {/* Micro geometric indicator */}
        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400/80 ring-2 ring-[#0C0E12]" />
      </div>

      {/* Agency / Brand Name & Category */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="whitespace-nowrap font-sans text-xs sm:text-sm font-semibold tracking-tight text-zinc-100 transition-colors group-hover/card:text-white">
            {card.name}
          </span>
          <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" />
        </div>
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {card.category}
        </span>
      </div>

      {/* Verified Metric Badge in JetBrains Mono */}
      <div className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] px-2.5 py-1 font-mono text-[11px] font-medium text-emerald-300 whitespace-nowrap shadow-[inset_0_1px_0_0_rgba(16,185,129,0.15)] transition-colors group-hover/card:border-emerald-400/40 group-hover/card:bg-emerald-500/[0.14]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{card.metric}</span>
      </div>
    </div>
  );
}

function TelemetryPill({ item }: { item: TelemetryItemData }) {
  return (
    <div className="group/pill relative flex shrink-0 items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 text-xs transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_14px_rgba(16,185,129,0.12)] select-none">
      {/* Pulsing emerald live dot */}
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

      {/* Tactile Telemetry Content */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-xs leading-none">{item.icon}</span>
        <span className="font-sans font-medium text-zinc-300 text-xs">
          {item.title}
        </span>
        <span className="font-mono text-[10px] text-zinc-600">•</span>
        <span className="font-mono font-medium text-zinc-100 text-[11px] tracking-tight">
          {item.highlight}
        </span>
      </div>
    </div>
  );
}

export function SocialProofMarquee() {
  return (
    <section
      id="cities"
      className="relative w-full overflow-hidden border-y border-white/[0.06] bg-[#060709]/80 py-10 sm:py-14"
    >
      {/* Hairline Radial Gradient Canvas Illumination */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(16,185,129,0.035),transparent_70%)]" />

      {/* Top Micro-Header */}
      <div className="mb-6 px-4 text-center sm:mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 text-center">
          TRUSTED BY HIGH-GROWTH INDIAN D2C BRANDS &amp; PERFORMANCE AGENCIES
        </p>
      </div>

      {/* Edge Fade Mask Container */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* Track 1: Left-to-Right (Live Agency & Brand Social Proof Cards) */}
          <div className="flex w-max items-center animate-marquee-reverse hover:[animation-play-state:paused] select-none py-1">
            {/* First Half */}
            <div className="flex shrink-0 items-center gap-3.5 pr-3.5 sm:gap-4 sm:pr-4">
              {AGENCY_CARDS.map((card, idx) => (
                <AgencyGlassCard
                  key={`track1-set1-${card.name}-${idx}`}
                  card={card}
                />
              ))}
            </div>
            {/* Second Half (Zero Seam Loop Duplicate) */}
            <div
              className="flex shrink-0 items-center gap-3.5 pr-3.5 sm:gap-4 sm:pr-4"
              aria-hidden="true"
            >
              {AGENCY_CARDS.map((card, idx) => (
                <AgencyGlassCard
                  key={`track1-set2-${card.name}-${idx}`}
                  card={card}
                />
              ))}
            </div>
          </div>

          {/* Track 2: Right-to-Left (Pan-India Live Network & Telemetry Pills) */}
          <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused] select-none py-1">
            {/* First Half */}
            <div className="flex shrink-0 items-center gap-2.5 pr-2.5 sm:gap-3 sm:pr-3">
              {TELEMETRY_ITEMS.map((item, idx) => (
                <TelemetryPill
                  key={`track2-set1-${item.title}-${idx}`}
                  item={item}
                />
              ))}
            </div>
            {/* Second Half (Zero Seam Loop Duplicate) */}
            <div
              className="flex shrink-0 items-center gap-2.5 pr-2.5 sm:gap-3 sm:pr-3"
              aria-hidden="true"
            >
              {TELEMETRY_ITEMS.map((item, idx) => (
                <TelemetryPill
                  key={`track2-set2-${item.title}-${idx}`}
                  item={item}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
