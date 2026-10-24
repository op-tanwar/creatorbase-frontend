'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { HeroInteractiveSandbox } from './HeroInteractiveSandbox';

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl w-full px-4 pt-20 pb-10 sm:pt-24 sm:pb-14 lg:pt-32 lg:pb-16 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="text-center max-w-4xl mx-auto">
        {/* Pulsing Live Eyebrow Badge (Pillar 2A) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald-500/40 bg-emerald-950/40 px-4 py-1.5 text-xs font-mono font-medium text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-md mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="tracking-wide">
            Over 10,000+ Verified Indian Creators Audited • Real-Time Rate Cards
          </span>
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* Headline (Pillar 2A) */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl lg:text-6xl text-white font-sans leading-[1.08] mb-6"
        >
          <span>Stop Pitching Clients With Clunky Excel Sheets.</span>{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent block mt-2">
            The All-In-One Influencer OS For High-Growth Agencies.
          </span>
        </motion.h1>

        {/* Subheadline (Pillar 2A) */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-3xl text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed font-normal mb-8 sm:mb-10 font-sans"
        >
          Discover vetted Indian Instagram &amp; YouTube talent across 50+ cities, generate branded no-login client pitch portals in 1-click, and track campaign deliverables with live reel verification.
        </motion.p>

        {/* Primary & Secondary CTAs (Pillar 2A) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/discover"
            className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-7 text-sm sm:text-base shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] font-mono"
          >
            <span>Launch Free Agency Sandbox →</span>
          </Link>

          <a
            href="/pitch/sample-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-[#12141A]/80 px-6 text-sm sm:text-base font-semibold text-zinc-200 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:bg-white/[0.08] hover:text-white font-mono shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            <span>View Live Sample Pitch Deck ↗</span>
          </a>
        </motion.div>

        {/* Trust micro-badges */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            100% Authentic Indian Reach
          </span>
          <span className="text-zinc-700">•</span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-emerald-500" />
            Instant Unauthenticated Pitch Portals
          </span>
          <span className="text-zinc-700">•</span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            GST Tax Invoices (18% ITC)
          </span>
        </div>
      </div>

      {/* Live Interactive Preview / Sandbox in Hero */}
      <div className="mt-10 sm:mt-12">
        <HeroInteractiveSandbox />
      </div>
    </section>
  );
}
