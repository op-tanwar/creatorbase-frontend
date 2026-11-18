'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import api from '@/lib/api';
import { loadRazorpayScript } from '@/lib/razorpay';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);

  // B2B GST Compliance Inputs
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [gstin, setGstin] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGstin = localStorage.getItem('creatorbase_agency_gstin');
      const savedCompany = localStorage.getItem('creatorbase_agency_company');
      if (savedGstin) {
        setGstin(savedGstin);
      }
      if (savedCompany && !user?.companyName) {
        setCompanyName(savedCompany);
      }
    }
  }, [user]);

  const handlePlanAction = async (plan: any) => {
    if (plan.id === 'enterprise') {
      router.push(plan.ctaHref);
      return;
    }

    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }

    // Persist company and GSTIN
    if (typeof window !== 'undefined') {
      if (companyName.trim()) localStorage.setItem('creatorbase_agency_company', companyName.trim());
      if (gstin.trim()) localStorage.setItem('creatorbase_agency_gstin', gstin.trim().toUpperCase());
    }

    const planCode = plan.id === 'starter' ? 'STARTER' : 'PRO';

    try {
      setIsProcessingPayment(plan.id);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway. Please check your connection.');
        setIsProcessingPayment(null);
        return;
      }

      // 1. Create order on backend with strictly computed amounts
      const res = await api.post('/payments/create-order', {
        plan: planCode,
        billingCycle,
      });

      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || 'Failed to create payment order');
      }

      const orderData = res.data.data;

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CreatorBase 🇮🇳',
        description: `${plan.name} ${billingCycle === 'annual' ? 'Annual' : 'Monthly'} Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#10b981',
          backdrop_color: 'rgba(6, 7, 9, 0.90)',
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planCode,
              billingCycle,
              companyName: companyName.trim() || undefined,
              gstin: gstin.trim().toUpperCase() || undefined,
            });

            if (verifyRes.data.success) {
              dispatch(
                setUser({
                  ...user,
                  planType: planCode,
                  subscriptionStatus: 'ACTIVE',
                  companyName: companyName.trim() || user.companyName,
                })
              );
              toast.success(`🎉 You are now upgraded to ${plan.name}!`);
              router.push('/discover');
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Payment verification error.');
          } finally {
            setIsProcessingPayment(null);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(null);
            toast.info('Payment checkout dismissed');
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function (resp: any) {
        toast.error(`Payment failed: ${resp.error.description}`);
        setIsProcessingPayment(null);
      });
      razorpay.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start checkout');
      setIsProcessingPayment(null);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'Ideal for freelance media planners and boutique agencies executing regional campaigns.',
      priceMonthly: 2999,
      priceAnnual: 2399,
      badge: null,
      highlight: false,
      features: [
        '100 Creator profile audits per month',
        'Tier 1 Pan-India City Coverage (Mumbai, Delhi, BLR)',
        'Verified direct business contact unlocks (100 / mo)',
        'Export to CSV / Excel with UTF-8 BOM',
        'Up to 2 Campaign Shortlist Cohorts',
        'Instant Rate-Card Pricing Benchmarks',
        'Email & Community Support',
      ],
      notIncluded: [
        'Tier 2 & 3 Regional Indian Cities (Indore, Surat, Jaipur)',
        '1-Click Client Pitch Decks (/pitch/[token])',
        'Audience Bot & Authenticity Gatekeeper',
        'Deliverables Kanban Tracker (5 Workflow Stages)',
        'Multi-Seat Team Access',
      ],
      ctaText: 'Start 7-Day Free Trial',
      ctaHref: '/register?plan=starter',
    },
    {
      id: 'agency',
      name: 'Agency Pro',
      tagline: 'Built for high-velocity influencer agencies running multiple brand campaigns simultaneously.',
      priceMonthly: 7999,
      priceAnnual: 6399,
      badge: 'MOST POPULAR • ROI LEADER',
      highlight: true,
      features: [
        'Unlimited contact unlocks & verified business emails',
        'Unlimited Client Pitch Links with Interactive Approval (/pitch/[token])',
        'Deliverables Kanban Tracker (5 Workflow Stages)',
        'Smart Rate-Card Intelligence (Reel/Story dynamic forecasting)',
        'Full Pan-India Tier 1, 2 & 3 City Coverage (Indore, Surat, etc.)',
        'Audience Bot Detection & Authenticity Scoring (90%+ Gatekeeper)',
        'Client-Ready White-Label CSV Exports',
        '18% GST Input Tax Credit (ITC) Invoices (HSN 998314)',
        'Priority Slack & WhatsApp Support',
      ],
      notIncluded: [
        'Dedicated Enterprise Account Strategist',
        'Custom Scraping & REST API Access',
      ],
      ctaText: 'Start Agency Pro Trial',
      ctaHref: '/register?plan=pro',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'For market leaders, corporate FMCG houses, and national talent agencies.',
      priceMonthly: 24999,
      priceAnnual: 19999,
      badge: 'CUSTOM SCALE',
      highlight: false,
      features: [
        'Everything in Agency Pro with Unlimited Scale',
        'Custom REST API access & webhooks',
        'Team multi-seat logins with role permissions',
        'Dedicated account manager & campaign QA',
        'Bespoke creator scraping & custom city ingestion',
        'Campaign escrow & custom contract templates',
        'Custom B2B billing ledger with GST compliance',
        'Quarterly Indian influencer pricing benchmarks',
      ],
      notIncluded: [],
      ctaText: 'Contact Enterprise Sales',
      ctaHref: '/contact?plan=enterprise',
    },
  ];

  const comparisonFeatures = [
    { name: 'Monthly Creator Searches', starter: '100 / mo', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Pan-India Tier 1 Cities (Mumbai, Delhi, BLR)', starter: true, pro: true, enterprise: true },
    { name: 'Tier 2 & 3 Regional Cities (Indore, Jaipur, Surat)', starter: false, pro: true, enterprise: true },
    { name: 'Audience Bot & Authenticity Audit', starter: false, pro: true, enterprise: true },
    { name: 'Gender & Geographic Demographic Breakdown', starter: false, pro: true, enterprise: true },
    { name: 'Campaign Shortlists', starter: '2 Cohorts', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Live Deliverables Budget Estimator', starter: false, pro: true, enterprise: true },
    { name: 'RFC-4180 CSV / Excel Export with UTF-8 BOM', starter: true, pro: true, enterprise: true },
    { name: 'White-Label Export Format', starter: false, pro: true, enterprise: true },
    { name: 'Team Member Seats', starter: '1 Seat', pro: '3 Seats Included', enterprise: 'Custom Unlimited' },
    { name: 'REST API & Webhooks Access', starter: false, pro: false, enterprise: true },
    { name: 'Dedicated Account Manager', starter: false, pro: false, enterprise: true },
    { name: 'Support Channels', starter: 'Email', pro: 'Slack + WhatsApp', enterprise: 'Dedicated 24/7 Phone' },
  ];

  return (
    <div className="relative overflow-x-hidden bg-[#060709] pt-28 pb-16 sm:pt-36 sm:pb-24 text-zinc-100 min-h-screen">
      {/* Background ambient spotlight & dot grid */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-300 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Transparent Indian Rupee (₹) Pricing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans leading-[1.08]">
            Simple, honest plans for every stage of your creator strategy.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
            No expensive USD credit card surprises, no multi-thousand-dollar annual lock-ins.
            Start with our 7-day free trial and cancel whenever you want.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 relative inline-flex items-center rounded-xl border border-white/[0.08] bg-[#0C0E12] p-1 shadow-inner backdrop-blur-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative z-10 rounded-lg px-4 py-2 text-xs sm:text-sm font-mono font-medium transition-colors ${
                billingCycle === 'monthly' ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {billingCycle === 'monthly' && (
                <motion.div
                  layoutId="pricingBillingPill"
                  className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08] shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />
              )}
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`relative z-10 flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-mono font-medium transition-colors ${
                billingCycle === 'annual' ? 'text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {billingCycle === 'annual' && (
                <motion.div
                  layoutId="pricingBillingPill"
                  className="absolute inset-0 rounded-lg bg-emerald-500 shadow-md shadow-emerald-500/25 -z-10"
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />
              )}
              <span>Annual Billing</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                billingCycle === 'annual'
                  ? 'bg-zinc-950 text-emerald-300'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
              }`}>
                SAVE 20%
              </span>
            </button>
          </div>

          {/* B2B Agency GST Compliance Details Ribbon */}
          <div className="mt-8 max-w-xl mx-auto rounded-2xl border border-white/[0.07] bg-[#0C0E12]/90 p-4 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-zinc-200">
                  Indian Agency Billing &amp; GST Details (Optional)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                18% ITC • HSN 998314
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                  Company / Agency Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Elevation Media Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg bg-[#08090C] border border-white/[0.08] px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                  Agency GSTIN (15 Digits)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full rounded-lg bg-[#08090C] border border-white/[0.08] px-3 py-1.5 text-xs font-mono text-emerald-400 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none uppercase"
                />
              </div>
            </div>

            <p className="text-[10px] font-mono text-zinc-500 leading-tight">
              * Official GST Tax Invoices with SAC 998314 are auto-generated and downloadable in your Billing ledger after checkout.
            </p>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all backdrop-blur-xl ${
                  plan.highlight
                    ? 'border-2 border-emerald-500/70 bg-[#0C0E12]/95 shadow-[0_0_35px_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-emerald-500/40 scale-[1.02]'
                    : 'border border-white/[0.07] bg-[#0C0E12]/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-emerald-500/35'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 px-3 py-1 text-[11px] font-mono font-bold text-zinc-950 uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight font-sans">{plan.name}</h3>
                  <p className="mt-2 text-xs text-zinc-400 min-h-[36px] font-sans">{plan.tagline}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-[11px] font-mono text-emerald-400 mt-1">Billed annually (₹{(price * 12).toLocaleString('en-IN')}/yr)</p>
                  )}

                  {/* Feature Checklist */}
                  <div className="mt-8 border-t border-white/[0.06] pt-6">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Included features:
                    </span>
                    <ul className="mt-4 space-y-3 text-xs sm:text-sm text-zinc-300 font-sans">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}

                      {plan.notIncluded.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-zinc-500">
                          <X className="h-4 w-4 text-zinc-600 shrink-0 mt-0.5" />
                          <span className="line-through">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => handlePlanAction(plan)}
                    disabled={
                      isProcessingPayment !== null ||
                      (plan.id === 'agency' && user?.planType === 'PRO') ||
                      (plan.id === 'starter' && user?.planType === 'STARTER')
                    }
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                      plan.highlight
                        ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]'
                        : 'border border-white/[0.08] bg-white/[0.06] text-white hover:bg-white/[0.1]'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isProcessingPayment === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                        <span>Connecting Razorpay...</span>
                      </>
                    ) : (plan.id === 'agency' && user?.planType === 'PRO') ||
                      (plan.id === 'starter' && user?.planType === 'STARTER') ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Current Active Plan</span>
                      </>
                    ) : (
                      <>
                        <span>{isAuthenticated && plan.id !== 'enterprise' ? `Upgrade to ${plan.name}` : plan.ctaText}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Compare plan capabilities side-by-side
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-sans">
              Pick the tier that best matches your team&apos;s campaign scale and deliverables.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0C0E12]/90 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="sticky top-16 z-10 bg-[#08090C] border-b border-white/[0.06] backdrop-blur-md">
                <tr>
                  <th className="p-4 font-semibold text-zinc-300 font-mono">Capability</th>
                  <th className="p-4 font-semibold text-zinc-300 text-center font-mono">Starter</th>
                  <th className="p-4 font-semibold text-emerald-400 text-center font-mono">Agency Pro</th>
                  <th className="p-4 font-semibold text-indigo-400 text-center font-mono">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {comparisonFeatures.map((row) => (
                  <tr key={row.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium text-zinc-200">{row.name}</td>

                    <td className="p-4 text-center text-zinc-400 font-mono">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? (
                          <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span>{row.starter}</span>
                      )}
                    </td>

                    <td className="p-4 text-center font-medium text-emerald-300 bg-emerald-950/15 font-mono">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span>{row.pro}</span>
                      )}
                    </td>

                    <td className="p-4 text-center font-medium text-indigo-300 font-mono">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? (
                          <Check className="h-4 w-4 text-indigo-400 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span>{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 100% Money-Back Guarantee Box */}
        <div className="mt-16 rounded-2xl border border-white/[0.07] bg-[#0C0E12]/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white font-sans">
              100% Risk-Free 14-Day Money-Back Guarantee
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed font-sans">
              If CreatorBase doesn&apos;t save your team at least 10 hours on your first campaign shortlist, reach out to us within 14 days and we&apos;ll refund your subscription in full. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
