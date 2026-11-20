'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Lock,
  FileCheck,
  CheckCircle2,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceMonthly: number | null;
  priceAnnual: number | null;
  popular: boolean;
  badge?: string;
  features: string[];
  cta: string;
  href: string;
  isExternal?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Boutique Brands & Solo Founders',
    description: 'Essential discovery & verified outreach for fast-moving founders launching high-converting creator campaigns.',
    priceMonthly: 2999,
    priceAnnual: 2399,
    popular: false,
    features: [
      '50 Verified Business Email Unlocks / mo',
      '3 Active Brand Campaigns & Shortlists',
      'Pan-India Search (50+ Cities & 14 Niches)',
      'Audience Authenticity & Fraud Audit',
      'Standard CSV Export & GST Invoice',
    ],
    cta: 'Start 7-Day Free Trial →',
    href: '/register?plan=starter',
  },
  {
    id: 'pro',
    name: 'Agency Pro',
    tagline: 'Hero / Most Popular for Agencies',
    description: 'The end-to-end campaign OS for performance agencies managing multi-creator rosters and live client approvals.',
    priceMonthly: 7999,
    priceAnnual: 6399,
    popular: true,
    badge: '⚡ MOST POPULAR FOR AGENCIES',
    features: [
      'Unlimited Verified Collab Email Unlocks',
      'Unlimited White-Label Client Pitch Portals (/pitch)',
      'Full 5-Stage Deliverables Kanban & Live Reel Tracker',
      'AI Brief Smart Roster Generator',
      'Bulk Outreach CRM Sequences (Automated Follow-ups)',
      '3 Agency Team Seats + Priority WhatsApp Support',
    ],
    cta: 'Launch Agency Pro →',
    href: '/register?plan=pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Suite',
    tagline: 'Large Networks & Holding Companies',
    description: 'Custom infrastructure, bespoke Apify crawlers, dedicated SLAs, and consolidated billing for high-spend networks.',
    priceMonthly: null,
    priceAnnual: null,
    popular: false,
    features: [
      'Custom Domain White-Label Pitch Portals',
      'Dedicated Account Strategist & Custom Scraping',
      'Unlimited Multi-Client Workspaces & Team Seats',
      'UTM & Coupon Code Revenue Attribution',
      'REST API Access & Custom CRM Webhooks',
    ],
    cta: 'Book Enterprise Demo ↗',
    href: '/contact?tier=enterprise',
    isExternal: true,
  },
];

interface FeatureRow {
  name: string;
  starter: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

interface FeatureCategory {
  category: string;
  items: FeatureRow[];
}

const COMPARISON_CATEGORIES: FeatureCategory[] = [
  {
    category: 'Discovery & Telemetry Intelligence',
    items: [
      {
        name: 'Audited Indian Creators Directory',
        starter: '1,000+ Profiles',
        pro: '1,000+ Profiles (Real-Time)',
        enterprise: 'Custom Apify Crawler Clusters',
      },
      {
        name: 'Verified Business Email Unlocks',
        starter: '50 / mo',
        pro: 'Unlimited',
        enterprise: 'Unlimited + Custom Enrichment',
      },
      {
        name: 'Regional Coverage (Tier 1 & Tier 2)',
        starter: '50+ Indian Cities',
        pro: '50+ Indian Cities',
        enterprise: 'Pan-India + Regional South/East',
      },
      {
        name: 'Audience Authenticity & Bot Audit',
        starter: 'Standard Audit',
        pro: 'Deep Fraud & Reach Analysis',
        enterprise: 'Custom Bot Risk Scoring',
      },
      {
        name: 'Live Reel CPM & Commercial Benchmarks',
        starter: 'Basic Benchmarks',
        pro: 'Real-Time Pricing Index',
        enterprise: 'Predictive ROI Modeling',
      },
    ],
  },
  {
    category: 'Client Portals & Campaign Execution',
    items: [
      {
        name: 'No-Login Client Pitch Portals (/pitch)',
        starter: '3 Active Portals',
        pro: 'Unlimited Portals',
        enterprise: 'Custom Domain White-Label',
      },
      {
        name: '1-Click Client Budget Approvals',
        starter: true,
        pro: true,
        enterprise: true,
      },
      {
        name: '5-Stage Deliverables Kanban Tracker',
        starter: false,
        pro: 'Full Interactive Kanban',
        enterprise: 'Multi-Tenant Custom Kanbans',
      },
      {
        name: 'Live Instagram Reel Performance Sync',
        starter: false,
        pro: '24ms Automated Polling',
        enterprise: 'Direct Webhooks & Slack Alerts',
      },
      {
        name: 'AI Brief Smart Roster Generator',
        starter: false,
        pro: true,
        enterprise: 'Custom Trained Matching Model',
      },
    ],
  },
  {
    category: 'Outreach, Automation & Attribution',
    items: [
      {
        name: 'Bulk Outreach CRM Sequences',
        starter: false,
        pro: 'Automated 3-Step Follow-ups',
        enterprise: 'Custom Mailer Pipelines',
      },
      {
        name: 'UTM & Coupon Code Attribution',
        starter: false,
        pro: true,
        enterprise: 'Full Commerce Attribution',
      },
      {
        name: 'RFC-4180 CSV & XLSX Data Export',
        starter: true,
        pro: true,
        enterprise: 'Custom BI Warehouse Sync',
      },
      {
        name: 'REST API & Webhook Integrations',
        starter: false,
        pro: false,
        enterprise: 'Full REST API + Webhooks',
      },
    ],
  },
  {
    category: 'Team Governance, Compliance & Support',
    items: [
      {
        name: 'Included Team Member Seats',
        starter: '1 Solo Seat',
        pro: '3 Agency Seats',
        enterprise: 'Unlimited Seats',
      },
      {
        name: 'Multi-Client Sub-Workspaces',
        starter: '1 Workspace',
        pro: 'Up to 5 Workspaces',
        enterprise: 'Unlimited Multi-Brand Workspaces',
      },
      {
        name: '18% GST Input Tax Credit (SAC 998314)',
        starter: 'Instant Tax Invoice',
        pro: 'Instant Tax Invoice',
        enterprise: 'Consolidated Monthly Master GST',
      },
      {
        name: 'Support SLA & Onboarding',
        starter: 'Standard Email (24h)',
        pro: 'Priority WhatsApp Lead',
        enterprise: 'Dedicated Account Strategist & Phone',
      },
    ],
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section
      id="pricing"
      className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36 border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background Radial Ambient Spotlight */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_70%)] blur-[120px]" />

      {/* 1. Header, Interactive Billing Toggle & ROI Anchor */}
      <div className="mx-auto max-w-3xl text-center mb-14 sm:mb-20">
        {/* Eyebrow Pill */}
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-emerald-400" />
            <span>TRANSPARENT B2B LICENSING • 100% GST ITC COMPLIANT</span>
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white font-sans leading-[1.12] mb-4">
          Invest Less Than One Intern.
          <br />
          <span className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Scale Like a 20-Person Agency.
          </span>
        </h2>

        {/* Subheadline */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Every plan includes verified real-time creator data, live campaign tracking, and instant GST tax invoicing.
        </p>

        {/* Tactile Monthly / Annual Billing Switch with Framer Motion layoutId */}
        <div className="relative inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#0C0E12] p-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`relative z-10 px-4 py-1.5 text-xs font-mono transition-colors rounded-full ${
              billingCycle === 'monthly' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {billingCycle === 'monthly' && (
              <motion.div
                layoutId="billingPill"
                className="absolute inset-0 rounded-full bg-white/[0.12] border border-white/[0.15] shadow-inner"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">Monthly Billing</span>
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono transition-colors ${
              billingCycle === 'annual' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {billingCycle === 'annual' && (
              <motion.div
                layoutId="billingPill"
                className="absolute inset-0 rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">Annual Billing</span>
            <span className="relative z-10 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-black uppercase shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* 2. 3-Tier Luxury Obsidian Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-6xl mx-auto">
        {PLANS.map((plan) => {
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          if (plan.popular) {
            // TIER 2: AGENCY PRO (Hero Spotlight Card)
            return (
              <div
                key={plan.id}
                className="relative flex flex-col justify-between rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-b from-[#111916] via-[#0C0E12] to-[#0C0E12] p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.16),inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(16,185,129,0.25)] hover:border-emerald-400/80"
              >
                {/* Top Floating Pill Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <Sparkles className="h-3 w-3 fill-black text-black" />
                    <span>{plan.badge}</span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white font-sans tracking-tight">
                      {plan.name}
                    </h3>
                    <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
                      HIGH ROAS
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-mono text-emerald-400/90 font-medium">
                    {plan.tagline}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>

                  {/* Price Block */}
                  <div className="mt-6 pb-6 border-b border-white/[0.08]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                        ₹{price?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">/ mo</span>
                    </div>

                    <p className="mt-1.5 text-[11px] font-mono text-zinc-400">
                      {billingCycle === 'annual'
                        ? `Billed annually at ₹${((price || 0) * 12).toLocaleString('en-IN')}/yr`
                        : 'Billed monthly, cancel anytime'}
                    </p>

                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/[0.08] border border-emerald-500/20 px-2.5 py-1 text-[11px] font-mono font-medium text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span>18% GST Input Tax Credit (SAC 998314)</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-3.5 text-xs sm:text-sm text-zinc-200">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                          <Check className="h-3 w-3 stroke-[2.5]" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action */}
                <div className="mt-8 pt-6 border-t border-white/[0.08]">
                  <Link
                    href={plan.href}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-semibold text-black shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] active:scale-[0.98]"
                  >
                    <span>{plan.cta}</span>
                  </Link>

                  <p className="mt-2.5 text-center text-[10px] font-mono text-zinc-400">
                    Instant activation • Unlimited white-label decks
                  </p>
                </div>
              </div>
            );
          }

          // TIER 1 & TIER 3: STARTER & ENTERPRISE
          return (
            <div
              key={plan.id}
              className="relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0C0E12]/90 p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0E1117]"
            >
              <div>
                <h3 className="text-xl font-bold text-white font-sans tracking-tight">
                  {plan.name}
                </h3>
                <p className="mt-1 text-xs font-mono text-zinc-400">
                  {plan.tagline}
                </p>
                <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                {/* Price Block */}
                <div className="mt-6 pb-6 border-b border-white/[0.06]">
                  {price !== null ? (
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">/ mo</span>
                      </div>
                      <p className="mt-1.5 text-[11px] font-mono text-zinc-500">
                        {billingCycle === 'annual'
                          ? `Billed annually at ₹${(price * 12).toLocaleString('en-IN')}/yr`
                          : 'Billed monthly, cancel anytime'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                          Custom
                        </span>
                        <span className="text-xs font-mono text-zinc-400">/ tailored</span>
                      </div>
                      <p className="mt-1.5 text-[11px] font-mono text-emerald-400/90 font-medium">
                        Starting ₹24,999/mo billed annually
                      </p>
                    </div>
                  )}

                  <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" />
                    <span>+18% GST • 100% Input Tax Credit</span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <ul className="mt-6 space-y-3.5 text-xs sm:text-sm text-zinc-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-emerald-400">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Action */}
              <div className="mt-8 pt-6 border-t border-white/[0.04]">
                <Link
                  href={plan.href}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-200 hover:bg-white/[0.12] hover:border-white/[0.16] active:scale-[0.98]"
                >
                  <span>{plan.cta}</span>
                </Link>

                <p className="mt-2.5 text-center text-[10px] font-mono text-zinc-500">
                  {plan.id === 'starter'
                    ? 'No credit card required for preview'
                    : 'Dedicated onboarding & custom SLA'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Trust Strip & Expandable Feature Comparison Matrix */}
      <div className="mx-auto mt-16 max-w-5xl">
        {/* Sleek Trust Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 rounded-2xl border border-white/[0.06] bg-[#0C0E12]/80 px-6 py-4 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>18% GST Input Tax Credit</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Razorpay Secure 256-bit</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Cancel Anytime in 1-Click</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>100% Real Audited Data</span>
          </div>
        </div>

        {/* Collapsible Comparison Trigger */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0C0E12] px-5 py-2.5 text-xs font-mono font-medium text-zinc-300 transition-all hover:border-emerald-500/40 hover:text-white shadow-sm"
          >
            <span>
              {showComparison
                ? 'Hide Enterprise Feature Matrix ▴'
                : 'Compare All 18+ Enterprise Features ▾'}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-emerald-400 transition-transform duration-300 ${
                showComparison ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Expandable Comparison Matrix Table */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mt-8"
            >
              <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12]/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
                {/* Horizontal Scrolling Wrapper for Mobile Screens */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                        <th className="py-4 px-4 sm:px-6 font-mono text-[11px] uppercase tracking-wider text-zinc-400 w-2/5">
                          Capabilities &amp; Deliverables
                        </th>
                        <th className="py-4 px-4 font-mono text-[11px] uppercase tracking-wider text-zinc-300 text-center w-1/5">
                          Starter
                        </th>
                        <th className="py-4 px-4 font-mono text-[11px] uppercase tracking-wider text-emerald-400 text-center bg-emerald-500/[0.06] border-x border-emerald-500/20 w-1/5">
                          Agency Pro
                        </th>
                        <th className="py-4 px-4 font-mono text-[11px] uppercase tracking-wider text-zinc-300 text-center w-1/5">
                          Enterprise
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {COMPARISON_CATEGORIES.map((categoryGroup) => (
                        <React.Fragment key={categoryGroup.category}>
                          {/* Category Header Row */}
                          <tr className="bg-white/[0.01]">
                            <td
                              colSpan={4}
                              className="py-3 px-4 sm:px-6 font-mono text-[11px] uppercase tracking-widest text-emerald-400/90 font-semibold bg-[#11141B]/80"
                            >
                              {categoryGroup.category}
                            </td>
                          </tr>

                          {/* Category Item Rows */}
                          {categoryGroup.items.map((row) => (
                            <tr
                              key={row.name}
                              className="hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="py-3.5 px-4 sm:px-6 font-medium text-zinc-300 text-xs sm:text-sm">
                                {row.name}
                              </td>

                              {/* Starter Value */}
                              <td className="py-3.5 px-4 text-center text-xs font-mono">
                                {typeof row.starter === 'boolean' ? (
                                  row.starter ? (
                                    <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                                  ) : (
                                    <span className="text-zinc-600 font-mono">—</span>
                                  )
                                ) : (
                                  <span className="text-zinc-400">{row.starter}</span>
                                )}
                              </td>

                              {/* Agency Pro Value (Highlighted Column) */}
                              <td className="py-3.5 px-4 text-center text-xs font-mono bg-emerald-500/[0.04] border-x border-emerald-500/20 font-medium">
                                {typeof row.pro === 'boolean' ? (
                                  row.pro ? (
                                    <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                                  ) : (
                                    <span className="text-zinc-600 font-mono">—</span>
                                  )
                                ) : (
                                  <span className="text-emerald-300">{row.pro}</span>
                                )}
                              </td>

                              {/* Enterprise Value */}
                              <td className="py-3.5 px-4 text-center text-xs font-mono">
                                {typeof row.enterprise === 'boolean' ? (
                                  row.enterprise ? (
                                    <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                                  ) : (
                                    <span className="text-zinc-600 font-mono">—</span>
                                  )
                                ) : (
                                  <span className="text-zinc-300">{row.enterprise}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Callout */}
                <div className="border-t border-white/[0.08] bg-white/[0.02] p-4 text-center">
                  <p className="text-xs font-mono text-zinc-400">
                    Need custom API scrapers or dedicated SLA for a 50+ person talent agency?{' '}
                    <Link
                      href="/contact?tier=enterprise"
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      Talk to our enterprise architect →
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
