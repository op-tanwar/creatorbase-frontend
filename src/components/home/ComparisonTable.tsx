'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus, Sparkles, ShieldCheck } from 'lucide-react';

interface MatrixRow {
  capability: string;
  category: string;
  excel: string;
  modash: string;
  grin: string;
  creatorbase: string;
}

const COMPARISON_ROWS: MatrixRow[] = [
  {
    capability: 'Pan-India & Regional Creator Indexing',
    category: 'Coverage',
    excel: 'Manual DM stalking; zero verified reach',
    modash: 'Misses 85%+ regional Indian Tier-2/3 hubs',
    grin: 'US/EU-centric; no Indian city mapping',
    creatorbase: '50+ Indian hubs indexed (Indore, Surat, Pune, Jaipur, Kochi)',
  },
  {
    capability: 'Audience Authenticity & Pod Detection',
    category: 'Fraud Security',
    excel: 'Zero bot detection; high ad-spend waste',
    modash: 'Global AQS; lacks Indian engagement pod heuristics',
    grin: 'Basic follower count audit',
    creatorbase: 'AQS 0-100 + Comment Pod + Follower Spike Anomaly Engine',
  },
  {
    capability: 'White-Label Client Pitch Portals',
    category: 'Workflow',
    excel: 'Messy spreadsheets with broken links',
    modash: 'Read-only exports; no client approvals',
    grin: 'Requires expensive client login seats ($1,000s/mo)',
    creatorbase: 'Zero-login interactive approval portal with live budget tracking',
  },
  {
    capability: 'Outreach CRM & Legal E-Contracts',
    category: 'Execution',
    excel: 'Dead Gmail threads & manual PDF contracts',
    modash: 'Discovery only; no contracting or e-signing',
    grin: 'Enterprise email sequences; complex setup',
    creatorbase: 'Nodemailer SMTP sequences + 1-Click usage rights e-contracts',
  },
  {
    capability: 'Product Seeding & Courier Tracking',
    category: 'Commerce',
    excel: 'Lost WhatsApp notes & tracking slips',
    modash: 'No seeding or physical shipping support',
    grin: 'US Shopify seeding only; no Indian couriers',
    creatorbase: 'Bluedart, Delhivery & Shiprocket AWB tracking + SKU delivery status',
  },
  {
    capability: 'TDS Withholding & 18% GST Invoicing',
    category: 'Financials',
    excel: 'Manual accountant reconciliation errors',
    modash: 'Billed in USD ($300+/mo); no Indian GST ITC',
    grin: 'Annual $15,000+ USD contracts',
    creatorbase: 'Sec 194J/194C TDS ledger + 18% GST B2B Invoices (SAC 998314)',
  },
  {
    capability: 'Starting Monthly Economics',
    category: 'Value',
    excel: 'Hidden ~₹40,000/mo in wasted staff hours',
    modash: '₹30,000+ / mo ($300+ USD) + FX markup',
    grin: '₹1.2L+ / mo ($1,500/mo) annual lock-in',
    creatorbase: 'Flat ₹2,999 / mo with UPI & Instant NetBanking',
  },
];

export function ComparisonTable() {
  return (
    <section id="comparison" className="mx-auto max-w-7xl w-full px-4 py-20 sm:py-28 lg:py-36 sm:px-6 lg:px-8 border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>GLOBAL BENCHMARK MATRIX</span>
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white font-sans leading-[1.08] mb-4">
          Built to Surpass Modash &amp; GRIN.
          <br />
          <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
            Engineered for Modern Indian &amp; Global Agencies.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          See how CreatorBase unifies deep audience fraud intelligence, relationship CRM, digital contracts, and Indian tax compliance into one high-velocity operating system.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-xl sm:rounded-2xl border border-white/[0.08] bg-[#0A0C10] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden">
        {/* Mobile Swipe Hint */}
        <div className="lg:hidden px-4 py-2.5 bg-[#08090C] border-b border-white/[0.06] text-[11px] font-mono text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span>⇄</span>
            <span>Scroll horizontally to compare all platforms</span>
          </span>
          <span className="text-zinc-500">5 columns</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#08090B] text-[11px] font-mono uppercase tracking-wider">
                <th className="py-4 px-4 text-zinc-400 font-semibold w-1/5">
                  Capability / Architecture
                </th>
                <th className="py-4 px-4 text-zinc-500 font-semibold w-1/5">
                  Manual Excel / DMs
                </th>
                <th className="py-4 px-4 text-zinc-400 font-semibold w-1/5">
                  Modash / HypeAuditor
                </th>
                <th className="py-4 px-4 text-zinc-400 font-semibold w-1/5">
                  GRIN / CreatorIQ
                </th>
                <th className="py-4 px-4 text-emerald-400 font-bold bg-emerald-950/25 border-l border-emerald-500/30 w-1/5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>CreatorBase OS</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06] font-sans">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.capability} className="hover:bg-white/[0.02] transition-colors">
                  {/* Capability Column */}
                  <td className="py-4 px-4 align-top">
                    <span className="font-bold text-white block text-xs sm:text-sm">{row.capability}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mt-0.5">
                      {row.category}
                    </span>
                  </td>

                  {/* Excel Column */}
                  <td className="py-4 px-4 align-top text-zinc-400">
                    <div className="flex items-start gap-1.5">
                      <X className="h-4 w-4 text-red-500/70 shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{row.excel}</span>
                    </div>
                  </td>

                  {/* Modash Column */}
                  <td className="py-4 px-4 align-top text-zinc-400">
                    <div className="flex items-start gap-1.5">
                      <Minus className="h-4 w-4 text-amber-500/70 shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{row.modash}</span>
                    </div>
                  </td>

                  {/* GRIN Column */}
                  <td className="py-4 px-4 align-top text-zinc-400">
                    <div className="flex items-start gap-1.5">
                      <Minus className="h-4 w-4 text-amber-500/70 shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{row.grin}</span>
                    </div>
                  </td>

                  {/* CreatorBase Highlight Column */}
                  <td className="py-4 px-4 align-top text-white bg-emerald-950/15 border-l border-emerald-500/30">
                    <div className="flex items-start gap-1.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="text-xs font-semibold leading-relaxed text-zinc-100">
                        {row.creatorbase}
                      </span>
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
