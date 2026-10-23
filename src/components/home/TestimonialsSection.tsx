'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { CLIENT_TESTIMONIALS } from './mockData';

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl w-full px-4 py-20 sm:py-24 lg:py-32 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-20">
        <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-4">
          Proven Campaign Outcomes
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
          Hear from leaders running 8-figure Indian creator campaigns.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {CLIENT_TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-sm ${
              t.highlight
                ? 'border-emerald-500/40 bg-[#0E1013] shadow-[0_0_25px_rgba(16,185,129,0.12)]'
                : 'border-zinc-800/80 bg-[#0E1013]/90 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]'
            }`}
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="mt-5 text-sm text-zinc-300 leading-relaxed italic font-normal">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3.5 border-t border-zinc-900 pt-5">
              <div
                className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm font-mono shrink-0 ${
                  t.highlight
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                }`}
              >
                {t.initials}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">{t.author}</h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {t.role}, {t.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
