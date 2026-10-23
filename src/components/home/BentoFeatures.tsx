'use client';

import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Calculator,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { REGIONAL_RADAR_HUBS } from './mockData';

export function BentoFeatures() {
  // State for Card 1: Hovered Regional Hub
  const [hoveredHub, setHoveredHub] = useState(REGIONAL_RADAR_HUBS[0]);

  // State for Card 4: Dynamic Budget Allocator Slider (Default ₹2.5L)
  const [budget, setBudget] = useState<number>(250000);

  // Dynamic live calculations based on current budget
  const totalCreators = Math.max(1, Math.floor(budget / 18000));
  const estimatedReach = Math.round(budget * 4.2).toLocaleString('en-IN');
  const reelsCount = totalCreators;
  const storiesCount = totalCreators * 2;

  // Indian Rupee currency formatter for badge
  const formattedBudget = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(budget);

  // Mock table rows for Card 3 (Spreadsheet Engine)
  const mockSpreadsheetRows = [
    { handle: '@indori_foodie_rahul', city: 'Indore', followers: '148K', fee: '₹14,000' },
    { handle: '@mumbai_tech_review', city: 'Mumbai', followers: '385K', fee: '₹35,000' },
    { handle: '@jaipur_vlogs_vikram', city: 'Jaipur', followers: '190K', fee: '₹18,500' },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl w-full px-4 py-20 sm:py-24 lg:py-32 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
        <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-4">
          High-Density Engineering Architecture
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans mb-4">
          Purpose-built for Indian media buyers &amp; performance agencies.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Eliminate broker markups, bot scams, and spreadsheet formatting hell with deterministic data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* ================================================================= */}
        {/* CARD 1 (Span 2 cols): Hyper-Local Geo Intelligence               */}
        {/* ================================================================= */}
        <div className="md:col-span-2 rounded-2xl border border-zinc-800/80 bg-[#0E1013]/90 p-6 sm:p-8 lg:p-10 relative overflow-hidden group hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all duration-300 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
              HUB_RADAR_GEO.V2
            </span>
          </div>

          <h3 className="mt-5 text-xl sm:text-2xl font-bold text-white tracking-tight">
            Hyper-Local Regional Geo Intelligence
          </h3>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl leading-relaxed">
            Index authentic vernacular creators in Tier 2 &amp; Tier 3 hubs across central, western, and northern India. Hover over any regional hub to inspect live index density.
          </p>

          {/* Interactive Radar Hub Matrix */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {REGIONAL_RADAR_HUBS.map((hub) => {
              const isSelected = hoveredHub.city === hub.city;
              return (
                <div
                  key={hub.city}
                  onMouseEnter={() => setHoveredHub(hub)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? 'border-emerald-500/60 bg-emerald-950/30 shadow-md shadow-emerald-950/40'
                      : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">📍 {hub.city}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">{hub.growth}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>{hub.creators.toLocaleString()} talent</span>
                    <span className="text-zinc-300 font-semibold">{hub.avgEr} ER</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Telemetry Bar for Selected Hub */}
          <div className="mt-5 rounded-xl border border-zinc-800 bg-[#08090B] p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400">
            <span>
              Active Hub: <strong className="text-white">{hoveredHub.city}, {hoveredHub.state}</strong>
            </span>
            <span className="text-emerald-400">
              {hoveredHub.creators.toLocaleString()} Indexed Talent • {hoveredHub.avgEr} Mean Regional Engagement
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CARD 2: Fake Follower Bot Sieve                                   */}
        {/* ================================================================= */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0E1013]/90 p-6 sm:p-8 group hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                BOT_SIEVE.EXE
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-white tracking-tight">
              Bot Pod &amp; Fake Audience Sieve
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Algorithmic verification flags comment pods, purchased Russian/Turkish bots, and generic spam strings before you wire a single rupee.
            </p>

            {/* Visual SVG Gauge Meter */}
            <div className="mt-6 flex flex-col items-center justify-center p-5 rounded-xl border border-zinc-800 bg-[#08090B]">
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-zinc-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - 0.948)}
                    strokeLinecap="round"
                    className="text-emerald-500 transition-all duration-1000"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-2xl font-extrabold text-white">94.8%</span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Clean
                  </span>
                </div>
              </div>

              <div className="mt-5 w-full flex items-center justify-between text-[11px] font-mono pt-3 border-t border-zinc-900">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Real Users: 94.8%
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Ghost/Pod: 5.2%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CARD 3: 1-Click RFC-4180 CSV Engine                               */}
        {/* ================================================================= */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0E1013]/90 p-6 sm:p-8 group hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                RFC-4180.CSV
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-white tracking-tight">
              1-Click RFC-4180 CSV Engine
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Export client-ready spreadsheets formatted with UTF-8 BOM so Indian Rupee (₹) amounts render cleanly in Excel &amp; Google Sheets with zero encoding errors.
            </p>

            {/* Mock Spreadsheet Preview */}
            <div className="mt-6 rounded-xl border border-zinc-800 bg-[#08090B] overflow-hidden text-[11px] font-mono">
              <div className="bg-zinc-900/80 px-3.5 py-2 border-b border-zinc-800 text-zinc-400 flex items-center justify-between">
                <span>cohort_indore_q2.csv</span>
                <span className="text-emerald-400 font-semibold">UTF-8 BOM</span>
              </div>

              <div className="divide-y divide-zinc-900">
                {mockSpreadsheetRows.map((row) => (
                  <div key={row.handle} className="px-3.5 py-2.5 flex items-center justify-between text-zinc-300">
                    <span className="truncate max-w-[120px] text-zinc-200">{row.handle}</span>
                    <span className="text-zinc-400">{row.city}</span>
                    <span className="text-emerald-400 font-bold">{row.fee}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-zinc-900 flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Auto-calibrated
            </span>
            <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs px-3 py-1 font-semibold">
              Export.csv ⬇
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CARD 4 (Span 2 cols): Live Deliverables Budget Allocator          */}
        {/* ================================================================= */}
        <div className="md:col-span-2 rounded-2xl border border-zinc-800/80 bg-[#0E1013]/90 p-6 sm:p-8 lg:p-10 group hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all duration-300 backdrop-blur-sm relative">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Calculator className="h-5 w-5" />
            </div>
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
              BUDGET_SIMULATOR.SYS
            </span>
          </div>

          <h3 className="mt-5 text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live Deliverables Budget Allocator
          </h3>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl leading-relaxed">
            Drag the slider to test your planned campaign budget. The simulator calculates optimal creator cohort sizing and total reach based on authentic Indian market benchmarks.
          </p>

          {/* Dynamic Budget Slider Box */}
          <div className="mt-6 sm:mt-8 rounded-xl border border-zinc-800 bg-[#08090B] p-5 sm:p-6 space-y-5 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Target Campaign Budget (INR):
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Drag slider or select a quick preset below
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">
                {formattedBudget}
              </span>
            </div>

            {/* Slider Bar */}
            <div className="space-y-2 relative">
              <input
                type="range"
                min={50000}
                max={2000000}
                step={25000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-500 relative z-20 pointer-events-auto"
              />

              <div className="flex justify-between text-[11px] font-mono text-zinc-500 pt-1">
                <span>₹50,000 (Min)</span>
                <span>₹10,00,000</span>
                <span>₹20,00,000 (Max)</span>
              </div>
            </div>

            {/* Quick Budget Preset Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mr-1">
                Presets:
              </span>
              {[
                { label: '₹50K', value: 50000 },
                { label: '₹2.5L', value: 250000 },
                { label: '₹5L', value: 500000 },
                { label: '₹10L', value: 1000000 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setBudget(preset.value)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all relative z-20 pointer-events-auto ${
                    budget === preset.value
                      ? 'bg-emerald-500 text-zinc-950 shadow-sm shadow-emerald-500/20'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Dynamic Results Trio: Standard p-3.5 sm:p-4 */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-zinc-900">
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3.5 sm:p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Total Talent Count
                </span>
                <span className="text-lg font-mono font-bold text-white block">
                  {totalCreators} Creators
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block">
                  65% Tier-2/3 Regional
                </span>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3.5 sm:p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Estimated Impressions
                </span>
                <span className="text-lg font-mono font-bold text-emerald-400 block">
                  {estimatedReach}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block">
                  Authentic reach projection
                </span>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3.5 sm:p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Deliverables Mix
                </span>
                <span className="text-lg font-mono font-bold text-indigo-300 block">
                  {reelsCount} Reels + {storiesCount} Stories
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block">
                  Agreed scope benchmark
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
