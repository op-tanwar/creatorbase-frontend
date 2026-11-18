'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Lock,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Mail,
  Zap,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

type City = 'Indore' | 'Mumbai' | 'Bangalore' | 'Delhi';
type Niche = 'Tech' | 'Food' | 'Fashion';

interface StageCreator {
  id: string;
  name: string;
  handle: string;
  city: string;
  state: string;
  niche: string;
  platform: 'INSTAGRAM' | 'YOUTUBE';
  followers: string;
  er: string;
  authenticity: number;
  medianViews: string;
  rateInr: string;
  rateNumeric: number;
  email: string;
  avatar: string;
  bio: string;
}

const STAGE_DATA: Record<City, Record<Niche, StageCreator>> = {
  Indore: {
    Tech: {
      id: 'ind-tech',
      name: 'Devansh Agrawal',
      handle: '@devanshtech_indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      niche: 'Tech & Gadgets',
      platform: 'YOUTUBE',
      followers: '245K',
      er: '4.8%',
      authenticity: 96,
      medianViews: '184K',
      rateInr: '₹18,000',
      rateNumeric: 18000,
      email: 'devansh@techmp.in',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      bio: 'Consumer electronics unboxing & budget benchmarks in Hindi.',
    },
    Food: {
      id: 'ind-food',
      name: 'Rahul Agrawal',
      handle: '@indori_foodie_rahul',
      city: 'Indore',
      state: 'Madhya Pradesh',
      niche: 'Food & Cafes',
      platform: 'INSTAGRAM',
      followers: '148K',
      er: '5.8%',
      authenticity: 97,
      medianViews: '220K',
      rateInr: '₹14,000',
      rateNumeric: 14000,
      email: 'collabs@indorifoodie.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: '56 Dukan & Sarafa street food guide. 82% Central India audience.',
    },
    Fashion: {
      id: 'ind-fashion',
      name: 'Kritika Verma',
      handle: '@kritikastyle_mp',
      city: 'Indore',
      state: 'Madhya Pradesh',
      niche: 'Fashion & Styling',
      platform: 'INSTAGRAM',
      followers: '112K',
      er: '6.2%',
      authenticity: 94,
      medianViews: '145K',
      rateInr: '₹12,500',
      rateNumeric: 12500,
      email: 'mgmt@kritikaverma.in',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      bio: 'Affordable festive wear and Tier-2 D2C brand lookbooks.',
    },
  },
  Mumbai: {
    Tech: {
      id: 'mum-tech',
      name: 'Aarav Mehta',
      handle: '@mumbai_tech_review',
      city: 'Mumbai',
      state: 'Maharashtra',
      niche: 'Tech & Gadgets',
      platform: 'YOUTUBE',
      followers: '385K',
      er: '4.2%',
      authenticity: 98,
      medianViews: '320K',
      rateInr: '₹35,000',
      rateNumeric: 35000,
      email: 'aarav@mumbaitech.co',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'In-depth smartphone teardowns & creator productivity workflows.',
    },
    Food: {
      id: 'mum-food',
      name: 'Pooja Sawant',
      handle: '@bombay_fork_knife',
      city: 'Mumbai',
      state: 'Maharashtra',
      niche: 'Food & Cafes',
      platform: 'INSTAGRAM',
      followers: '290K',
      er: '5.1%',
      authenticity: 95,
      medianViews: '280K',
      rateInr: '₹28,000',
      rateNumeric: 28000,
      email: 'pooja@bombayfork.in',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      bio: 'Bandra-Colaba secret dining & craft cocktail bar curator.',
    },
    Fashion: {
      id: 'mum-fashion',
      name: 'Rhea Singhania',
      handle: '@rheasinghania.luxury',
      city: 'Mumbai',
      state: 'Maharashtra',
      niche: 'Fashion & Luxury',
      platform: 'INSTAGRAM',
      followers: '420K',
      er: '3.9%',
      authenticity: 96,
      medianViews: '390K',
      rateInr: '₹42,000',
      rateNumeric: 42000,
      email: 'pr@rheasinghania.com',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
      bio: 'High street & luxury bridal styling with editorial aesthetics.',
    },
  },
  Bangalore: {
    Tech: {
      id: 'blr-tech',
      name: 'Nikhil Rao',
      handle: '@nikhil_devops',
      city: 'Bangalore',
      state: 'Karnataka',
      niche: 'Developer & AI Tools',
      platform: 'YOUTUBE',
      followers: '210K',
      er: '6.4%',
      authenticity: 99,
      medianViews: '190K',
      rateInr: '₹32,000',
      rateNumeric: 32000,
      email: 'nikhil@blrcoding.dev',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'SaaS tooling, AI agents architecture, and developer gear reviews.',
    },
    Food: {
      id: 'blr-food',
      name: 'Kiran Swaminathan',
      handle: '@bengaluru_dosa_trail',
      city: 'Bangalore',
      state: 'Karnataka',
      niche: 'Food & Cafes',
      platform: 'INSTAGRAM',
      followers: '165K',
      er: '5.5%',
      authenticity: 96,
      medianViews: '215K',
      rateInr: '₹16,000',
      rateNumeric: 16000,
      email: 'kiran@dosatrail.in',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      bio: 'South Indian filter coffee, ghee roast dosas & Indiranagar craft beer.',
    },
    Fashion: {
      id: 'blr-fashion',
      name: 'Tara Shetty',
      handle: '@tarashetty.minimal',
      city: 'Bangalore',
      state: 'Karnataka',
      niche: 'Sustainable Fashion',
      platform: 'INSTAGRAM',
      followers: '135K',
      er: '5.2%',
      authenticity: 95,
      medianViews: '170K',
      rateInr: '₹18,500',
      rateNumeric: 18500,
      email: 'collab@tarashetty.in',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      bio: 'Minimalist capsule wardrobe & handloom sustainable textile advocate.',
    },
  },
  Delhi: {
    Tech: {
      id: 'del-tech',
      name: 'Karan Sachdeva',
      handle: '@delhitechtalks',
      city: 'Delhi',
      state: 'Delhi NCR',
      niche: 'Tech & Gadgets',
      platform: 'YOUTUBE',
      followers: '520K',
      er: '4.5%',
      authenticity: 97,
      medianViews: '450K',
      rateInr: '₹48,000',
      rateNumeric: 48000,
      email: 'karan@delhitechtalks.com',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      bio: 'EV comparisons, flagship phones & smart home automation in NCR.',
    },
    Food: {
      id: 'del-food',
      name: 'Manpreet Singh',
      handle: '@delhi_chaat_diaries',
      city: 'Delhi',
      state: 'Delhi NCR',
      niche: 'Food & Cafes',
      platform: 'INSTAGRAM',
      followers: '340K',
      er: '6.0%',
      authenticity: 95,
      medianViews: '380K',
      rateInr: '₹30,000',
      rateNumeric: 30000,
      email: 'partnerships@delhichaat.in',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      bio: 'Old Delhi chole bhature trails to modern CyberHub culinary spots.',
    },
    Fashion: {
      id: 'del-fashion',
      name: 'Ananya Kapoor',
      handle: '@ananyakapoor.couture',
      city: 'Delhi',
      state: 'Delhi NCR',
      niche: 'Fashion & Bridal',
      platform: 'INSTAGRAM',
      followers: '380K',
      er: '4.7%',
      authenticity: 96,
      medianViews: '350K',
      rateInr: '₹38,000',
      rateNumeric: 38000,
      email: 'ananya@couturedelhi.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Delhi winter layering, Shahpur Jat boutique curation & wedding styling.',
    },
  },
};

export function HeroInteractiveStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<City>('Indore');
  const [selectedNiche, setSelectedNiche] = useState<Niche>('Food');
  const [approvedCreators, setApprovedCreators] = useState<Set<string>>(
    new Set(['ind-food'])
  );
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Perspective scroll tilt flattening
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.6, 1]);

  const activeCreator = STAGE_DATA[selectedCity][selectedNiche];

  const toggleApprove = (id: string) => {
    setApprovedCreators((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info('Removed from client deck shortlist');
      } else {
        next.add(id);
        toast.success(`Approved ${activeCreator.name} for campaign!`);
      }
      return next;
    });
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast.success(`Copied ${email} to clipboard!`);
    setTimeout(() => setCopiedEmail(null), 2200);
  };

  // Calculate live approved budget
  let totalApprovedBudget = 0;
  approvedCreators.forEach((id) => {
    // Find creator across matrix
    Object.values(STAGE_DATA).forEach((cityGroup) => {
      Object.values(cityGroup).forEach((c) => {
        if (c.id === id) {
          totalApprovedBudget += c.rateNumeric;
        }
      });
    });
  });

  const isApproved = approvedCreators.has(activeCreator.id);

  return (
    <div
      ref={containerRef}
      id="engine"
      className="relative mx-auto max-w-6xl w-full mt-10 sm:mt-14 lg:mt-16 perspective-[1000px]"
    >
      {/* Ambient Radial Spotlight Under Stage */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_65%)] blur-[90px]" />

      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformStyle: 'preserve-3d',
        }}
        className="rounded-xl sm:rounded-2xl border border-white/[0.08] bg-[#0A0C10] shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden"
      >
        {/* macOS / Linear Dark Browser Window Header */}
        <div className="flex h-11 items-center justify-between border-b border-white/[0.06] bg-[#08090C] px-3 sm:px-6">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56]/90 border border-[#E0443E]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E]/90 border border-[#DEA123]" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F]/90 border border-[#1AAB29]" />
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/[0.06] bg-black/50 px-3.5 py-1 text-xs text-zinc-400 font-mono">
            <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
            <span className="text-zinc-500">https://</span>
            <span className="text-zinc-200">creatorbase.in</span>
            <span className="text-zinc-500">/engine/discovery</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-emerald-400 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>24ms API LATENCY</span>
          </div>
        </div>

        {/* Product Stage Content Area */}
        <div className="p-3 sm:p-5 lg:p-6">
          {/* Interactive Filter Switches: Cities & Niches */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-white/[0.06]">
            {/* City Selector with Smooth Horizontal Scroll on Mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
              <span className="text-[11px] sm:text-xs font-mono uppercase text-zinc-500 mr-1 flex items-center gap-1 shrink-0">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span>City:</span>
              </span>
              {(['Indore', 'Mumbai', 'Bangalore', 'Delhi'] as City[]).map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-mono font-medium transition-all ${
                    selectedCity === city
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'text-zinc-400 hover:text-white border border-transparent hover:border-white/[0.06]'
                  }`}
                >
                  {city}
                  {city === 'Indore' && (
                    <span className="ml-1 text-[9px] text-emerald-400 font-bold">HQ</span>
                  )}
                </button>
              ))}
            </div>

            {/* Niche Selector with Smooth Horizontal Scroll on Mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
              <span className="text-[11px] sm:text-xs font-mono uppercase text-zinc-500 mr-1 flex items-center gap-1 shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Niche:</span>
              </span>
              {(['Food', 'Tech', 'Fashion'] as Niche[]).map((niche) => (
                <button
                  key={niche}
                  onClick={() => setSelectedNiche(niche)}
                  className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-mono font-medium transition-all ${
                    selectedNiche === niche
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white border border-white/[0.06] bg-[#0E1014]'
                  }`}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>

          {/* Active Creator Card & Real-Time Telemetry Stage */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCity}-${selectedNiche}`}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch"
            >
              {/* Left Column: Creator Identity & Bio (5 cols) */}
              <div className="lg:col-span-5 rounded-xl border border-white/[0.06] bg-[#0C0E12] p-4 sm:p-5 lg:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative h-14 w-14 xs:h-16 xs:w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] shadow-md">
                      <Image
                        src={activeCreator.avatar}
                        alt={activeCreator.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <span className="absolute bottom-1 right-1 rounded-md bg-black/80 p-0.5 sm:p-1 text-white backdrop-blur-sm border border-white/[0.1]">
                        {activeCreator.platform === 'INSTAGRAM' ? (
                          <InstagramIcon className="h-3 w-3 text-pink-400" />
                        ) : (
                          <YoutubeIcon className="h-3 w-3 text-red-500" />
                        )}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm xs:text-base sm:text-lg font-bold text-white truncate">
                          {activeCreator.name}
                        </h4>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-xs font-mono text-zinc-400 truncate">
                        {activeCreator.handle}
                      </p>
                      <div className="mt-1.5 sm:mt-2 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-zinc-300">
                          <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                          <span>
                            {activeCreator.city}, {activeCreator.state}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans border-t border-white/[0.04] pt-3 sm:pt-4">
                    {activeCreator.bio}
                  </p>
                </div>

                {/* Direct Verified Business Email Snippet */}
                <div className="mt-4 sm:mt-5 rounded-lg border border-white/[0.06] bg-[#111317] p-2.5 sm:p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-mono text-zinc-200 truncate">
                      {activeCreator.email}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyEmail(activeCreator.email)}
                    className="shrink-0 flex h-9 w-9 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                    title="Copy direct collab email"
                  >
                    {copiedEmail === activeCreator.email ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Telemetry & Rate Card Deck (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                {/* 4 Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {/* Metric 1: Followers */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#0C0E12] p-2.5 sm:p-4 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Followers
                    </span>
                    <span className="text-base sm:text-xl font-bold font-mono text-white">
                      {activeCreator.followers}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                      Tier-1/2 Indian
                    </span>
                  </div>

                  {/* Metric 2: Real Engagement */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#0C0E12] p-2.5 sm:p-4 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Eng. Rate
                    </span>
                    <span className="text-base sm:text-xl font-bold font-mono text-emerald-400">
                      {activeCreator.er}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                      2.4x Niche Avg
                    </span>
                  </div>

                  {/* Metric 3: Authenticity Gauge */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#0C0E12] p-2.5 sm:p-4 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Authenticity
                    </span>
                    <span className="text-base sm:text-xl font-bold font-mono text-white flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                      <span>{activeCreator.authenticity}/100</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                      Bot-Free Reach
                    </span>
                  </div>

                  {/* Metric 4: Median Views */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#0C0E12] p-2.5 sm:p-4 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Median Views
                    </span>
                    <span className="text-base sm:text-xl font-bold font-mono text-zinc-100">
                      {activeCreator.medianViews}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                      Last 30 Reels
                    </span>
                  </div>
                </div>

                {/* Commercial Rate Card & Approval Action Box */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-0.5">
                      Verified Commercial Rate Card
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                        {activeCreator.rateInr}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        / Dedicated Reel
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 block mt-1">
                      GST ITC SAC 998314 • Zero Broker Markups
                    </span>
                  </div>

                  <button
                    onClick={() => toggleApprove(activeCreator.id)}
                    className={`w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-98 ${
                      isApproved
                        ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {isApproved ? (
                      <>
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>Included in Pitch Deck</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>+ Add to Campaign Deck</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Live Campaign Budget Telemetry Bar */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-zinc-500">DECK SIMULATION:</span>
              <span className="text-white font-bold">
                {approvedCreators.size} Creator{approvedCreators.size !== 1 ? 's' : ''} Selected
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">
                ₹{totalApprovedBudget.toLocaleString('en-IN')} Total Spend
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-400 text-[11px]">
                1-Click Client Approval Deck Ready
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
