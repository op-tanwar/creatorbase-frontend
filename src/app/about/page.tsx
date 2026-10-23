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
    { stat: '50,000+', label: 'Verified Indian Creators Indexed' },
    { stat: '28', label: 'States & Union Territories Covered' },
    { stat: '₹12Cr+', label: 'Campaign Budgets Tracked' },
    { stat: '200+', label: 'Active Indian D2C Brands & Agencies' },
  ];

  return (
    <div className="relative overflow-hidden bg-zinc-950 py-16 sm:py-24 text-zinc-100">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-indigo-600/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mission Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Our Mission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            Eliminating the black-box tax in Indian influencer marketing.
          </h1>
          <p className="mt-5 text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed">
            We are building the definitive creator discovery, demographic verification, and campaign intelligence infrastructure for India&apos;s digital-first economy.
          </p>
        </div>

        {/* The Story / The Problem with Global Tools */}
        <div id="story" className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                The Backstory
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                Why global platforms like Modash and HypeAuditor fall short in India.
              </h2>

              <div className="mt-5 space-y-4 text-sm text-zinc-400 leading-relaxed">
                <p>
                  For years, Indian growth marketers and agencies have had only two bad choices: pay exorbitant US-dollar subscriptions for Western platforms that barely index Tier-2 creators, or rely on opaque middlemen brokers who take 40% hidden margins.
                </p>
                <p>
                  Global tools treat India as an afterthought. They misclassify regional dialects, fail to index breakout creators in Indore, Bhopal, Jaipur, or Ahmedabad, and calculate misleading commercial benchmarks based on Western CPMs.
                </p>
                <p>
                  CreatorBase was born in Indore — the street food and D2C capital of Central India — to give Indian founders, brands, and performance agencies the exact local intelligence, audience bot audits, and Indian Rupee commercial rate estimations they need to scale with certainty.
                </p>
              </div>
            </div>

            {/* Visual Callout Box */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-400" />
                <span>The CreatorBase Difference</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300">
                    <strong className="text-white">Local Tier 2/3 Data:</strong> 50,000+ creators across Hindi, Marathi, Gujarati, Punjabi, and regional belts.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300">
                    <strong className="text-white">INR Pricing in ₹:</strong> Flat Indian Rupee subscriptions with GST invoices and local payment methods (UPI, NetBanking, Cards).
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300">
                    <strong className="text-white">Commercial Benchmark IQ:</strong> Realistic estimated reel and story rates calibrated to the Indian market.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300">
                    <strong className="text-white">Zero Broker Markups:</strong> Direct official business emails and contact channels provided for every verified creator.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          {milestones.map((m) => (
            <div key={m.label} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {m.stat}
              </span>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Our Principles
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Built on truth, speed, and engineering precision.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{v.title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-24 text-center border-t border-zinc-800/80 pt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to experience honest Indian influencer intelligence?
          </h2>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
            >
              <span>Explore Live Creator Database</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <span>Connect with Founders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
