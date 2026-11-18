'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Essential discovery & client pitch decks for boutique brands & solo talent managers.',
      priceMonthly: 2999,
      priceAnnual: 2399,
      popular: false,
      features: [
        '1,000 Verified Creator Queries / mo',
        '5 Active White-Label Pitch Portals',
        'Verified Direct Collab Business Emails',
        'RFC-4180 CSV Export',
        '18% GST Tax Invoice (SAC 998314)',
        '1 User Account',
      ],
      cta: 'Start 7-Day Free Trial',
      href: '/register?plan=starter',
    },
    {
      id: 'pro',
      name: 'Agency Pro',
      description: 'The complete operating system for high-volume performance marketing agencies.',
      priceMonthly: 7999,
      priceAnnual: 6399,
      popular: true,
      badge: 'MOST POPULAR FOR AGENCIES',
      features: [
        'Unlimited Verified Creator Queries',
        'Unlimited White-Label Pitch Portals',
        'Custom Agency Branding & Domain',
        '5-Stage Deliverables Kanban Tracker',
        'Anti-Fraud Real Human Reach Auditing',
        '5 Team Member Seats Included',
        'Direct Priority WhatsApp Support',
        '18% GST Input Tax Credit (ITC)',
      ],
      cta: 'Launch Agency Pro Free',
      href: '/register?plan=pro',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Dedicated infrastructure, custom Apify scrapers, and holding company workflows.',
      priceMonthly: null,
      priceAnnual: null,
      popular: false,
      features: [
        'Everything in Agency Pro',
        'Dedicated Apify Scraper Cluster',
        'Unlimited Team Seats & Sub-Agencies',
        'Custom API Webhooks & Slack Alerts',
        'Dedicated Campaign Strategist',
        'Custom Vendor Onboarding & Master MSA',
        '99.9% Uptime SLA Guarantee',
      ],
      cta: 'Talk to Enterprise Lead',
      href: '/contact?tier=enterprise',
    },
  ];

  return (
    <section id="pricing" className="relative mx-auto max-w-7xl w-full px-4 py-20 sm:py-28 lg:py-36 sm:px-6 lg:px-8 border-t border-white/[0.06]">
      {/* Background Spotlight */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_70%)] blur-[100px]" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">
          <Zap className="h-3.5 w-3.5" />
          <span>TRANSPARENT INR PRICING</span>
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white font-sans leading-[1.08] mb-4">
          Fair, Predictable Pricing in Rupees.
          <br />
          <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
            Zero Hidden Seat Penalties.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
          Save ₹30,000+/mo compared to global tools. All plans include 100% compliant GST input tax credit invoices.
        </p>

        {/* Monthly / Annual Billing Toggle */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0C0E12] p-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-mono transition-all ${
              billingCycle === 'annual'
                ? 'bg-emerald-500 text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[9px] font-bold">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-6xl mx-auto">
        {plans.map((plan) => {
          const price =
            billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <SpotlightCard
              key={plan.id}
              className={`flex flex-col justify-between relative ${
                plan.popular
                  ? 'border-emerald-500/50 bg-[#0C0E12] shadow-[0_0_40px_rgba(16,185,129,0.18),inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                  : ''
              }`}
              spotlightColor={
                plan.popular ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)'
              }
              borderColor={plan.popular ? 'rgba(16, 185, 129, 0.6)' : undefined}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500 px-3 py-0.5 text-[10px] font-mono font-bold tracking-wider text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <Sparkles className="h-3 w-3" />
                    <span>{plan.badge}</span>
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white font-sans">{plan.name}</h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-6 pb-6 border-b border-white/[0.06]">
                  {price ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">/ month</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                        Custom
                      </span>
                      <span className="text-xs font-mono text-zinc-400">/ annual SLA</span>
                    </div>
                  )}

                  <span className="text-[11px] font-mono text-emerald-400 block mt-1">
                    +18% GST • 100% Input Tax Credit
                  </span>
                </div>

                {/* Feature List */}
                <ul className="mt-6 space-y-3 text-xs sm:text-sm text-zinc-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-white/[0.04]">
                <Link
                  href={plan.href}
                  className={`w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-98 ${
                    plan.popular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'border border-white/[0.08] bg-white/[0.05] hover:bg-white/[0.1] text-white'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <p className="mt-2.5 text-center text-[10px] font-mono text-zinc-500">
                  Instant activation • Razorpay PCI-DSS
                </p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
