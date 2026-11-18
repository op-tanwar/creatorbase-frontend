'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus, Sparkles, ShieldCheck } from 'lucide-react';

interface MatrixRow {
  capability: string;
  category: string;
  excel: string;
  excelGood: boolean;
  global: string;
  globalGood: boolean;
  creatorbase: string;
  creatorbaseGood: boolean;
}

const COMPARISON_ROWS: MatrixRow[] = [
  {
    capability: 'Tier-2 & Tier-3 City Indexing',
    category: 'Coverage',
    excel: 'Manual DM stalking; zero verified reach',
    excelGood: false,
    global: 'Misses 85%+ regional Indian creators',
    globalGood: false,
    creatorbase: '50+ Indian hubs indexed (Indore, Surat, Pune, Jaipur)',
    creatorbaseGood: true,
  },
  {
    capability: 'Client Pitch Decks',
    category: 'Workflow',
    excel: 'Clunky spreadsheets with broken links',
    excelGood: false,
    global: 'Requires client login or expensive seats',
    globalGood: false,
    creatorbase: '1-Click white-label decks with zero-auth client approval',
    creatorbaseGood: true,
  },
  {
    capability: 'Direct Collab Emails',
    category: 'Outreach',
    excel: 'Dead inboxes & unanswered DMs',
    excelGood: false,
    global: 'Generic bio scrape with high bounce rate',
    globalGood: false,
    creatorbase: '535+ verified business emails with <4hr response SLA',
    creatorbaseGood: true,
  },
  {
    capability: '18% GST Input Tax Credit (ITC)',
    category: 'Billing',
    excel: 'No invoicing support',
    excelGood: false,
    global: 'Billed in USD without Indian GST credit',
    globalGood: false,
    creatorbase: '100% compliant Indian tax invoice (SAC Code 998314)',
    creatorbaseGood: true,
  },
  {
    capability: 'Anti-Fraud Reel Velocity Audit',
    category: 'Security',
    excel: 'Zero bot detection; high fraud risk',
    excelGood: false,
    global: 'US/EU engagement models inaccurate for India',
    globalGood: false,
    creatorbase: 'Calibrated Indian bot ring & real human reach scanner',
    creatorbaseGood: true,
  },
  {
    capability: 'Starting Monthly Cost',
    category: 'Economics',
    excel: 'Hidden ~₹40,000/mo in wasted staff hours',
    excelGood: false,
    global: '₹30,000+ / mo ($300+ USD) + currency markup',
    globalGood: false,
    creatorbase: 'Flat ₹2,999 / mo with UPI & NetBanking',
    creatorbaseGood: true,
  },
];

export function ComparisonTable() {
  return (
    <section id="comparison" className="mx-auto max-w-7xl w-full px-4 py-20 sm:py-28 lg:py-36 sm:px-6 lg:px-8 border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>MARKET BENCHMARK ARCHITECTURE</span>
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white font-sans leading-[1.08] mb-4">
          Why Performance Agencies Switch
          <br />
          <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
            From Clunky Sheets &amp; Global Tools.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Global software charges ₹30,000/mo while ignoring 90% of regional Indian creators. CreatorBase was custom-built for the Indian media buying workflow.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0A0C10] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#08090C] text-[11px] font-mono uppercase tracking-wider">
              <th className="py-5 px-4 sm:px-6 text-zinc-400 font-semibold w-1/4">
                Capability / Standard
              </th>
              <th className="py-5 px-4 sm:px-6 text-zinc-500 font-semibold w-1/4">
                Manual Excel / WhatsApp
              </th>
              <th className="py-5 px-4 sm:px-6 text-zinc-400 font-semibold w-1/4">
                Global Tools (₹30,000+/mo)
              </th>
              <th className="py-5 px-4 sm:px-6 text-emerald-400 font-bold bg-emerald-950/20 border-l border-emerald-500/20 w-1/4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CreatorBase (₹2,999/mo)</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.06] font-sans">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.capability} className="hover:bg-white/[0.02] transition-colors">
                {/* Capability Column */}
                <td className="py-4 sm:py-5 px-4 sm:px-6 align-top">
                  <span className="font-bold text-white block">{row.capability}</span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mt-0.5">
                    {row.category}
                  </span>
                </td>

                {/* Excel Column */}
                <td className="py-4 sm:py-5 px-4 sm:px-6 align-top text-zinc-400">
                  <div className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500/70 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm leading-relaxed">{row.excel}</span>
                  </div>
                </td>

                {/* Global Tools Column */}
                <td className="py-4 sm:py-5 px-4 sm:px-6 align-top text-zinc-400">
                  <div className="flex items-start gap-2">
                    <Minus className="h-4 w-4 text-amber-500/70 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm leading-relaxed">{row.global}</span>
                  </div>
                </td>

                {/* CreatorBase Highlight Column */}
                <td className="py-4 sm:py-5 px-4 sm:px-6 align-top text-white bg-emerald-950/10 border-l border-emerald-500/20">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="text-xs sm:text-sm font-medium leading-relaxed text-zinc-100">
                      {row.creatorbase}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
