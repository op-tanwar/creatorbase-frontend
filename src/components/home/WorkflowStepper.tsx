'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Copy,
  ExternalLink,
  Play,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export function WorkflowStepper() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'Filter & Vet',
      desc: 'Filter 50+ Indian cities by real engagement & authenticity without messy spreadsheets.',
      icon: Filter,
    },
    {
      num: '02',
      title: 'Share White-Label Link',
      desc: 'Send a branded pitch portal directly to clients. Zero logins required for approval.',
      icon: Share2,
    },
    {
      num: '03',
      title: 'Track Deliverables',
      desc: 'Monitor draft scripts, live Instagram reel URLs, and automated GST billing in real-time.',
      icon: CheckCircle2,
    },
  ];

  const handleCopyDemoLink = () => {
    navigator.clipboard.writeText('https://creatorbase.in/pitch/sample-demo');
    toast.success('Copied white-label pitch portal link!');
  };

  return (
    <section id="workflow" className="relative mx-auto max-w-7xl w-full px-4 py-20 sm:py-28 lg:py-36 sm:px-6 lg:px-8 border-t border-white/[0.06]">
      {/* Background Spotlight */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_70%)] blur-[100px]" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">
          <Zap className="h-3.5 w-3.5" />
          <span>EFFORTLESS EXECUTION PIPELINE</span>
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white font-sans leading-[1.08] mb-4">
          From Campaign Brief to Live Reel
          <br />
          <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
            In 3 Frictionless Steps.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          How modern Indian media agencies run ₹10L+ multi-creator campaigns in hours instead of weeks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Step Switcher (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'border-emerald-500/40 bg-[#0C0E12] shadow-[0_0_25px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                    : 'border-white/[0.06] bg-[#0A0B0E]/60 hover:border-white/[0.12] hover:bg-[#0C0E12]/80'
                }`}
              >
                {/* Active progress indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="workflow-active-line"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                  />
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                        : 'border border-white/[0.08] bg-white/[0.04] text-zinc-400'
                    }`}
                  >
                    {step.num}
                  </div>

                  <div>
                    <h3
                      className={`text-base sm:text-lg font-bold font-sans transition-colors ${
                        isActive ? 'text-white' : 'text-zinc-300'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Dynamic Interactive Stage Preview (7 cols) */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl border border-white/[0.08] bg-[#0C0E12]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden">
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                  transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] text-xs font-mono">
                    <span className="text-emerald-400">STAGE 01 • HYPER-LOCAL VETTING</span>
                    <span className="text-zinc-500">INDORE + MUMBAI + JAIPUR</span>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-[#08090C] p-4 font-mono text-xs text-zinc-300 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Query Filter:</span>
                      <span className="text-white">City IN (&apos;Indore&apos;, &apos;Pune&apos;, &apos;Jaipur&apos;)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Audience Authenticity:</span>
                      <span className="text-emerald-400">&gt; 90.0% Real Human</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Median Reel Reach:</span>
                      <span className="text-white">100K - 500K Views</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
                      <span className="text-xs font-bold text-white block">
                        @indori_foodie_rahul
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        97/100 Authenticity • ₹14,000
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-[#0E1014] p-3">
                      <span className="text-xs font-bold text-white block">
                        @mumbai_tech_review
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        98/100 Authenticity • ₹35,000
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                    <span>MATCHED 48 AUDITED PROFILES</span>
                    <span className="text-emerald-400">READY FOR DECK →</span>
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                  transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] text-xs font-mono">
                    <span className="text-emerald-400">STAGE 02 • WHITE-LABEL PITCH LINK</span>
                    <span className="text-zinc-500">TOKEN: #cb_p982a</span>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-[#08090C] p-4 text-xs font-mono space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Client Deck URL:</span>
                      <button
                        onClick={handleCopyDemoLink}
                        className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                      >
                        <span>creatorbase.in/pitch/demo</span>
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-[#0C0E12] p-2.5 border border-white/[0.04]">
                      <span className="text-zinc-300">Client Approval Permission:</span>
                      <span className="text-emerald-400 font-bold">Enabled (Zero-Auth)</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-[#0C0E12] p-2.5 border border-white/[0.04]">
                      <span className="text-zinc-300">Commercial Margin Markup:</span>
                      <span className="text-white font-bold">+15% Agency Retainer</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center">
                    <span className="text-xs font-mono text-emerald-400 block mb-1">
                      CLIENT VIEW PREVIEW
                    </span>
                    <p className="text-sm font-semibold text-white">
                      &quot;Client approved 4/4 creators with ₹65,000 budget in 8 minutes.&quot;
                    </p>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                  transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] text-xs font-mono">
                    <span className="text-emerald-400">STAGE 03 • LIVE DELIVERABLES &amp; PAYOUT</span>
                    <span className="text-zinc-500">AUTOMATED TELEMETRY</span>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-[#08090C] p-4 text-xs font-mono space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300 font-bold">Live Reel URL:</span>
                      <span className="text-emerald-400">instagram.com/reel/C8x9...</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg bg-[#0C0E12] p-2 border border-white/[0.04]">
                        <span className="text-zinc-500 block">REAL-TIME VIEWS</span>
                        <span className="text-white font-bold text-sm">242.8K Views</span>
                      </div>
                      <div className="rounded-lg bg-[#0C0E12] p-2 border border-white/[0.04]">
                        <span className="text-zinc-500 block">COMMENTS AUDIT</span>
                        <span className="text-emerald-400 font-bold text-sm">1,480 Organic</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <span className="text-zinc-400">GST Invoice SAC 998314:</span>
                      <span className="text-emerald-400 font-bold">Generated &amp; Filed</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-[#0E1014] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-mono text-white">Campaign Complete</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">ROI: 4.8X</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
