'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Code2,
  Layers,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';
import { DEMO_CREATORS } from './mockData';

export function InteractiveMockTerminal() {
  const [activeTab, setActiveTab] = useState<'inspector' | 'telemetry'>('inspector');
  const [selectedCity, setSelectedCity] = useState<'Indore' | 'Mumbai' | 'Jaipur'>('Indore');
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  // Map city to demo creator
  const cityCreatorMap: Record<string, number> = {
    Indore: 0, // Rahul Agrawal
    Mumbai: 1, // Aarav Mehta
    Jaipur: 3, // Vikram Rajput
  };

  const creatorIndex = cityCreatorMap[selectedCity] ?? 0;
  const currentCreator = DEMO_CREATORS[creatorIndex] || DEMO_CREATORS[0];

  const handleCopyCurl = () => {
    const curlCommand = `curl -X GET "https://api.creatorbase.in/v1/creators?city=${selectedCity.toLowerCase()}&verified=true" \\
  -H "Authorization: Bearer cb_live_ind_99283742" \\
  -H "Accept: application/json"`;

    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    toast.success('Copied cURL command to clipboard!');
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <section className="relative mx-auto max-w-7xl w-full px-4 pb-20 sm:pb-24 lg:pb-32 sm:px-6 lg:px-8">
      {/* Stripe-style Ambient Radial Glow behind hero console */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_65%)] blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative rounded-2xl border border-zinc-800/80 bg-[#0E1013]/90 shadow-2xl backdrop-blur-xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300"
      >
        {/* Terminal Window Chrome */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 bg-[#08090B] px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            {/* macOS Window Controls */}
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Path indicator */}
            <span className="font-mono text-xs text-zinc-400 hidden sm:inline ml-1">
              actor://intelligence.creatorbase.in/inspect?city={selectedCity.toLowerCase()}
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-zinc-900/90 border border-zinc-800 p-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'inspector'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Visual Inspector</span>
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Raw Telemetry (API)</span>
            </button>
          </div>
        </div>

        {/* Live Interactive City Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 bg-zinc-950/60 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mr-1">
              Target Hub:
            </span>
            {(['Indore', 'Mumbai', 'Jaipur'] as const).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  selectedCity === city
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm shadow-emerald-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                📍 {city}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-emerald-400">
              Live Stream • 12ms latency
            </span>
          </div>
        </div>

        {/* Tab Content Panes: Generous 24px - 32px padding */}
        <div className="p-5 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'inspector' ? (
              /* TAB 1: Visual Inspector (Stripe-style) */
              <motion.div
                key={`inspector-${selectedCity}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
              >
                {/* Left: Interactive Creator Card */}
                <div className="lg:col-span-7 rounded-xl border border-zinc-800/90 bg-[#08090B] p-5 sm:p-6 lg:p-7 shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={currentCreator.avatar}
                        alt={currentCreator.name}
                        className="h-14 w-14 rounded-xl object-cover ring-2 ring-emerald-500/30 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {currentCreator.name}
                          </h3>
                          {currentCreator.verified && (
                            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-mono text-zinc-400">{currentCreator.handle}</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-[11px] font-mono text-zinc-300">
                      {currentCreator.platform === 'INSTAGRAM' ? (
                        <>
                          <InstagramIcon className="h-3 w-3 text-pink-400 shrink-0" />
                          <span>INSTAGRAM</span>
                        </>
                      ) : (
                        <>
                          <YoutubeIcon className="h-3 w-3 text-red-400 shrink-0" />
                          <span>YOUTUBE</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-zinc-400 leading-relaxed font-normal">
                    {currentCreator.bio}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-900 pt-3 font-mono">
                    <span className="flex items-center gap-1 text-zinc-300">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      {currentCreator.city}, {currentCreator.state}
                    </span>
                    <span className="text-emerald-400 font-semibold">{currentCreator.niche}</span>
                  </div>

                  {/* 3-Column Telemetry Pills */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Genuine Reach */}
                    <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3.5 sm:p-4 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                        Genuine Reach
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-emerald-400">
                          {currentCreator.authenticReach}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: currentCreator.authenticReach }}
                        />
                      </div>
                    </div>

                    {/* Median Reel Views */}
                    <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3.5 sm:p-4 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                        Median Reel Views
                      </span>
                      <span className="font-mono text-base font-bold text-zinc-100 block">
                        {currentCreator.medianReelViews}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 block">
                        {currentCreator.followers} Followers
                      </span>
                    </div>

                    {/* Commercial Estimate */}
                    <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3.5 sm:p-4 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                        Commercial Est.
                      </span>
                      <span className="font-mono text-base font-bold text-emerald-400 block">
                        {currentCreator.commercialRate}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 block">
                        CPM: ₹{currentCreator.cpmInr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Telemetry Snapshot */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-xl border border-zinc-800/80 bg-[#08090B] p-5 font-mono text-xs space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                      <span className="text-zinc-500 uppercase text-[10px] tracking-wider font-semibold">
                        Audience Authenticity Score
                      </span>
                      <span className="text-emerald-400 font-bold">{currentCreator.credibilityScore} / 100</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-zinc-400 text-[11px]">
                        <span>Regional Hub Density:</span>
                        <span className="text-zinc-200">{currentCreator.regionalHub}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400 text-[11px]">
                        <span>Audience Gender Split:</span>
                        <span className="text-zinc-200">{currentCreator.genderSplit}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400 text-[11px]">
                        <span>Direct Collab Email:</span>
                        <span className="text-emerald-400">{currentCreator.contactEmail}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Bot Pod Probability:</span>
                      <span className="text-emerald-400 font-semibold">0.02% (Ultra Low)</span>
                    </div>
                  </div>

                  <Link
                    href="/discover"
                    className="h-11 flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-4 text-xs font-semibold text-emerald-400 transition-colors font-mono"
                  >
                    <span>Inspect 50,000+ Indian Profiles in Live Engine</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* TAB 2: Raw Telemetry / API Payload (Apify-style) */
              <motion.div
                key={`telemetry-${selectedCity}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">GET</span>
                    <span className="text-zinc-400">/v1/creators/{currentCreator.handle.replace('@', '')}.json</span>
                  </div>

                  <button
                    onClick={handleCopyCurl}
                    className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[11px] font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                  >
                    {copiedCurl ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied cURL!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-zinc-400" />
                        <span>Copy cURL</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Formatted JSON Payload */}
                <div className="font-mono text-xs sm:text-[13px] leading-relaxed bg-[#08090B] p-5 sm:p-6 rounded-xl border border-zinc-800/80 overflow-x-auto text-zinc-300">
                  <pre>
                    <span className="text-zinc-500">&#123;</span>{'\n'}
                    {'  '}<span className="text-zinc-400">&quot;creator&quot;</span>: <span className="text-emerald-300">&quot;{currentCreator.handle}&quot;</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">&quot;city&quot;</span>: <span className="text-emerald-300">&quot;{currentCreator.city}&quot;</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">&quot;state&quot;</span>: <span className="text-emerald-300">&quot;{currentCreator.state}&quot;</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">&quot;tier&quot;</span>: <span className="text-amber-300">{currentCreator.city === 'Mumbai' ? 1 : 2}</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">&quot;verified_followers&quot;</span>: <span className="text-amber-300">{parseInt(currentCreator.followers) * 1000}</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">&quot;engagement_rate&quot;</span>: <span className="text-amber-300">{parseFloat(currentCreator.engagement)}</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">&quot;audience_credibility_score&quot;</span>: <span className="text-amber-300">{currentCreator.credibilityScore}</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">&quot;contact&quot;</span>: <span className="text-emerald-300">&quot;{currentCreator.contactEmail}&quot;</span>{'\n'}
                    <span className="text-zinc-500">&#125;</span>
                  </pre>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
                  <span>Status: 200 OK • Content-Type: application/json</span>
                  <span className="text-emerald-400">Deterministic RFC-4180 / JSON Schema</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
