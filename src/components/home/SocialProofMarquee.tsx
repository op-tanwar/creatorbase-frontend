'use client';

import React, { useState } from 'react';
import { Building2, Clock, Sparkles, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';
import { BRAND_LOGOS } from './mockData';

export function SocialProofMarquee() {
  const [campaignsPerMonth, setCampaignsPerMonth] = useState(4);

  // Time calculations
  const manualHours = campaignsPerMonth * 18;
  const cbMinutes = campaignsPerMonth * 12;
  const hoursSaved = (manualHours - cbMinutes / 60).toFixed(1);

  const stats = [
    { label: 'Verified Indian Creators Audited', value: '10,000+', highlight: false },
    { label: 'Agency Campaign Spend Modeled', value: '₹1.2Cr+', highlight: true },
    { label: 'Active Indian Growth Agencies', value: '50+', highlight: false },
    { label: 'GST Input Tax Credit Invoices (998314)', value: '18% ITC', highlight: false },
  ];

  return (
    <section className="border-y border-white/[0.08] bg-[#08090B] py-16 sm:py-24 overflow-x-hidden">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-8 sm:mb-10">
          Trusted by campaign directors at premier Indian D2C brands &amp; digital agencies
        </p>

        {/* Brand Logos Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-80">
          {BRAND_LOGOS.map((brand) => (
            <div
              key={brand}
              className="flex items-center gap-2 text-zinc-400 font-semibold text-sm tracking-tight transition-all hover:text-white"
            >
              <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{brand}</span>
            </div>
          ))}
        </div>

        {/* 4-Stat Platform Metrics Grid */}
        <div className="mt-12 sm:mt-16 border-t border-white/[0.06] pt-10 sm:pt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.08] bg-[#12141A]/70 p-5 sm:p-6 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]"
            >
              <span
                className={`text-2xl sm:text-4xl font-extrabold font-mono tracking-tight block ${
                  stat.highlight ? 'text-emerald-400' : 'text-zinc-100'
                }`}
              >
                {stat.value}
              </span>
              <p className="mt-2 text-xs text-zinc-400 font-sans">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Interactive Agency Time-Saved ROI Calculator (Pillar 2C) */}
        <div className="mt-14 sm:mt-20 rounded-2xl border border-white/[0.08] bg-[#12141A]/70 p-6 sm:p-10 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-xs font-mono font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agency Operational ROI Model</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Calculate How Much Pitch Time Your Agency Recovers
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Indian agencies lose dozens of non-billable hours manually creating Google Sheets, compiling screenshots, and chasing creator WhatsApp approvals.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Slider Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 uppercase">
                  Client Campaign Pitches Managed Per Month:
                </span>
                <span className="text-base font-bold font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-0.5 rounded-lg">
                  {campaignsPerMonth} Campaigns / Mo
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={campaignsPerMonth}
                onChange={(e) => setCampaignsPerMonth(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>1 Campaign (Boutique)</span>
                <span>10 Campaigns (Mid Agency)</span>
                <span>20 Campaigns (Enterprise)</span>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl bg-black/40 border border-white/[0.06] p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                  Current Process (Google Sheets + PPT)
                </span>
                <div className="text-2xl font-bold font-mono text-zinc-200">
                  {manualHours} Hours / Month
                </div>
                <p className="text-xs text-zinc-400 font-sans">
                  ~18 hours per campaign spent manually compiling rate cards, copying screenshots, and updating client revisions.
                </p>
              </div>

              <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/40 p-4 space-y-1.5 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>With CreatorBase Operating System</span>
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {cbMinutes} Minutes / Month
                </div>
                <p className="text-xs text-zinc-300 font-sans">
                  12 minutes per campaign (98% faster pitch cycle). 1-click unauthenticated client link with live decision sync.
                </p>
              </div>
            </div>

            {/* Summary highlight */}
            <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-500/30 p-3.5 text-center text-xs font-mono text-zinc-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Net Savings: <strong className="text-emerald-400 font-bold">{hoursSaved} hours recovered</strong> every month for high-margin client strategy.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
