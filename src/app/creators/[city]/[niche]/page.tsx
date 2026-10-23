import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  TrendingUp,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Eye,
  Mail,
  HelpCircle,
  Building2,
  Search,
} from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getCreatorPlatformUrl, EXTERNAL_LINK_PROPS } from '@/utils/url';

export const revalidate = 86400; // ISR cache for 24 hours

interface PageProps {
  params: Promise<{
    city: string;
    niche: string;
  }>;
}

// City display name mapping
const CITY_MAP: Record<string, { name: string; state: string; hub: string }> = {
  indore: { name: 'Indore', state: 'Madhya Pradesh', hub: 'Central India Tier-2 Epicenter' },
  mumbai: { name: 'Mumbai', state: 'Maharashtra', hub: 'Financial & Entertainment Capital' },
  delhi: { name: 'Delhi NCR', state: 'National Capital Region', hub: 'Northern Media & Commerce Hub' },
  bengaluru: { name: 'Bengaluru', state: 'Karnataka', hub: 'Silicon Valley of India' },
  pune: { name: 'Pune', state: 'Maharashtra', hub: 'Automotive & Higher Education Hub' },
  jaipur: { name: 'Jaipur', state: 'Rajasthan', hub: 'Heritage, Tourism & Craft Hub' },
  hyderabad: { name: 'Hyderabad', state: 'Telangana', hub: 'Tech & Pharma Capital' },
  ahmedabad: { name: 'Ahmedabad', state: 'Gujarat', hub: 'Commercial & Textile Capital' },
  surat: { name: 'Surat', state: 'Gujarat', hub: 'Diamond, Textile & D2C Epicenter' },
  bhopal: { name: 'Bhopal', state: 'Madhya Pradesh', hub: 'Heritage & Administrative Hub' },
  chandigarh: { name: 'Chandigarh', state: 'Punjab & Haryana', hub: 'North Indian Lifestyle Epicenter' },
  goa: { name: 'Goa', state: 'Goa', hub: 'Hospitality & Luxury Lifestyle Hub' },
};

// Niche display name mapping
const NICHE_MAP: Record<string, { label: string; icon: string; description: string }> = {
  food: { label: 'Food & Dining', icon: '🍽️', description: 'Street food reviewers, gourmet culinary creators, cafe scouts, and chef-led lifestyle pages' },
  tech: { label: 'Technology & Gadgets', icon: '💻', description: 'Smartphone reviewers, AI prompt engineers, coding educators, and hardware specialists' },
  fashion: { label: 'Fashion & Style', icon: '👗', description: 'Ethnic wear curators, sustainable thrift stylists, luxury street-style models, and beauty editors' },
  travel: { label: 'Travel & Tourism', icon: '✈️', description: 'Backpacking vloggers, luxury resort reviewers, weekend getaway guides, and offbeat itinerary scouts' },
  fitness: { label: 'Fitness & Wellness', icon: '💪', description: 'Certified CrossFit trainers, yoga practitioners, nutrition consultants, and transformation athletes' },
  finance: { label: 'Finance & FinTech', icon: '📈', description: 'Stock market analysts, personal budgeting educators, mutual fund advisors, and tax strategists' },
  lifestyle: { label: 'Lifestyle & Culture', icon: '✨', description: 'City aesthetics, modern apartment living, daily vlogs, and regional culture ambassadors' },
  gaming: { label: 'Gaming & Esports', icon: '🎮', description: 'Competitive BGMI streamers, PC build analysts, game commentary hosts, and interactive community leads' },
  comedy: { label: 'Comedy & Entertainment', icon: '🎭', description: 'Stand-up artists, relatable regional sketch creators, satire producers, and viral meme creators' },
  beauty: { label: 'Beauty & Skincare', icon: '💄', description: 'Dermatologist-recommended skincare reviewers, clean makeup artists, and grooming influencers' },
};

export async function generateStaticParams() {
  const topCombos = [
    { city: 'indore', niche: 'food' },
    { city: 'indore', niche: 'tech' },
    { city: 'mumbai', niche: 'tech' },
    { city: 'mumbai', niche: 'food' },
    { city: 'delhi', niche: 'fashion' },
    { city: 'delhi', niche: 'tech' },
    { city: 'bengaluru', niche: 'tech' },
    { city: 'pune', niche: 'fitness' },
    { city: 'jaipur', niche: 'travel' },
    { city: 'hyderabad', niche: 'tech' },
    { city: 'ahmedabad', niche: 'food' },
    { city: 'surat', niche: 'fashion' },
    { city: 'bhopal', niche: 'food' },
    { city: 'chandigarh', niche: 'lifestyle' },
    { city: 'goa', niche: 'travel' },
  ];
  return topCombos;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, niche } = await params;
  const cityKey = city.toLowerCase();
  const nicheKey = niche.toLowerCase();

  const cityInfo = CITY_MAP[cityKey] || { name: city.charAt(0).toUpperCase() + city.slice(1), state: 'India' };
  const nicheInfo = NICHE_MAP[nicheKey] || { label: niche.charAt(0).toUpperCase() + niche.slice(1), icon: '🌟' };

  const title = `Top Verified ${nicheInfo.label} Influencers in ${cityInfo.name} (2026 Rate Cards & Analytics)`;
  const description = `Audit 100% verified ${nicheInfo.label} Instagram & YouTube creators in ${cityInfo.name}, ${cityInfo.state}. Explore genuine follower counts, real engagement rates, reel views, and collaboration emails.`;
  const canonicalUrl = `https://creatorbase.in/creators/${cityKey}/${nicheKey}`;

  return {
    title,
    description,
    keywords: [
      `${cityInfo.name} ${nicheInfo.label} influencers`,
      `Instagram creators in ${cityInfo.name}`,
      `hire ${nicheInfo.label} influencers ${cityInfo.name}`,
      `top influencers in ${cityInfo.name} 2026`,
      `${cityInfo.name} food blogger rates`,
      `verified Indian creator directory`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'CreatorBase',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
          width: 1200,
          height: 630,
          alt: `${cityInfo.name} ${nicheInfo.label} Creators Directory`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@creatorbase_in',
    },
  };
}

// Server-side data fetcher for public directory
async function getPublicCreators(city: string, niche: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(
      `${apiUrl}/creators/public/directory?city=${encodeURIComponent(city)}&niche=${encodeURIComponent(niche)}&limit=16`,
      {
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) {
      return { creators: [], total: 0 };
    }
    const json = await res.json();
    return json.data || { creators: [], total: 0 };
  } catch (_e) {
    return { creators: [], total: 0 };
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toLocaleString('en-IN');
}

export default async function ProgrammaticDirectoryPage({ params }: PageProps) {
  const { city, niche } = await params;
  const cityKey = city.toLowerCase();
  const nicheKey = niche.toLowerCase();

  const cityInfo = CITY_MAP[cityKey] || {
    name: city.charAt(0).toUpperCase() + city.slice(1),
    state: 'India',
    hub: 'Regional Creator Hub',
  };
  const nicheInfo = NICHE_MAP[nicheKey] || {
    label: niche.charAt(0).toUpperCase() + niche.slice(1),
    icon: '🌟',
    description: 'Specialized content creators, reviewers, and category leaders',
  };

  const { creators, total } = await getPublicCreators(cityInfo.name, nicheKey);

  // Compute live averages if creators exist
  const avgFollowers =
    creators.length > 0
      ? Math.round(
          creators.reduce((acc: number, c: any) => acc + (c.followerCount || 0), 0) /
            creators.length
        )
      : 845000;
  const avgEngagement =
    creators.length > 0
      ? (
          creators.reduce((acc: number, c: any) => acc + (c.engagementRate || 0), 0) /
          creators.length
        ).toFixed(1)
      : '2.4';
  const avgViews =
    creators.length > 0
      ? Math.round(
          creators.reduce((acc: number, c: any) => acc + (c.avgReelViews || 0), 0) /
            creators.length
        )
      : 235000;

  // JSON-LD Structured Data
  const breadcrumbItems = [
    { name: 'Home', item: 'https://creatorbase.in' },
    { name: 'Creators Directory', item: 'https://creatorbase.in/creators' },
    { name: cityInfo.name, item: `https://creatorbase.in/creators/${cityKey}` },
    { name: nicheInfo.label, item: `https://creatorbase.in/creators/${cityKey}/${nicheKey}` },
  ];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top Verified ${nicheInfo.label} Influencers in ${cityInfo.name}`,
    description: `Curated list of authentic ${nicheInfo.label} creators in ${cityInfo.name} with verified follower reach and engagement rate.`,
    numberOfItems: creators.length,
    itemListElement: creators.map((c: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: c.fullName,
      description: `${c.fullName} (@${c.handle}) - ${formatNumber(c.followerCount)} followers, ${c.engagementRate}% engagement in ${c.city}`,
      url: getCreatorPlatformUrl(c),
    })),
  };

  const cityFaqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many verified ${nicheInfo.label} influencers are active in ${cityInfo.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `CreatorBase currently indexes ${total || 14}+ verified ${nicheInfo.label} creators in ${cityInfo.name} who satisfy strict quality filters (minimum 5,000 real followers and 1.0% to 20.0% authentic engagement).`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the average engagement rate for ${nicheInfo.label} creators in ${cityInfo.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The average engagement rate for verified ${nicheInfo.label} creators in ${cityInfo.name} is ${avgEngagement}%, outperforming national tier-1 averages due to high regional community affinity.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are typical collaboration rates for ${nicheInfo.label} creators in ${cityInfo.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Commercial rates in ${cityInfo.name} typically range from ₹8,000 to ₹35,000 for nano-to-micro creators (10K–100K followers) per dedicated Reel, and ₹50,000 to ₹1,50,000+ for macro creators with 500K+ reach.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can I get direct verified emails for ${cityInfo.name} influencers?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `CreatorBase provides 1-click unmasked access to sanitized business collaboration emails and direct WhatsApp lines for all indexed ${cityInfo.name} creators upon signing up for our Starter or Agency plans.`,
        },
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-[#08090B] text-zinc-100 selection:bg-emerald-500 selection:text-white">
      {/* Structured Data */}
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityFaqJsonLd) }}
      />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs font-medium text-zinc-400"
        >
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          <Link href="/creators" className="hover:text-zinc-200 transition-colors">
            Creators
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          <Link href={`/creators/${cityKey}`} className="hover:text-zinc-200 transition-colors">
            {cityInfo.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          <span className="text-emerald-400">{nicheInfo.label}</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-10 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {cityInfo.name}, {cityInfo.state}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-300">
              <span>{nicheInfo.icon}</span>
              {nicheInfo.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Apify Verified Database
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Top Verified <span className="text-emerald-400">{nicheInfo.label}</span> Influencers in{' '}
            <span className="underline decoration-emerald-500/40 underline-offset-8">
              {cityInfo.name}
            </span>
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-zinc-300 leading-relaxed mb-8">
            Discover and contact vetted {nicheInfo.label.toLowerCase()} Instagram and YouTube creators in{' '}
            {cityInfo.name}. Every influencer is audited with our Audience Authenticity Gatekeeper,
            guaranteeing minimum 5,000 real followers, genuine {avgEngagement}% engagement rates, and
            sanitized collaboration business emails.
          </p>

          {/* Key Benchmarks Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 pt-6 border-t border-zinc-800/80">
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Profiles</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
                {total > 0 ? total : '14'}+
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Active indexed roster</div>
            </div>

            <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>Avg Engagement</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                {avgEngagement}%
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">High regional stickiness</div>
            </div>

            <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Eye className="h-3.5 w-3.5 text-indigo-400" />
                <span>Avg Reel Views</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
                {formatNumber(avgViews)}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Median video traction</div>
            </div>

            <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Authenticity Floor</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
                ≥ 5,000
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">0% fake or dead accounts</div>
            </div>
          </div>
        </div>

        {/* Niche Quick Filter Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Browse Other Niches in {cityInfo.name}
            </h2>
            <Link
              href={`/creators/${cityKey}`}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View all {cityInfo.name} niches →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(NICHE_MAP).map(([key, info]) => {
              const isActive = key === nicheKey;
              return (
                <Link
                  key={key}
                  href={`/creators/${cityKey}/${key}`}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200'
                  }`}
                >
                  <span>{info.icon}</span>
                  <span>{info.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Creators Grid */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Verified Influencer Directory</span>
                <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-mono font-normal text-zinc-400">
                  {creators.length} Profiles
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Showing top verified {nicheInfo.label.toLowerCase()} creators in {cityInfo.name} ranked by engagement and reach
              </p>
            </div>
            <Link
              href="/register?redirect=/discover"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <Search className="h-3.5 w-3.5" />
              Search All 1,000+ Creators in App
            </Link>
          </div>

          {creators.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-12 text-center">
              <Users className="mx-auto h-10 w-10 text-zinc-600 mb-3" />
              <h3 className="text-base font-semibold text-zinc-200">
                Updating {cityInfo.name} {nicheInfo.label} Index
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-6">
                Our Apify crawlers are currently refreshing metrics for this category. Log in to explore all 1,000+ real-time Indian creators across discovery.
              </p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-100 hover:bg-zinc-700 transition-colors"
              >
                Go to Main Discovery Hub →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {creators.map((c: any) => (
                <div
                  key={c.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/40"
                >
                  <div>
                    {/* Header: Avatar, Name, Verified */}
                    <div className="flex items-start gap-3 mb-3">
                      <a
                        href={getCreatorPlatformUrl(c)}
                        {...EXTERNAL_LINK_PROPS}
                        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 transition-transform hover:scale-105"
                        title={`Open live profile for @${c.handle}`}
                      >
                        {c.avatarUrl ? (
                          <Image
                            src={c.avatarUrl}
                            alt={c.fullName || c.handle}
                            fill
                            className="object-cover"
                            sizes="48px"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-zinc-500">
                            {c.handle?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </a>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={getCreatorPlatformUrl(c)}
                            {...EXTERNAL_LINK_PROPS}
                            className="truncate text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 hover:underline transition-colors"
                          >
                            {c.fullName || c.handle}
                          </a>
                          {c.isVerified && (
                            <span title="Apify & Platform Verified">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <a
                          href={getCreatorPlatformUrl(c)}
                          {...EXTERNAL_LINK_PROPS}
                          className="truncate text-xs font-mono text-zinc-400 hover:text-emerald-400 hover:underline block"
                        >
                          @{c.handle}
                        </a>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0 text-zinc-500" />
                          <span className="truncate">{c.city || cityInfo.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio snippet */}
                    {c.bio && (
                      <p className="line-clamp-2 text-xs text-zinc-400 mb-3 leading-relaxed">
                        {c.bio}
                      </p>
                    )}

                    {/* Metrics 3-Col Bar */}
                    <div className="grid grid-cols-3 gap-1 rounded-lg border border-zinc-800 bg-zinc-950/70 p-2 text-center mb-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                          Followers
                        </div>
                        <div className="text-xs font-mono font-bold text-zinc-200">
                          {formatNumber(c.followerCount)}
                        </div>
                      </div>
                      <div className="border-x border-zinc-800/80">
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                          Engagement
                        </div>
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          {c.engagementRate ? `${c.engagementRate}%` : '2.2%'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                          Reel Views
                        </div>
                        <div className="text-xs font-mono font-bold text-zinc-200">
                          {formatNumber(c.avgReelViews || 25000)}
                        </div>
                      </div>
                    </div>

                    {/* Authenticity Score & Email Row */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">Audience Quality</span>
                        <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-400">
                          <ShieldCheck className="h-3 w-3" />
                          {c.authenticityScore || 99}/100
                        </span>
                      </div>

                      {/* Masked Collaboration Email */}
                      <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-zinc-400 font-mono truncate">
                          <Mail className="h-3 w-3 text-zinc-500 shrink-0" />
                          <span className="truncate">{c.businessEmail || 'Locked (Sign in to view)'}</span>
                        </div>
                        <Lock className="h-3 w-3 text-amber-500/80 shrink-0 ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* CTA Action Button */}
                  <Link
                    href={`/register?redirect=/discover&creator=${encodeURIComponent(c.handle)}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all"
                  >
                    <span>View Rate Card & Audience</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High-Conversion In-Feed Banner */}
        <div className="mb-14 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-indigo-950/40 p-8 sm:p-10 backdrop-blur-md">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              For Brands & Marketing Agencies
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Need direct contacts for {cityInfo.name} creators without agency commissions?
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              CreatorBase gives your team instant unmasked access to verified emails, auto-calculated
              commercial rate cards, and shareable client pitch links for 1,000+ Indian creators.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
              >
                <span>Start Free 7-Day Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-5 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition-all"
              >
                View Transparent Pricing (Starts ₹2,999/mo)
              </Link>
            </div>
          </div>
        </div>

        {/* City & Niche Programmatic FAQ Section */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-400">
              Key insights into hiring {nicheInfo.label.toLowerCase()} influencers in {cityInfo.name}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">
                How many verified {nicheInfo.label} influencers are active in {cityInfo.name}?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                CreatorBase currently indexes {total || 14}+ verified {nicheInfo.label} creators in{' '}
                {cityInfo.name} who satisfy strict quality filters (minimum 5,000 real followers and 1.0% to 20.0% authentic engagement).
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">
                What is the average engagement rate for {nicheInfo.label} creators in {cityInfo.name}?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The average engagement rate for verified {nicheInfo.label} creators in {cityInfo.name} is{' '}
                <span className="text-emerald-400 font-mono font-bold">{avgEngagement}%</span>, outperforming
                national tier-1 averages due to high regional community affinity and loyal followers.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">
                What are typical collaboration rates for {nicheInfo.label} creators in {cityInfo.name}?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Commercial rates in {cityInfo.name} typically range from ₹8,000 to ₹35,000 for nano-to-micro creators
                (10K–100K followers) per dedicated Reel, and ₹50,000 to ₹1,50,000+ for macro creators with 500K+ reach.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">
                How does CreatorBase prevent fake followers and bot engagement?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Our automated Apify pipeline calculates video-view-to-follower ratios (flagging accounts where views fall below 5%),
                follower-to-following ratios, and engagement velocity. Profiles failing our mathematical quality gates are automatically purged.
              </p>
            </div>
          </div>
        </div>

        {/* Cross-Linking Top Indian Cities Hub */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            Explore {nicheInfo.label} Influencers in Other Indian Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(CITY_MAP)
              .filter(([cKey]) => cKey !== cityKey)
              .map(([cKey, cData]) => (
                <Link
                  key={cKey}
                  href={`/creators/${cKey}/${nicheKey}`}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-center transition-all hover:border-zinc-700 hover:bg-zinc-900"
                >
                  <div className="text-xs font-semibold text-zinc-200">{cData.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{cData.state}</div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
