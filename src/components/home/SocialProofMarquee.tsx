'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { BRAND_LOGOS } from './mockData';

export function SocialProofMarquee() {
  const stats = [
    { label: 'Creators Indexed', value: '50,000+', highlight: false },
    { label: 'Budgets Modeled', value: '₹14Cr+', highlight: true },
    { label: 'Genuine Audience Accuracy', value: '92.4%', highlight: false },
    { label: 'RFC-4180 CSV Exports', value: '1-Click', highlight: false },
  ];

  return (
    <section className="border-y border-zinc-800/80 bg-[#08090B] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-8 sm:mb-10">
          Trusted by growth leads at top Indian agencies &amp; D2C brands
        </p>

        {/* Brand Logos Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-90">
          {BRAND_LOGOS.map((brand) => (
            <div
              key={brand}
              className="flex items-center gap-2 text-zinc-300 font-semibold text-sm tracking-tight transition-all hover:text-white"
            >
              <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{brand}</span>
            </div>
          ))}
        </div>

        {/* 4-Stat Platform Metrics Grid */}
        <div className="mt-12 sm:mt-16 border-t border-zinc-900 pt-10 sm:pt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800/70 bg-[#0E1013]/90 p-5 sm:p-6 transition-all hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]"
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
      </div>
    </section>
  );
}
