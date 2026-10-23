'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

export function FinalCtaBanner() {
  return (
    <section className="mx-auto max-w-7xl w-full px-4 py-20 sm:py-24 lg:py-32 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#0E1013] via-[#08090B] to-[#0E1013] p-8 sm:p-12 lg:p-16 text-center overflow-hidden shadow-2xl hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)] transition-all duration-300">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.25),transparent_70%)] blur-2xl" />

        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-semibold text-emerald-300 font-mono mb-6">
          <Zap className="h-3.5 w-3.5 text-emerald-400" />
          <span>Scale with Certainty</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans max-w-3xl mx-auto leading-tight mb-4">
          Ready to streamline your influencer discovery?
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10">
          Join 200+ Indian brands, founders, and performance agencies discovering top 1% regional talent in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-8 text-base shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Free Today (7-Day Trial)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-8 text-base font-semibold text-zinc-200 transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <span>Talk to Creator Specialist</span>
          </Link>
        </div>

        <p className="mt-6 sm:mt-8 text-xs text-zinc-500 font-mono">
          No credit card required • Cancel anytime • Indian Rupee (₹) pricing
        </p>
      </div>
    </section>
  );
}
