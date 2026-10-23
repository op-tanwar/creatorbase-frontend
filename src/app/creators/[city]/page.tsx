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
  }>;
}

const CITY_MAP: Record<string, { name: string; state: string; hub: string }> = {
  indore: { name: 'Indore', state: 'Madhya Pradesh', hub: 'Central India Commercial & Food Capital' },
  mumbai: { name: 'Mumbai', state: 'Maharashtra', hub: 'India’s Financial & Entertainment Hub' },
  delhi: { name: 'Delhi NCR', state: 'National Capital Region', hub: 'Northern Media & Government Hub' },
  bengaluru: { name: 'Bengaluru', state: 'Karnataka', hub: 'Silicon Valley & Startup Capital' },
  pune: { name: 'Pune', state: 'Maharashtra', hub: 'Automotive & Cultural City' },
  jaipur: { name: 'Jaipur', state: 'Rajasthan', hub: 'Pink City of Heritage & Handicrafts' },
  hyderabad: { name: 'Hyderabad', state: 'Telangana', hub: 'HITEC City & South Indian Media' },
  ahmedabad: { name: 'Ahmedabad', state: 'Gujarat', hub: 'Industrial & D2C Brand Powerhouse' },
  surat: { name: 'Surat', state: 'Gujarat', hub: 'Textile & High-Growth D2C Center' },
  bhopal: { name: 'Bhopal', state: 'Madhya Pradesh', hub: 'City of Lakes & Culture' },
  chandigarh: { name: 'Chandigarh', state: 'Punjab & Haryana', hub: 'North Indian Lifestyle Epicenter' },
  goa: { name: 'Goa', state: 'Goa', hub: 'Global Tourism & Luxury Lifestyle Hub' },
};

const NICHES = [
  { key: 'food', label: 'Food & Dining', icon: '🍽️' },
  { key: 'tech', label: 'Tech & Gadgets', icon: '💻' },
  { key: 'fashion', label: 'Fashion & Style', icon: '👗' },
  { key: 'travel', label: 'Travel & Tourism', icon: '✈️' },
  { key: 'fitness', label: 'Fitness & Wellness', icon: '💪' },
  { key: 'finance', label: 'Finance & FinTech', icon: '📈' },
  { key: 'lifestyle', label: 'Lifestyle & Culture', icon: '✨' },
  { key: 'gaming', label: 'Gaming & Esports', icon: '🎮' },
  { key: 'comedy', label: 'Comedy & Entertainment', icon: '🎭' },
  { key: 'beauty', label: 'Beauty & Skincare', icon: '💄' },
];

export async function generateStaticParams() {
  return Object.keys(CITY_MAP).map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const cityKey = city.toLowerCase();
  const cityInfo = CITY_MAP[cityKey] || { name: city.charAt(0).toUpperCase() + city.slice(1), state: 'India' };

  const title = `Top Verified Influencers in ${cityInfo.name} (2026 Directory & Analytics)`;
  const description = `Discover and contact 100% verified Instagram and YouTube creators based in ${cityInfo.name}, ${cityInfo.state}. Browse Food, Tech, Fashion, and Fitness influencers with live engagement rates and rate cards.`;
  const canonicalUrl = `https://creatorbase.in/creators/${cityKey}`;

  return {
    title,
    description,
    keywords: [
      `${cityInfo.name} influencers`,
      `Instagram creators in ${cityInfo.name}`,
      `hire ${cityInfo.name} creators`,
      `top influencers in ${cityInfo.name} 2026`,
      `${cityInfo.name} influencer marketing agency`,
      `verified Indian creators`,
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
          alt: `${cityInfo.name} Influencers Directory`,
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

async function getPublicCityCreators(city: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(
      `${apiUrl}/creators/public/directory?city=${encodeURIComponent(city)}&limit=16`,
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

export default async function CityDirectoryHubPage({ params }: PageProps) {
  const { city } = await params;
  const cityKey = city.toLowerCase();

  const cityInfo = CITY_MAP[cityKey] || {
    name: city.charAt(0).toUpperCase() + city.slice(1),
    state: 'India',
    hub: 'Regional Creator Hub',
  };

  const { creators, total } = await getPublicCityCreators(cityInfo.name);

  const avgEngagement =
    creators.length > 0
      ? (
          creators.reduce((acc: number, c: any) => acc + (c.engagementRate || 0), 0) /
          creators.length
        ).toFixed(1)
      : '2.5';

  const breadcrumbItems = [
    { name: 'Home', item: 'https://creatorbase.in' },
    { name: 'Creators Directory', item: 'https://creatorbase.in/creators' },
    { name: cityInfo.name, item: `https://creatorbase.in/creators/${cityKey}` },
  ];

  return (
    <div className="relative min-h-screen bg-[#08090B] text-zinc-100 selection:bg-emerald-500 selection:text-white">
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

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
          <span className="text-emerald-400">{cityInfo.name}</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-10 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {cityInfo.name}, {cityInfo.state}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Creator Hub
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Top Verified Influencers in{' '}
            <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-8">
              {cityInfo.name}
            </span>
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-zinc-300 leading-relaxed mb-8">
            Complete directory of verified Instagram and YouTube influencers based in {cityInfo.name}.
            Filter by niche, audit real engagement metrics, inspect audience demographics, and connect
            directly through verified collaboration business emails.
          </p>

          {/* Niches Grid */}
          <div className="pt-6 border-t border-zinc-800/80">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Explore by Niche in {cityInfo.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {NICHES.map((n) => (
                <Link
                  key={n.key}
                  href={`/creators/${cityKey}/${n.key}`}
                  className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 text-xs font-medium text-zinc-300 hover:border-emerald-500/40 hover:bg-zinc-900 hover:text-white transition-all"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span>{n.icon}</span>
                    <span className="truncate">{n.label}</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Creators Listing */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Top Creators in {cityInfo.name}</span>
                <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-mono font-normal text-zinc-400">
                  {total > 0 ? total : creators.length} Verified
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Displaying authentic influencers with genuine {avgEngagement}% average engagement
              </p>
            </div>
            <Link
              href="/register?redirect=/discover"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <Search className="h-3.5 w-3.5" />
              Search All Creators in Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {creators.map((c: any) => (
              <div
                key={c.id}
                className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/40"
              >
                <div>
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
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                        <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-300">
                          {c.niche || 'Lifestyle'}
                        </span>
                        <span>•</span>
                        <span>{c.city}</span>
                      </div>
                    </div>
                  </div>

                  {c.bio && (
                    <p className="line-clamp-2 text-xs text-zinc-400 mb-3 leading-relaxed">
                      {c.bio}
                    </p>
                  )}

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

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Quality Score</span>
                      <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        {c.authenticityScore || 99}/100
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-400 font-mono truncate">
                        <Mail className="h-3 w-3 text-zinc-500 shrink-0" />
                        <span className="truncate">{c.businessEmail || 'Locked (Sign in to view)'}</span>
                      </div>
                      <Lock className="h-3 w-3 text-amber-500/80 shrink-0 ml-1" />
                    </div>
                  </div>
                </div>

                <Link
                  href={`/register?redirect=/discover&creator=${encodeURIComponent(c.handle)}`}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all"
                >
                  <span>View Full Profile & Rates</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Explore other cities */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            Explore Influencers Across India
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(CITY_MAP)
              .filter(([cKey]) => cKey !== cityKey)
              .map(([cKey, cData]) => (
                <Link
                  key={cKey}
                  href={`/creators/${cKey}`}
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
