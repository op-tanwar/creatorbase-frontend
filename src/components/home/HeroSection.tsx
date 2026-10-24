'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { HeroInteractiveSandbox } from './HeroInteractiveSandbox';

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl w-full px-4 pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="text-center max-w-4xl mx-auto">
        {/* A. Eyebrow / Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-emerald-400 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="truncate">
            LIVE: Over 10,000+ Audited Creators Across 50+ Indian Cities • Real-Time Commercials
          </span>
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* B. Main Headline (Sharp & Punchy) */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="tracking-[-0.03em] font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[1.08] text-white font-sans mb-6"
        >
          <span>Stop Pitching Clients With Clunky Sheets.</span>{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent block mt-2">
            The Operating System
          </span>{' '}
          <span className="block mt-1">For Indian Creator Campaigns.</span>
        </motion.h1>

        {/* C. Subheadline (Value & Actionability) */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10"
        >
          Discover vetted Instagram &amp; YouTube creators across 50+ Indian cities, generate client pitch decks in 1-click with live client approval toggles, and track live deliverable reels without endless WhatsApp follow-ups.
        </motion.p>

        {/* D. Call-To-Actions (Dual-Conversion Engine) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          {/* Primary CTA */}
          <Link
            href="/discover"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-base px-7 py-3.5 rounded-xl shadow-[0_0_28px_rgba(16,185,129,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Launch Free Agency Sandbox →</span>
          </Link>

          {/* Secondary CTA */}
          <a
            href="/pitch/sample-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-200 border border-zinc-700/60 font-medium text-base px-6 py-3.5 rounded-xl backdrop-blur-md transition-all hover:text-white"
          >
            <span>View Sample Client Pitch ↗</span>
          </a>
        </motion.div>

        {/* E. Risk Reversal Micro-Copy */}
        <p className="text-xs font-mono text-zinc-500 tracking-wide mt-3 text-center">
          ⚡ Instant Setup • No Credit Card Required • Trusted by 50+ Indian Digital Agencies
        </p>
      </div>

      {/* 2. Interactive Live Hero Demo / Sandbox */}
      <HeroInteractiveSandbox />
    </section>
  );
}
