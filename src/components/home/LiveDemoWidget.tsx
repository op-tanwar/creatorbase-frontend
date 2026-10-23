'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  MapPin,
  Search,
  X,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { DEMO_CREATORS, DemoCreator } from './mockData';

export function LiveDemoWidget() {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedNiche, setSelectedNiche] = useState<string>('All');
  const [inspectCreator, setInspectCreator] = useState<DemoCreator | null>(null);

  const cities = ['All', 'Indore', 'Mumbai', 'Bangalore'];
  const niches = ['All', 'Food', 'Tech', 'Lifestyle'];

  const filteredDemoCreators = DEMO_CREATORS.filter((c) => {
    const cityMatch =
      selectedCity === 'All' ||
      c.city.toLowerCase() === selectedCity.toLowerCase();

    const nicheMatch =
      selectedNiche === 'All' ||
      (selectedNiche === 'Lifestyle'
        ? c.niche.includes('Fashion') || c.niche.includes('Fitness') || c.niche.includes('Travel')
        : c.niche.toLowerCase().includes(selectedNiche.toLowerCase()));

    return cityMatch && nicheMatch;
  }).slice(0, 3);

  return (
    <section id="demo" className="border-t border-[#24272E] bg-zinc-950/60 py-20 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-4">
            Zero-Auth Sandbox Environment
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans mb-4">
            Test Indian Creator Intelligence Live
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
            Query verified Indian creators by city and vertical with sub-second execution. No login or signup required.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-[#0E1013]/90 p-4 sm:p-5 backdrop-blur-md mb-8 sm:mb-10">
          {/* City Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-zinc-500 font-mono mr-1">City:</span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all font-mono ${
                  selectedCity === city
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Niche Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-zinc-500 font-mono mr-1">Niche:</span>
            {niches.map((niche) => (
              <button
                key={niche}
                onClick={() => setSelectedNiche(niche)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all font-mono ${
                  selectedNiche === niche
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Live Micro-Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDemoCreators.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-zinc-800/80 bg-[#0E1013]/90 p-5 sm:p-6 shadow-lg transition-all hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="h-12 w-12 rounded-xl object-cover ring-2 ring-zinc-800 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white tracking-tight">{c.name}</h4>
                          {c.verified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-mono text-zinc-400">{c.handle}</p>
                      </div>
                    </div>

                    <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-300 uppercase">
                      {c.platform === 'INSTAGRAM' ? 'IG' : 'YT'}
                    </span>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-900 pt-3 font-mono">
                    <span className="flex items-center gap-1 text-zinc-300">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      {c.city}, {c.state}
                    </span>
                    <span className="text-emerald-400 font-semibold">{c.niche}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-zinc-950 p-3 text-center text-xs font-mono border border-zinc-900">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Followers</span>
                      <span className="font-bold text-white mt-0.5 block">{c.followers}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Eng. Rate</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">{c.engagement}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Est. Reel</span>
                      <span className="font-bold text-zinc-200 mt-0.5 block">{c.rate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">
                    Reach: <strong className="text-zinc-200">{c.authenticReach}</strong>
                  </span>

                  <button
                    onClick={() => setInspectCreator(c)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Inspect Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/discover"
            className="h-12 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-7 text-sm font-semibold text-zinc-950 shadow-md shadow-emerald-500/20 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Unlock All 50,000+ Profiles in Live App</span>
          </Link>
        </div>
      </div>

      {/* Inspect Profile Modal (Zero-Auth Sandbox) */}
      <AnimatePresence>
        {inspectCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectCreator(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0E1013] p-6 sm:p-7 shadow-2xl z-10 font-sans"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={inspectCreator.avatar}
                    alt={inspectCreator.name}
                    className="h-14 w-14 rounded-xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-white tracking-tight">{inspectCreator.name}</h3>
                      {inspectCreator.verified && (
                        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs font-mono text-zinc-400">{inspectCreator.handle}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                      📍 {inspectCreator.city}, {inspectCreator.state}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectCreator(null)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-xs text-zinc-300 leading-relaxed">
                {inspectCreator.bio}
              </p>

              {/* Monospace Deep Metrics Grid */}
              <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase">Authentic Reach</span>
                  <span className="text-base font-bold text-emerald-400">{inspectCreator.authenticReach}</span>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase">Median Reel Views</span>
                  <span className="text-base font-bold text-white">{inspectCreator.medianReelViews}</span>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase">Commercial Benchmark</span>
                  <span className="text-base font-bold text-emerald-400">{inspectCreator.commercialRate}</span>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase">Credibility Score</span>
                  <span className="text-base font-bold text-indigo-400">{inspectCreator.credibilityScore} / 100</span>
                </div>
              </div>

              {/* Collab Contact */}
              <div className="mt-4 rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  <span>{inspectCreator.contactEmail}</span>
                </div>
                <span className="text-emerald-400 text-[11px] font-semibold">Direct Access</span>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setInspectCreator(null)}
                  className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Close Preview
                </button>
                <Link
                  href="/register"
                  className="w-full h-11 inline-flex items-center justify-center rounded-lg bg-emerald-500 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
                >
                  Save to Shortlist →
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
