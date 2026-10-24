'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  CheckCircle2,
  XCircle,
  Kanban,
  IndianRupee,
  ShieldCheck,
  ExternalLink,
  Copy,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Check,
  X,
  PlaySquare,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Layers,
  Zap,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { toast } from 'sonner';

interface SandboxCreator {
  id: string;
  name: string;
  handle: string;
  city: string;
  niche: string;
  followers: string;
  er: string;
  views: string;
  assignedFeeINR: number;
  authenticityScore: number;
  avatar: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const INITIAL_PITCH_CREATORS: SandboxCreator[] = [
  {
    id: 's1',
    name: 'Rahul Agrawal',
    handle: 'indori_foodie_rahul',
    city: 'Indore',
    niche: 'Food & Dining',
    followers: '148K',
    er: '5.8%',
    views: '220K',
    assignedFeeINR: 14000,
    authenticityScore: 96,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    status: 'APPROVED',
  },
  {
    id: 's2',
    name: 'Aarav Mehta',
    handle: 'mumbai_tech_review',
    city: 'Mumbai',
    niche: 'Tech & Gadgets',
    followers: '385K',
    er: '4.2%',
    views: '410K',
    assignedFeeINR: 35000,
    authenticityScore: 97,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    status: 'APPROVED',
  },
  {
    id: 's3',
    name: 'Ananya Sharma',
    handle: 'delhi_street_style',
    city: 'Delhi NCR',
    niche: 'Beauty & Fashion',
    followers: '215K',
    er: '6.1%',
    views: '350K',
    assignedFeeINR: 22000,
    authenticityScore: 98,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    status: 'PENDING',
  },
];

interface KanbanCardItem {
  id: string;
  name: string;
  handle: string;
  city: string;
  fee: number;
  stage: 'SHORTLISTED' | 'OUTREACH' | 'COMMERCIALS' | 'DRAFT' | 'LIVE';
  liveUrl?: string;
  notes: string;
}

const INITIAL_KANBAN_ITEMS: KanbanCardItem[] = [
  {
    id: 'k1',
    name: 'Shlok Srivastava',
    handle: 'techburner',
    city: 'Delhi NCR',
    fee: 450000,
    stage: 'COMMERCIALS',
    notes: 'Commercial agreed: 1x YouTube integration + 1x Reel. Script brief approved.',
  },
  {
    id: 'k2',
    name: 'Komal Pandey',
    handle: 'komalpandeyofficial',
    city: 'Delhi NCR',
    fee: 220000,
    stage: 'DRAFT',
    notes: 'Draft video in review. Client requested logo placement in first 3 seconds.',
  },
  {
    id: 'k3',
    name: 'Amar Sirohi',
    handle: 'foodieincarnate',
    city: 'Indore',
    fee: 110000,
    stage: 'LIVE',
    liveUrl: 'https://instagram.com/reel/example_live_proof',
    notes: 'Live on Instagram! 840K organic views in first 24h. Payout executed.',
  },
  {
    id: 'k4',
    name: 'Rohan Joshi',
    handle: 'rohan_fintech',
    city: 'Mumbai',
    fee: 95000,
    stage: 'OUTREACH',
    notes: 'Pitch sent via verified business email. Awaiting rate card confirmation.',
  },
];

// Interactive City & Category Sandbox Data Matrix
const CITY_CATEGORY_MATRIX: Record<
  string,
  Record<
    string,
    {
      sampleCreator: string;
      handle: string;
      followers: string;
      er: string;
      reelRate: string;
      storyRate: string;
      authenticity: number;
      topDemographic: string;
      avatar: string;
    }
  >
> = {
  Indore: {
    Tech: {
      sampleCreator: 'Devansh Tech Tips',
      handle: 'devanshtech_indore',
      followers: '185K',
      er: '5.2%',
      reelRate: '₹18,000 – ₹24,000',
      storyRate: '₹6,000 – ₹8,500',
      authenticity: 97,
      topDemographic: '82% MP & Central India (18-24)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    },
    Food: {
      sampleCreator: 'Indori Food Explorer',
      handle: 'indori_zaika_official',
      followers: '320K',
      er: '6.8%',
      reelRate: '₹22,000 – ₹30,000',
      storyRate: '₹8,000 – ₹11,000',
      authenticity: 98,
      topDemographic: '74% Indore, Ujjain, Bhopal (21-35)',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    },
    Fashion: {
      sampleCreator: 'Malwa Ethnic Couture',
      handle: 'malwa_threads_indore',
      followers: '142K',
      er: '4.9%',
      reelRate: '₹15,000 – ₹21,000',
      storyRate: '₹5,500 – ₹7,500',
      authenticity: 95,
      topDemographic: '68% Female (Indore & Tier-2)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    Finance: {
      sampleCreator: 'Madhya Pradesh Wealth Insights',
      handle: 'mp_wealth_growth',
      followers: '96K',
      er: '4.4%',
      reelRate: '₹28,000 – ₹38,000',
      storyRate: '₹10,000 – ₹14,000',
      authenticity: 96,
      topDemographic: '79% Salaried Professionals (Central India)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  },
  Mumbai: {
    Tech: {
      sampleCreator: 'Colaba Gadget Lab',
      handle: 'mumbaigadgetlab',
      followers: '680K',
      er: '4.8%',
      reelRate: '₹65,000 – ₹85,000',
      storyRate: '₹22,000 – ₹28,000',
      authenticity: 98,
      topDemographic: '84% Metros (Mumbai, Pune, Bangalore)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    Food: {
      sampleCreator: 'Bombay Gourmet Trail',
      handle: 'bombaybites_hq',
      followers: '540K',
      er: '5.5%',
      reelRate: '₹55,000 – ₹72,000',
      storyRate: '₹18,000 – ₹24,000',
      authenticity: 96,
      topDemographic: '76% Urban Foodies (South & West Mumbai)',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    },
    Fashion: {
      sampleCreator: 'Bandra High Fashion',
      handle: 'bandra_runway',
      followers: '890K',
      er: '4.6%',
      reelRate: '₹90,000 – ₹1,20,000',
      storyRate: '₹30,000 – ₹42,000',
      authenticity: 97,
      topDemographic: '71% Female Luxury Buyers (18-34)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    },
    Finance: {
      sampleCreator: 'Dalal Street Alpha',
      handle: 'dalalstreet_alpha',
      followers: '450K',
      er: '4.9%',
      reelRate: '₹1,20,000 – ₹1,65,000',
      storyRate: '₹40,000 – ₹55,000',
      authenticity: 99,
      topDemographic: '88% High-Net-Worth Investors & Traders',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    },
  },
  Bangalore: {
    Tech: {
      sampleCreator: 'Koramangala Code & Hardware',
      handle: 'bengaluru_tech_pulse',
      followers: '520K',
      er: '5.6%',
      reelRate: '₹58,000 – ₹78,000',
      storyRate: '₹20,000 – ₹26,000',
      authenticity: 99,
      topDemographic: '91% Software Engineers & Founders',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    },
    Food: {
      sampleCreator: 'Indiranagar Cafe Chronicles',
      handle: 'indiranagar_eats',
      followers: '310K',
      er: '5.1%',
      reelRate: '₹35,000 – ₹48,000',
      storyRate: '₹12,000 – ₹16,000',
      authenticity: 95,
      topDemographic: '81% Young Tech Workforce',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    },
    Fashion: {
      sampleCreator: 'Silicon Valley Chic',
      handle: 'bengaluru_minimal_style',
      followers: '280K',
      er: '4.7%',
      reelRate: '₹32,000 – ₹44,000',
      storyRate: '₹11,000 – ₹15,000',
      authenticity: 96,
      topDemographic: '69% D2C Sustainable Lifestyle Enthusiasts',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    },
    Finance: {
      sampleCreator: 'FinTech Startup Sensei',
      handle: 'fintech_bengaluru',
      followers: '340K',
      er: '5.3%',
      reelRate: '₹95,000 – ₹1,30,000',
      storyRate: '₹32,000 – ₹45,000',
      authenticity: 98,
      topDemographic: '86% Angel Investors & Tech Leaders',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  },
  Delhi: {
    Tech: {
      sampleCreator: 'Nehru Place Tech Audits',
      handle: 'delhitech_hub',
      followers: '610K',
      er: '5.1%',
      reelRate: '₹60,000 – ₹80,000',
      storyRate: '₹20,000 – ₹27,000',
      authenticity: 97,
      topDemographic: '79% North India Tech Buyers (18-28)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    Food: {
      sampleCreator: 'Purani Dilli Flavors',
      handle: 'delhichatori_official',
      followers: '780K',
      er: '6.4%',
      reelRate: '₹68,000 – ₹90,000',
      storyRate: '₹22,000 – ₹30,000',
      authenticity: 98,
      topDemographic: '83% NCR Regional Foodies',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    },
    Fashion: {
      sampleCreator: 'Hauz Khas Aesthetic',
      handle: 'delhi_haute_couture',
      followers: '920K',
      er: '4.8%',
      reelRate: '₹95,000 – ₹1,30,000',
      storyRate: '₹32,000 – ₹45,000',
      authenticity: 96,
      topDemographic: '74% Luxury Wedding & Ethnic Shoppers',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    Finance: {
      sampleCreator: 'North Capital Wealth Advisory',
      handle: 'delhi_tax_invest',
      followers: '410K',
      er: '4.7%',
      reelRate: '₹1,05,000 – ₹1,45,000',
      storyRate: '₹35,000 – ₹48,000',
      authenticity: 98,
      topDemographic: '82% Business Owners & High Earners',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    },
  },
  Jaipur: {
    Tech: {
      sampleCreator: 'Rajasthan Digital Geek',
      handle: 'rajasthan_techie',
      followers: '135K',
      er: '5.4%',
      reelRate: '₹15,000 – ₹20,000',
      storyRate: '₹5,000 – ₹7,000',
      authenticity: 96,
      topDemographic: '77% Jaipur, Kota, Jodhpur',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    },
    Food: {
      sampleCreator: 'Pink City Royal Bites',
      handle: 'jaipur_food_darbar',
      followers: '290K',
      er: '6.2%',
      reelRate: '₹22,000 – ₹30,000',
      storyRate: '₹7,500 – ₹10,500',
      authenticity: 97,
      topDemographic: '80% Heritage Food & Travel Tourists',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    },
    Fashion: {
      sampleCreator: 'Jaipur Block Print & Heritage',
      handle: 'pinkcity_couture',
      followers: '360K',
      er: '5.9%',
      reelRate: '₹34,000 – ₹46,000',
      storyRate: '₹12,000 – ₹16,000',
      authenticity: 98,
      topDemographic: '78% Global Handloom & Ethnic Wear Buyers',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    },
    Finance: {
      sampleCreator: 'Marwadi Business Wisdom',
      handle: 'marwadi_investor_club',
      followers: '220K',
      er: '5.7%',
      reelRate: '₹45,000 – ₹62,000',
      storyRate: '₹16,000 – ₹22,000',
      authenticity: 99,
      topDemographic: '89% Traditional Trading Communities & MSMEs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  },
};

export function HeroInteractiveSandbox() {
  const [activeTab, setActiveTab] = useState<'cityNiche' | 'pitch' | 'kanban'>('cityNiche');

  // Tab 1 (City & Niche State)
  const [selectedCity, setSelectedCity] = useState<'Indore' | 'Mumbai' | 'Bangalore' | 'Delhi' | 'Jaipur'>('Indore');
  const [selectedNiche, setSelectedNiche] = useState<'Tech' | 'Food' | 'Fashion' | 'Finance'>('Food');

  // Tab 2 (Pitch State)
  const [pitchCreators, setPitchCreators] = useState<SandboxCreator[]>(INITIAL_PITCH_CREATORS);

  // Tab 3 (Kanban State)
  const [kanbanItems, setKanbanItems] = useState<KanbanCardItem[]>(INITIAL_KANBAN_ITEMS);

  const handleToggleStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    setPitchCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    toast.success(
      newStatus === 'APPROVED'
        ? 'Creator Approved! Spend tally updated in real-time.'
        : newStatus === 'REJECTED'
        ? 'Creator Declined.'
        : 'Status reset to Pending.'
    );
  };

  const handleAdvanceKanban = (id: string) => {
    const stageFlow: KanbanCardItem['stage'][] = [
      'SHORTLISTED',
      'OUTREACH',
      'COMMERCIALS',
      'DRAFT',
      'LIVE',
    ];
    setKanbanItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const currentIdx = stageFlow.indexOf(item.stage);
        const nextStage = stageFlow[(currentIdx + 1) % stageFlow.length];
        return { ...item, stage: nextStage };
      })
    );
    toast.success('Deliverable advanced to next workflow stage!');
  };

  const approvedCreators = pitchCreators.filter((c) => c.status === 'APPROVED');
  const approvedBudget = approvedCreators.reduce((sum, c) => sum + c.assignedFeeINR, 0);
  const totalBudget = pitchCreators.reduce((sum, c) => sum + c.assignedFeeINR, 0);

  // Active City + Category Data
  const currentCityCategoryData =
    CITY_CATEGORY_MATRIX[selectedCity]?.[selectedNiche] ||
    CITY_CATEGORY_MATRIX['Indore']['Food'];

  return (
    <div className="mx-auto max-w-5xl w-full">
      {/* Outer Sleek Container (Stripe / Linear Standard) */}
      <div className="relative rounded-2xl border border-white/[0.08] bg-[#0E1014]/90 p-1 sm:p-2 shadow-[0_12px_45px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Top Control Bar with Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 bg-[#08090B]/60 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-black/50 border border-white/[0.08] px-2.5 py-1 text-[11px] font-mono text-zinc-300">
              <span className="text-emerald-400">creatorbase.in</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">
                {activeTab === 'cityNiche'
                  ? `explore/${selectedCity.toLowerCase()}/${selectedNiche.toLowerCase()}`
                  : activeTab === 'pitch'
                  ? 'pitch/mamaearth-festive'
                  : 'campaigns/deliverables-tracker'}
              </span>
            </div>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-black/60 p-1 border border-white/[0.08] self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab('cityNiche')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'cityNiche'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>City &amp; Category Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'pitch'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>1-Click Pitch Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'kanban'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Deliverables Kanban</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            TAB 1: LIVE INTERACTIVE CITY & CATEGORY SANDBOX (Pillar 2B)
        ==================================================================== */}
        {activeTab === 'cityNiche' && (
          <div className="p-4 sm:p-6 space-y-6 bg-[#08090B]">
            {/* City Selector Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                1. Select Target Commercial Hub:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {(['Indore', 'Mumbai', 'Bangalore', 'Delhi', 'Jaipur'] as const).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                      selectedCity === city
                        ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-[#12141A] text-zinc-300 border border-white/[0.08] hover:border-emerald-500/40 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{city}</span>
                    {city === 'Indore' && (
                      <span className="text-[9px] uppercase tracking-tight px-1 rounded bg-black/30 text-zinc-900">
                        Tier-2 Hub
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                2. Select Campaign Category:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {(['Tech', 'Food', 'Fashion', 'Finance'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedNiche(cat)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                      selectedNiche === cat
                        ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/25'
                        : 'bg-[#12141A] text-zinc-300 border border-white/[0.08] hover:border-indigo-500/40 hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat === 'Finance' && (
                      <span className="text-[9px] uppercase px-1 rounded bg-black/40 text-emerald-400">
                        2.4x Multiplier
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Modeled Talent & Rate-Card Gauge Box */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#12141A]/70 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/[0.1] shrink-0">
                    <Image
                      src={currentCityCategoryData.avatar}
                      alt={currentCityCategoryData.sampleCreator}
                      width={48}
                      height={48}
                      className="object-cover h-full w-full"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">
                        {currentCityCategoryData.sampleCreator}
                      </h4>
                      <span className="inline-flex items-center text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400">
                      @{currentCityCategoryData.handle} • {selectedCity} • {selectedNiche}
                    </p>
                  </div>
                </div>

                {/* Authenticity Score Gauge */}
                <div className="flex items-center gap-3 bg-black/40 rounded-xl p-2.5 px-4 border border-white/[0.06] self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                      Authenticity Score
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {currentCityCategoryData.authenticity}/100
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-full border-2 border-emerald-500/80 flex items-center justify-center font-mono text-xs font-bold text-white bg-emerald-950/30">
                    {currentCityCategoryData.authenticity}
                  </div>
                </div>
              </div>

              {/* Real-time Pricing Models & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3 text-center">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Verified Followers
                  </span>
                  <span className="text-base font-bold font-mono text-white mt-0.5 block">
                    {currentCityCategoryData.followers}
                  </span>
                </div>

                <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3 text-center">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Engagement Rate
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
                    {currentCityCategoryData.er}
                  </span>
                </div>

                <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/40 p-3 text-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-300 block">
                    Est. 1x Dedicated Reel
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
                    {currentCityCategoryData.reelRate}
                  </span>
                </div>

                <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3 text-center">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                    Est. 1x Story + Link
                  </span>
                  <span className="text-base font-bold font-mono text-zinc-200 mt-0.5 block">
                    {currentCityCategoryData.storyRate}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-zinc-400 gap-2">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Audience Anchor: <strong className="text-zinc-200">{currentCityCategoryData.topDemographic}</strong>
                </span>
                <span className="text-emerald-400/90 text-[11px]">
                  Estimated industry benchmark based on tier &amp; category engagement sampling.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: LIVE CLIENT PITCH PORTAL SANDBOX
        ==================================================================== */}
        {activeTab === 'pitch' && (
          <div className="p-4 sm:p-6 space-y-5 bg-[#08090B]">
            {/* White-Label Branding Top Banner */}
            <div className="rounded-xl bg-[#12141A]/70 border border-white/[0.08] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-xl">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  White-Label Client Presentation
                </span>
                <h3 className="text-lg font-bold text-white font-sans mt-1.5">
                  Diwali Mega D2C Launch • Creator Roster
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  Prepared for <strong className="text-white">Mamaearth Brand Team</strong> by <strong className="text-emerald-400">Elevation Media (Mumbai)</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-400 bg-black/40 border border-white/[0.08] px-2.5 py-1 rounded-lg">
                  Password-Free Link 🔓
                </span>
                <button
                  onClick={() => toast.success('Client Pitch Deck link copied! Ready to WhatsApp or Email to brand client.')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 px-2.5 py-1 text-xs font-mono border border-white/[0.1] transition-colors"
                >
                  <Copy className="w-3 h-3 text-emerald-400" />
                  <span>Copy Client Link</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Creator Cards in Pitch Portal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {pitchCreators.map((creator) => {
                const isApproved = creator.status === 'APPROVED';
                const isRejected = creator.status === 'REJECTED';

                return (
                  <div
                    key={creator.id}
                    className={`rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between backdrop-blur-xl ${
                      isApproved
                        ? 'bg-emerald-950/20 border-emerald-500/70 shadow-lg shadow-emerald-950/30'
                        : isRejected
                        ? 'bg-rose-950/20 border-rose-500/50 opacity-70'
                        : 'bg-[#12141A]/70 border-white/[0.08] hover:border-emerald-500/40'
                    }`}
                  >
                    <div>
                      {/* Top Status */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved ✅</span>
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3" />
                            <span>Declined ❌</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-black/40 border border-white/[0.06] px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>Review Pending</span>
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{creator.authenticityScore}% Authentic</span>
                        </span>
                      </div>

                      {/* Creator Profile */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-white/[0.1] shrink-0">
                          <Image
                            src={creator.avatar}
                            alt={creator.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-white truncate">
                            {creator.name}
                          </h4>
                          <p className="text-xs font-mono text-zinc-400 truncate">
                            @{creator.handle} • {creator.city}
                          </p>
                        </div>
                      </div>

                      {/* Key Stats Bar */}
                      <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-black/50 p-2 border border-white/[0.06] text-center text-[11px] font-mono">
                        <div>
                          <span className="text-zinc-500 block text-[9px] uppercase">Followers</span>
                          <span className="font-bold text-white">{creator.followers}</span>
                        </div>
                        <div className="border-x border-white/[0.06]">
                          <span className="text-zinc-500 block text-[9px] uppercase">Eng. Rate</span>
                          <span className="font-bold text-emerald-400">{creator.er}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[9px] uppercase">Payout</span>
                          <span className="font-bold text-zinc-200">{formatINR(creator.assignedFeeINR)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Approve / Reject Client Buttons */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(creator.id, 'APPROVED')}
                        className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-mono font-bold transition-all ${
                          isApproved
                            ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30'
                            : 'bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve ✅</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(creator.id, 'REJECTED')}
                        className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-mono font-bold transition-all ${
                          isRejected
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                            : 'bg-rose-950/30 hover:bg-rose-950/50 text-rose-400 border border-rose-800/30'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline ❌</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Real-time Sticky Client Approval Tally */}
            <div className="rounded-xl bg-black/60 border border-white/[0.08] p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-300">
                  Client Decisions: <strong className="text-white">{approvedCreators.length} of {pitchCreators.length} Approved</strong>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300">
                  Approved Budget Tally: <strong className="text-emerald-400 font-bold">{formatINR(approvedBudget)}</strong> (of {formatINR(totalBudget)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/pitch/sample-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <span>Open Full Demo Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: KANBAN DELIVERABLES WORKFLOW SANDBOX
        ==================================================================== */}
        {activeTab === 'kanban' && (
          <div className="p-4 sm:p-6 space-y-4 bg-[#08090B]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                  <Kanban className="w-4 h-4 text-emerald-400" />
                  <span>Campaign Deliverables Pipeline (5-Stage Visual Workflow)</span>
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  Click &apos;Next Stage&apos; on any talent to simulate tracking live Reel links and commercial payouts.
                </p>
              </div>
            </div>

            {/* 5-Column Kanban Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {(
                [
                  { key: 'SHORTLISTED', title: 'Shortlisted', color: 'border-zinc-800' },
                  { key: 'OUTREACH', title: 'Outreach Sent', color: 'border-indigo-900/40' },
                  { key: 'COMMERCIALS', title: 'Commercials Agreed', color: 'border-amber-900/40' },
                  { key: 'DRAFT', title: 'Draft In Review', color: 'border-purple-900/40' },
                  { key: 'LIVE', title: 'Live & Paid', color: 'border-emerald-500/50' },
                ] as const
              ).map((col) => {
                const itemsInCol = kanbanItems.filter((i) => i.stage === col.key);

                return (
                  <div
                    key={col.key}
                    className="rounded-xl bg-[#12141A]/70 border border-white/[0.08] p-2.5 flex flex-col min-h-[190px] backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-zinc-300">
                        {col.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-zinc-400">
                        {itemsInCol.length}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      {itemsInCol.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg bg-black/50 border border-white/[0.06] p-2 space-y-1.5 text-xs font-mono shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-zinc-100 text-xs font-sans truncate">{item.name}</strong>
                            <span className="text-emerald-400 font-bold text-[11px]">{formatINR(item.fee)}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-tight line-clamp-2">
                            {item.notes}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleAdvanceKanban(item.id)}
                            className="w-full inline-flex items-center justify-center gap-1 rounded bg-white/[0.05] hover:bg-emerald-950/40 hover:text-emerald-300 text-[10px] py-1 text-zinc-300 transition-colors"
                          >
                            <span>Next Stage</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
