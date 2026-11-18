'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  Heart,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Users2,
  Target,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: '100% Data Transparency',
      desc: 'We never take kickbacks from talent managers or manipulate creator rankings. Our metrics reflect verified platform engagement, raw API numbers, and objective audience analysis.',
    },
    {
      icon: MapPin,
      title: 'Built for Bharat & Tier 2/3 Regions',
      desc: 'India is not just South Bombay and South Delhi. 68% of new internet consumers live in Tier 2 and Tier 3 cities like Indore, Bhopal, Jaipur, and Surat. We index vernacular creators that drive actual conversion.',
    },
    {
      icon: Code2,
      title: 'Developer-Grade Reliability',
      desc: 'Our data pipelines run 24/7 with zero mock data. From instant RFC-4180 CSV generation to sub-second filter searches, our engineering standard is built for enterprise scale.',
    },
  ];

  const milestones = [
    { stat: '1,012+', label: 'Audited Indian Creators Indexed' },
    { stat: '50+', label: 'Indian Tier-1 & Tier-2 Hubs' },
    { stat: '₹1.8Cr+', label: 'Campaign Spend Modeled' },
    { stat: '50+', label: 'Active Indian Digital Agencies' },
  ];

  return (
    <div className="relative overflow-hidden bg-[#060709] py-16 sm:py-24 text-zinc-100">
      {/* Background ambient spotlight */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mission Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>OUR MISSION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white font-sans leading-[1.08]">
            Eliminating the Black-Box Tax
            <br />
            <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
              In Indian Influencer Marketing.
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto">
            Building the definitive creator discovery, demographic verification, and campaign intelligence infrastructure for India&apos;s digital-first economy.
          </p>
        </div>

        {/* The Backstory */}
        <div id="story" className="mt-16 rounded-3xl border border-white/[0.08] bg-[#0C0E12]/90 p-6 sm:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                THE BACKSTORY
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                Why global platforms fall short in Bharat.
              </h2>

              <div className="mt-5 space-y-4 text-sm text-zinc-400 leading-relaxed font-sans">
                <p>
                  For years, Indian growth marketers and agencies have had only two bad choices: pay exorbitant US-dollar subscriptions ($300+/mo) for Western platforms that barely index Tier-2 creators, or rely on opaque middlemen brokers who take 40% hidden margins.
                </p>
                <p>
                  Global tools treat India as an afterthought. They fail to index breakout vernacular creators in Indore, Bhopal, Jaipur, or Ahmedabad, and calculate misleading commercial benchmarks based on Western CPMs.
                </p>
                <p>
                  CreatorBase was born in Indore — the street food and D2C capital of Central India — to give Indian founders, brands, and performance agencies the exact local intelligence, audience bot audits, and Indian Rupee commercial rate estimations they need to scale with certainty.
                </p>
              </div>
            </div>

            {/* Difference Box */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#08090C] p-6 sm:p-8 space-y-4 shadow-inner">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-sans">
                <Target className="h-5 w-5 text-emerald-400" />
                <span>The CreatorBase Difference</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm font-sans">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300">
                    <strong className="text-white">Hyper-Local Tier 2/3 Index:</strong> Indore, Surat, Jaipur, Pune, Chandigarh with regional dialect telemetry.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300">
                    <strong className="text-white">1-Click Client Approval Portals:</strong> White-label decks with zero client logins required.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300">
                    <strong className="text-white">GST Invoicing &amp; 18% ITC:</strong> 100% compliant tax invoices under SAC Code 998314.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Milestones */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-white/[0.07] bg-[#0C0E12]/90 p-5 sm:p-6 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] text-center"
            >
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-white block">
                {m.stat}
              </span>
              <p className="mt-2 text-xs font-mono text-zinc-400">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Our Core Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <SpotlightCard key={v.title} className="flex flex-col justify-between">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-white font-sans">{v.title}</h3>
                    <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">{v.desc}</p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
