'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Zap, Building2, CheckCircle2 } from 'lucide-react';

const CITIES = [
  'MUMBAI',
  'DELHI NCR',
  'BANGALORE',
  'INDORE',
  'JAIPUR',
  'PUNE',
  'AHMEDABAD',
  'HYDERABAD',
  'SURAT',
  'CHANDIGARH',
  'KOLKATA',
  'CHENNAI',
  'LUCKNOW',
  'KOCHI',
];

const METRICS_TICKER = [
  '1,012+ AUDITED PROFILES',
  '535+ VERIFIED DIRECT EMAILS',
  'ZERO BOT INFLATION',
  'GST COMPLIANT INVOICING (18% ITC)',
  '₹1.8CR+ COMMERCIAL SPEND MODELED',
  '50+ INDIAN AGENCIES',
  '24MS ENGINE LATENCY',
  'NO-LOGIN CLIENT APPROVAL DECKS',
];

const AGENCIES = [
  'Schbang',
  'FoxyMoron',
  'Dentsu Creative India',
  'Social Panga',
  'Gozoop Online',
  'Monk-E Talent',
  'White Rivers Media',
  'Kinnect',
];

const STATS = [
  { value: '1,012+', label: 'Audited Indian Creators', detail: 'Tier-1 & Tier-2 Hubs' },
  { value: '535+', label: 'Verified Direct Emails', detail: 'Zero Middleman Brokers' },
  { value: '94.8%', label: 'Avg Authenticity Score', detail: 'Verified Human Reach' },
  { value: '18% ITC', label: 'GST Compliant Invoicing', detail: 'SAC Code 998314' },
];

export function SocialProofMarquee() {
  return (
    <section id="cities" className="relative border-y border-white/[0.06] bg-[#08090C] py-16 sm:py-24 overflow-hidden">
      {/* Edge Fade Mask Container */}
      <div className="mask-marquee w-full overflow-hidden">
        {/* Ticker 1: Regional Cities (Forward) */}
        <div className="flex w-max items-center animate-marquee select-none py-2">
          {[...CITIES, ...CITIES, ...CITIES].map((city, idx) => (
            <div key={`${city}-${idx}`} className="flex items-center gap-3 px-6">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-zinc-400 hover:text-white transition-colors">
                {city}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          ))}
        </div>

        {/* Ticker 2: Audited Telemetry Metrics (Reverse) */}
        <div className="mt-4 flex w-max items-center animate-marquee-reverse select-none py-2">
          {[...METRICS_TICKER, ...METRICS_TICKER].map((metric, idx) => (
            <div key={`${metric}-${idx}`} className="flex items-center gap-3 px-6">
              <span className="text-xs font-mono tracking-wider text-emerald-400/90 font-medium">
                {metric}
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Agency Trust Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14 sm:mt-16">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6">
          Powering campaign execution for media buyers &amp; talent leads at
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {AGENCIES.map((agency) => (
            <div
              key={agency}
              className="flex items-center gap-2 text-zinc-400 font-sans text-xs sm:text-sm font-semibold tracking-tight hover:text-white transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{agency}</span>
            </div>
          ))}
        </div>

        {/* 4 Crisp Stat Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl sm:rounded-2xl border border-white/[0.07] bg-[#0C0E12]/90 p-3.5 sm:p-5 lg:p-6 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-emerald-500/30 transition-all"
            >
              <span className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-white block">
                {stat.value}
              </span>
              <h4 className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-semibold text-zinc-200 font-sans leading-tight">
                {stat.label}
              </h4>
              <p className="mt-1 text-[10px] sm:text-[11px] font-mono text-zinc-500">{stat.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
