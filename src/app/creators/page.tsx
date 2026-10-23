import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  TrendingUp,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Indian Influencer Directory — Verified Creators by City & Niche',
  description:
    'Search and audit 1,000+ verified Indian Instagram & YouTube influencers across Indore, Mumbai, Delhi, Bengaluru, Pune, and 10+ niches with genuine engagement rates and rate cards.',
  alternates: {
    canonical: 'https://creatorbase.in/creators',
  },
};

const TOP_CITIES = [
  { key: 'indore', name: 'Indore', state: 'Madhya Pradesh', count: '14+' },
  { key: 'mumbai', name: 'Mumbai', state: 'Maharashtra', count: '180+' },
  { key: 'delhi', name: 'Delhi NCR', state: 'National Capital Region', count: '160+' },
  { key: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', count: '140+' },
  { key: 'pune', name: 'Pune', state: 'Maharashtra', count: '90+' },
  { key: 'jaipur', name: 'Jaipur', state: 'Rajasthan', count: '75+' },
  { key: 'hyderabad', name: 'Hyderabad', state: 'Telangana', count: '85+' },
  { key: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', count: '70+' },
  { key: 'surat', name: 'Surat', state: 'Gujarat', count: '60+' },
  { key: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', count: '45+' },
  { key: 'chandigarh', name: 'Chandigarh', state: 'Punjab & Haryana', count: '55+' },
  { key: 'goa', name: 'Goa', state: 'Goa', count: '35+' },
];

const NICHES = [
  { key: 'food', label: 'Food & Dining', icon: '🍽️', desc: 'Street food curators, gourmet reviewers & cafe vloggers' },
  { key: 'tech', label: 'Tech & Gadgets', icon: '💻', desc: 'Gadget unboxers, AI creators & software developers' },
  { key: 'fashion', label: 'Fashion & Style', icon: '👗', desc: 'Ethnic wear, sustainable style & streetwear influencers' },
  { key: 'travel', label: 'Travel & Tourism', icon: '✈️', desc: 'Backpackers, weekend getaways & luxury travelers' },
  { key: 'fitness', label: 'Fitness & Wellness', icon: '💪', desc: 'Personal trainers, nutritionists & yoga guides' },
  { key: 'finance', label: 'Finance & FinTech', icon: '📈', desc: 'Stock market analysts, investing & tax advisors' },
  { key: 'lifestyle', label: 'Lifestyle & Culture', icon: '✨', desc: 'Everyday aesthetics, home decor & regional culture' },
  { key: 'gaming', label: 'Gaming & Esports', icon: '🎮', desc: 'Streamers, mobile esports & PC enthusiasts' },
  { key: 'comedy', label: 'Comedy & Entertainment', icon: '🎭', desc: 'Sketch creators, standup comics & satire producers' },
  { key: 'beauty', label: 'Beauty & Skincare', icon: '💄', desc: 'Clean makeup, skincare guides & hair tutorials' },
];

export default function CreatorsDirectoryIndex() {
  const breadcrumbItems = [
    { name: 'Home', item: 'https://creatorbase.in' },
    { name: 'Creators Directory', item: 'https://creatorbase.in/creators' },
  ];

  return (
    <div className="relative min-h-screen bg-[#08090B] text-zinc-100 selection:bg-emerald-500 selection:text-white">
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs font-medium text-zinc-400"
        >
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          <span className="text-emerald-400">Creators Directory</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8 sm:p-12 text-center backdrop-blur-md">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            1,000+ Audited Creators Across India
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Verified Indian Influencer Directory
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 leading-relaxed mb-8">
            Browse verified Indian Instagram and YouTube creators categorized by city and content niche.
            Every profile satisfies our 5K+ nano-influencer floor, active engagement gate, and verified commercial delivery.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/register?redirect=/discover"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
            >
              <Search className="h-4 w-4" />
              <span>Launch Live Discovery Engine</span>
            </Link>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-400" />
                Browse by Indian City
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Explore local creators in Tier 1 and high-growth Tier 2 markets
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOP_CITIES.map((c) => (
              <Link
                key={c.key}
                href={`/creators/${c.key}`}
                className="group flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all hover:border-emerald-500/40 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/30"
              >
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-zinc-400">{c.state}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-400">
                    {c.count}
                  </span>
                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Niches Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Browse by Content Niche
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Find creators specialized in your target industry
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {NICHES.map((n) => (
              <Link
                key={n.key}
                href={`/creators/indore/${n.key}`}
                className="group flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all hover:border-emerald-500/40 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/30"
              >
                <div>
                  <div className="text-2xl mb-2">{n.icon}</div>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                    {n.label}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{n.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore creators</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
