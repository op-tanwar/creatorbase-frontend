'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { HeroInteractiveStage } from './HeroInteractiveStage';

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl w-full pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Background Ambient Spotlight Engine */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.18),transparent_70%)] blur-[100px]" />

      <div className="text-center max-w-4xl mx-auto">
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 inline-block max-w-full"
        >
          <a
            href="/#pitch-portals"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/[0.08] bg-[#0C0E12]/90 px-3 py-1.5 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-mono text-zinc-300 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-emerald-500/40 hover:text-white transition-all text-center leading-snug break-words max-w-[92vw]"
          >
            <span className="text-emerald-400 shrink-0">✦</span>
            <span className="tracking-wide">
              NEW: White-Label Client Pitch Portals &amp; Live Kanban v2.4
            </span>
            <span className="text-zinc-500 transition-transform group-hover:translate-x-0.5 shrink-0">
              →
            </span>
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent pointer-events-none" />
          </a>
        </motion.div>

        {/* Main Headline (Fluid Scaling with Zero Text Clipping) */}
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] max-w-4xl mx-auto text-center break-words text-white font-sans mb-6"
        >
          The Modern Operating System
          <br />
          <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
            For Indian Creator Campaigns.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto mt-4 sm:mt-6 leading-relaxed font-normal mb-8 sm:mb-10 font-sans px-2 sm:px-0"
        >
          Discover 1,000+ audited Indian creators across 50+ cities, share no-login client approval decks in one click, and track live campaign reels—without messy spreadsheets.
        </motion.p>

        {/* Responsive CTA Button Stack */}
        <motion.div
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto mt-8"
        >
          {/* Primary CTA */}
          <Link
            href="/discover"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm sm:text-base font-semibold text-black shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all hover:bg-zinc-200 active:scale-95"
          >
            <span>Launch Discovery Engine →</span>
          </Link>

          {/* Secondary CTA */}
          <a
            href="/pitch/sample-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-[#0C0E12]/90 px-6 py-3.5 text-sm sm:text-base font-medium text-zinc-300 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/[0.2] hover:text-white transition-all active:scale-95"
          >
            <span>Explore Live Pitch Demo ↗</span>
          </a>
        </motion.div>

        {/* Telemetry Micro-Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono text-zinc-500 text-center flex-wrap px-2 leading-normal"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>GST SAC 998314 COMPLIANT • ZERO BROKER MARKUPS • NO CREDIT CARD REQUIRED</span>
        </motion.div>
      </div>

      {/* Hero Interactive Framed Product Stage */}
      <HeroInteractiveStage />
    </section>
  );
}
