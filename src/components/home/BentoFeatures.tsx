'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Kanban,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Mail,
  Zap,
  ArrowRight,
  Eye,
  Lock,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { toast } from 'sonner';

export function BentoFeatures() {
  // State for Card 1: 1-Click Client Pitch Portal
  const [pitchCreators, setPitchCreators] = useState([
    { id: 'p1', name: 'Rahul Agrawal', niche: 'Food', rate: 14000, approved: true },
    { id: 'p2', name: 'Aarav Mehta', niche: 'Tech', rate: 35000, approved: true },
    { id: 'p3', name: 'Kritika Verma', niche: 'Fashion', rate: 15000, approved: false },
  ]);

  const togglePitchCreator = (id: string) => {
    setPitchCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approved: !c.approved } : c))
    );
  };

  const currentPitchBudget = pitchCreators
    .filter((c) => c.approved)
    .reduce((sum, c) => sum + c.rate, 0);

  // State for Card 3: Masked vs Unlocked Email
  const [unmaskedEmail, setUnmaskedEmail] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // State for Card 4: 5-Stage Kanban Slide
  const [activeKanbanStage, setActiveKanbanStage] = useState(2);
  const kanbanStages = [
    { label: 'Outreach Sent', count: 12, creator: '@tech_indore' },
    { label: 'Commercials Agreed', count: 8, creator: '@foodie_rahul' },
    { label: 'Draft Review', count: 5, creator: '@mumbai_gadgets' },
    { label: 'Live & Paid', count: 19, creator: '@style_delhi' },
  ];

  // State for Card 5: Rate Intelligence CPM Vertical
  const [selectedVertical, setSelectedVertical] = useState<'Finance' | 'Tech' | 'Food' | 'Fashion'>('Tech');
  const cpmData = {
    Finance: { cpm: 240, avgDeal: '₹45,000', er: '3.8%' },
    Tech: { cpm: 210, avgDeal: '₹35,000', er: '4.5%' },
    Food: { cpm: 180, avgDeal: '₹18,000', er: '5.6%' },
    Fashion: { cpm: 155, avgDeal: '₹15,000', er: '6.2%' },
  };

  const handleCopyDirectEmail = () => {
    navigator.clipboard.writeText('collabs@indorifoodie.in');
    setCopiedEmail(true);
    toast.success('Copied direct creator email!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="pitch-portals" className="mx-auto max-w-7xl w-full px-4 py-20 sm:py-28 lg:py-36 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>BUILT FOR SPEED &amp; AGENCY SCALE</span>
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white font-sans leading-[1.08] mb-4"
        >
          Replace 6 Fragmented Tools With One
          <br />
          <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
            Deterministic Engine.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          Engineered for performance agencies handling 10+ concurrent brand campaigns across Tier 1, 2, and 3 Indian cities.
        </motion.p>
      </div>

      {/* 6-Card Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* ================================================================= */}
        {/* CARD 1 (Large - 7 cols): 1-Click Client Pitch Portals             */}
        {/* ================================================================= */}
        <SpotlightCard className="md:col-span-12 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  WHITE-LABEL PITCH PORTAL
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                /pitch/tok_cb_9921
              </span>
            </div>

            <h3 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              1-Click Client Pitch Portals
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-xl">
              Send branded, no-login approval decks directly to brand CMOs. Clients review creator profiles, preview past reels, and click approve in real-time.
            </p>

            {/* Interactive Pitch Deck Simulator */}
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#08090C] p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">Client:</span>
                  <span className="text-zinc-300">D2C Nutrition Co.</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="text-zinc-500">Total Approved:</span>
                  <span className="font-bold text-sm">
                    ₹{currentPitchBudget.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Creator Approval Rows */}
              <div className="mt-3 space-y-2.5">
                {pitchCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#0E1014] p-3 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">
                        {creator.name}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {creator.niche} • ₹{creator.rate.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => togglePitchCreator(creator.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                        creator.approved
                          ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'border border-white/[0.08] bg-white/[0.05] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {creator.approved ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                          <span>Approved ✅</span>
                        </>
                      ) : (
                        <span>Click to Approve</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-4 border-t border-white/[0.04]">
            <span>ZERO CLIENT LOGIN REQUIRED</span>
            <span className="text-emerald-400">INSTANT LINK SHARE ↗</span>
          </div>
        </SpotlightCard>

        {/* ================================================================= */}
        {/* CARD 2 (Medium - 5 cols): Anti-Fraud Authenticity Engine         */}
        {/* ================================================================= */}
        <SpotlightCard className="md:col-span-12 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  ANTI-FRAUD AUDIT
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">PASS 94.8%</span>
            </div>

            <h3 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Anti-Fraud Authenticity
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Eliminate fake Indian follower rings. We audit engagement velocity and follower-to-following ratios down to individual comments.
            </p>

            {/* Visual Gauge Scanner */}
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#08090C] p-5 text-center">
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-zinc-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-emerald-400 transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 0.948)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold font-mono text-white">94.8%</span>
                  <span className="text-[9px] font-mono text-zinc-500 block">REAL HUMAN</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs font-mono">
                <div className="rounded-lg border border-white/[0.04] bg-[#0C0E12] p-2.5">
                  <span className="text-zinc-500 block text-[10px]">BOT VELOCITY</span>
                  <span className="text-emerald-400 font-bold">&lt; 1.8% Risk</span>
                </div>
                <div className="rounded-lg border border-white/[0.04] bg-[#0C0E12] p-2.5">
                  <span className="text-zinc-500 block text-[10px]">GEO CONCENTRATION</span>
                  <span className="text-white font-bold">82% Bharat</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] font-mono text-zinc-500 pt-4 border-t border-white/[0.04]">
            CONTINUOUS 24-HOUR TELEMETRY SCAN
          </div>
        </SpotlightCard>

        {/* ================================================================= */}
        {/* CARD 3 (Medium - 5 cols): Verified Business Emails Only           */}
        {/* ================================================================= */}
        <SpotlightCard className="md:col-span-12 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  ZERO MIDDLEMAN
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">535+ UNLOCKED</span>
            </div>

            <h3 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Verified Business Emails Only
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              No dead DM inboxes. Get audited direct collaboration emails and WhatsApp manager contacts with zero broker fee inflation.
            </p>

            {/* Email Masked / Unmasked Mockup */}
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#08090C] p-4">
              <div className="flex items-center justify-between mb-3 text-xs font-mono text-zinc-400">
                <span>DIRECT COLLAB INBOX</span>
                <span className="text-emerald-400">ACTIVE &amp; VERIFIED</span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-[#0C0E12] p-3">
                <div className="min-w-0">
                  <span className="text-xs font-mono text-zinc-200 block truncate">
                    {unmaskedEmail ? 'collabs@indorifoodie.in' : 'collabs••••••••••@indori.in'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Response SLA: &lt; 4 Hours
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setUnmaskedEmail(!unmaskedEmail)}
                    className="rounded-md border border-white/[0.08] bg-white/[0.05] p-2 text-zinc-400 hover:text-white transition-colors"
                    title={unmaskedEmail ? 'Mask email' : 'Reveal email'}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleCopyDirectEmail}
                    className="rounded-md bg-emerald-500/20 border border-emerald-500/40 p-2 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                    title="Copy direct email"
                  >
                    {copiedEmail ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-4 border-t border-white/[0.04]">
            <span>DIRECT INFLUENCER COMMERCIALS</span>
            <span className="text-emerald-400">NO 30% AGENT CUT</span>
          </div>
        </SpotlightCard>

        {/* ================================================================= */}
        {/* CARD 4 (Large - 7 cols): 5-Stage Deliverables Kanban              */}
        {/* ================================================================= */}
        <SpotlightCard className="md:col-span-12 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Kanban className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  LIVE WORKFLOW KANBAN
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">AUTO-SYNCED</span>
            </div>

            <h3 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              5-Stage Deliverables Kanban
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-xl">
              Track creator deliverables from initial outreach to contract signoff, script draft, live Instagram reel verification, and automated GST billing.
            </p>

            {/* Mini Kanban Columns */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {kanbanStages.map((stage, i) => (
                <div
                  key={stage.label}
                  onClick={() => setActiveKanbanStage(i)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all ${
                    activeKanbanStage === i
                      ? 'border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'border-white/[0.06] bg-[#08090C] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 truncate">
                      {stage.label}
                    </span>
                    <span className="h-4 w-4 rounded-full bg-white/[0.08] text-[9px] font-mono text-zinc-300 flex items-center justify-center">
                      {stage.count}
                    </span>
                  </div>

                  <div className="rounded-md border border-white/[0.06] bg-[#0E1014] p-2">
                    <span className="text-[11px] font-mono text-white block truncate">
                      {stage.creator}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400">
                      Active SLA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-4 border-t border-white/[0.04]">
            <span>ELIMINATES 40+ WHATSAPP FOLLOW-UP CHATS</span>
            <span className="text-emerald-400">AUTO REEL URL DETECTION</span>
          </div>
        </SpotlightCard>

        {/* ================================================================= */}
        {/* CARD 5 (Half - 6 cols): Real-Time INR Rate Card Intelligence      */}
        {/* ================================================================= */}
        <SpotlightCard className="md:col-span-12 lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  BENCHMARK INTELLIGENCE
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">UPDATED DAILY</span>
            </div>

            <h3 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Real-Time INR Rate Card Intelligence
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Stop guessing creator rates. Calibrated against ₹1.8Cr+ of audited Indian agency campaign spend across 4 core verticals.
            </p>

            {/* Interactive CPM Chart Selector */}
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#08090C] p-4">
              <div className="flex items-center justify-between gap-1 mb-4">
                {(['Tech', 'Food', 'Fashion', 'Finance'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVertical(v)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all ${
                      selectedVertical === v
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'text-zinc-400 hover:text-white bg-[#0E1014]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* CPM Bar Chart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Benchmark CPM:</span>
                  <span className="text-emerald-400 font-bold">
                    ₹{cpmData[selectedVertical].cpm} / 1K Impressions
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    animate={{ width: `${(cpmData[selectedVertical].cpm / 260) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                  <div className="rounded-lg bg-[#0E1014] p-2.5 border border-white/[0.04]">
                    <span className="text-zinc-500 text-[10px] block">AVG DEAL SIZE</span>
                    <span className="text-white font-bold">{cpmData[selectedVertical].avgDeal}</span>
                  </div>
                  <div className="rounded-lg bg-[#0E1014] p-2.5 border border-white/[0.04]">
                    <span className="text-zinc-500 text-[10px] block">NICHE ER MEDIAN</span>
                    <span className="text-emerald-400 font-bold">{cpmData[selectedVertical].er}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] font-mono text-zinc-500 pt-4 border-t border-white/[0.04]">
            ZERO BROKER SPREADS • REAL HISTORICAL DEALS
          </div>
        </SpotlightCard>

        {/* ================================================================= */}
        {/* CARD 6 (Half - 6 cols): RFC-4180 CSV Export & GST Invoicing       */}
        {/* ================================================================= */}
        <SpotlightCard className="md:col-span-12 lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  GST &amp; DATA EXPORT
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">SAC 998314</span>
            </div>

            <h3 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              RFC-4180 CSV &amp; GST Invoicing
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Export pristine, client-ready spreadsheets formatted for Excel &amp; Google Sheets. Plus full 18% GST Input Tax Credit compliance.
            </p>

            {/* Invoicing Breakdown Preview */}
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#08090C] p-4 text-xs font-mono">
              <div className="space-y-1.5 pb-3 border-b border-white/[0.06] text-zinc-400">
                <div className="flex justify-between">
                  <span>Agency Subscription (Starter):</span>
                  <span className="text-white font-bold">₹2,999.00</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>CGST (9.0%):</span>
                  <span>₹269.91</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>SGST (9.0%):</span>
                  <span>₹269.91</span>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center text-sm">
                <span className="text-emerald-400 font-bold">Total (18% ITC Eligible):</span>
                <span className="text-white font-extrabold font-mono">₹3,538.82</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-[10px] text-zinc-500">
                  EXPORT FORMAT: UTF-8 BOM CSV
                </span>
                <button
                  onClick={() => toast.success('Downloaded Sample RFC-4180 CSV!')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] font-mono text-zinc-500 pt-4 border-t border-white/[0.04]">
            100% AUDIT-READY TAX INVOICES POWERED BY RAZORPAY
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
