'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl w-full px-4 pt-20 pb-10 sm:pt-28 sm:pb-14 lg:pt-36 lg:pb-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1 text-xs font-mono font-medium text-emerald-300 shadow-sm shadow-emerald-950/60 backdrop-blur-md mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="tracking-wide">
            CREATORBASE ENGINE v2.4 • TIER 1 &amp; TIER 2 INDEX LIVE 🇮🇳
          </span>
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white font-sans leading-[1.08] mb-6"
        >
          <span>The High-Precision Creator</span>{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent block mt-1.5">
            Search Engine for Bharat.
          </span>
        </motion.h1>

        {/* Description: Locked to max-w-2xl */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed font-normal mb-8 sm:mb-10"
        >
          Direct API &amp; discovery interface for <strong className="text-zinc-200">50,000+ audited creators</strong> across Indore, Surat, Jaipur, Mumbai, and Delhi. Zero bot variance. Verified engagement rates.
        </motion.p>

        {/* CTAs: Standard h-12 with 16px gap */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/discover"
            className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-6 text-sm sm:text-base shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Creator Engine (Live Demo)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/pricing"
            className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2.5 rounded-lg border border-zinc-800 bg-[#0E1013]/90 px-6 text-sm sm:text-base font-medium text-zinc-200 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span>View API &amp; Pricing</span>
            <span className="rounded bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 hidden sm:inline">
              ⌘K
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
          </Link>
        </motion.div>

        {/* Micro-guarantees */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            No credit card required
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Instant 7-day trial
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Indian Rupee (₹) pricing
          </span>
        </div>
      </div>
    </section>
  );
}
