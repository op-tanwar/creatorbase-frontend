'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function FinalCtaBanner() {
  return (
    <section className="relative mx-auto max-w-7xl w-full px-4 py-16 sm:py-24 lg:py-32 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0A0C10] p-6 sm:p-10 lg:p-16 text-center overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        {/* Ambient Emerald Radial Glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-[650px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.28),transparent_70%)] blur-[100px]" />

        {/* Shimmering Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-emerald-400 font-mono mb-5 sm:mb-6 max-w-[92vw] text-center">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">JOIN 50+ LEADING INDIAN AGENCIES</span>
        </div>

        {/* Main Title */}
        <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white font-sans max-w-3xl mx-auto leading-[1.12] mb-4 sm:mb-5 break-words">
          Ready to Upgrade Your
          <br />
          <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
            Agency Campaign Workflow?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-base lg:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10 font-sans px-2 sm:px-0">
          Discover verified Indian creators, generate white-label approval decks in 1-click, and eliminate manual spreadsheet chaos today.
        </p>

        {/* Responsive CTA Actions Stack */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm sm:text-base font-semibold text-black shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all hover:bg-zinc-200 active:scale-95"
          >
            <span>Launch Free Agency Sandbox →</span>
          </Link>

          <a
            href="/pitch/sample-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-[#0C0E12] px-7 py-3.5 text-sm sm:text-base font-medium text-zinc-300 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/[0.2] hover:text-white transition-all active:scale-95"
          >
            <span>Explore Live Pitch Demo ↗</span>
          </a>
        </div>

        {/* Risk Reversal Micro-Copy */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono text-zinc-500 text-center flex-wrap px-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>7-Day Free Trial • Instant Sandbox Access • Razorpay PCI-DSS Encrypted</span>
        </div>
      </div>
    </section>
  );
}
