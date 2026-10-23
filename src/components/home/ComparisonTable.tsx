'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { COMPARISON_DATA } from './mockData';

export function ComparisonTable() {
  return (
    <section className="border-t border-[#24272E] bg-[#08090B] py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-4">
            Market Calibration &amp; Comparative Analysis
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans mb-4">
            Why Western &amp; Legacy Tools Fail in Bharat.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Global platforms treat India as an afterthought with $300 USD paywalls, zero regional coverage, and generic formulas. Here is how CreatorBase compares.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-[#0E1013]/90 shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#08090B] text-[11px] uppercase tracking-wider font-mono border-b border-zinc-800">
              <tr>
                <th className="py-4 sm:py-5 px-4 sm:px-6 text-zinc-400 w-1/4">Capability / Benchmark</th>
                <th className="py-4 sm:py-5 px-4 sm:px-6 text-rose-400/90 w-3/8">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block" />
                    <span>Global Tools (Modash / Heepsy)</span>
                  </div>
                </th>
                <th className="py-4 sm:py-5 px-4 sm:px-6 text-emerald-400 bg-emerald-950/20 w-3/8 border-l border-emerald-900/30">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    <span className="font-bold">CreatorBase 🇮🇳</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {COMPARISON_DATA.map((row) => (
                <tr key={row.capability} className="hover:bg-zinc-900/40 transition-colors">
                  {/* Capability Column */}
                  <td className="py-4 sm:py-5 px-4 sm:px-6 align-top">
                    <span className="font-bold text-white block">{row.capability}</span>
                    <span className="text-[11px] text-zinc-500 mt-1 block leading-relaxed font-normal">
                      {row.description}
                    </span>
                  </td>

                  {/* Legacy Global Column */}
                  <td className="py-4 sm:py-5 px-4 sm:px-6 align-top text-zinc-300 font-mono text-xs">
                    <div className="flex items-start gap-2 text-rose-300/90">
                      <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{row.legacyGlobal}</span>
                    </div>
                  </td>

                  {/* CreatorBase 🇮🇳 Column */}
                  <td className="py-4 sm:py-5 px-4 sm:px-6 align-top text-zinc-100 bg-emerald-950/10 border-l border-emerald-900/30 font-mono text-xs">
                    <div className="flex items-start gap-2 text-emerald-300">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-semibold leading-relaxed">{row.creatorBase}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
