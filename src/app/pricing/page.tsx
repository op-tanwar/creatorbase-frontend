'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  HelpCircle,
  Zap,
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
  const [isGstEnabled, setIsGstEnabled] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGstin = localStorage.getItem('creatorbase_agency_gstin');
      const savedCompany = localStorage.getItem('creatorbase_agency_company');
      if (savedGstin) {
        setGstin(savedGstin);
        setIsGstEnabled(true);
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
          backdrop_color: 'rgba(11, 12, 14, 0.85)',
        },
        handler: async (response: any) => {
          try {
            // 3. Cryptographic signature verification
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success(`Payment Successful! Welcome to ${plan.name} 🎉`);
              dispatch(setUser(verifyRes.data.data.user));
              router.push('/discover');
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Payment cryptographic verification failed');
          } finally {
            setIsProcessingPayment(null);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (err: any) {
        toast.error(err.error?.description || 'Payment was unsuccessful');
        setIsProcessingPayment(null);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Payment checkout failed');
      setIsProcessingPayment(null);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'For solo D2C founders. 50 creator contact unlocks, 3 active shortlists, basic CSV export.',
      priceMonthly: 2999,
      priceAnnual: 2399, // ~20% discount
      badge: null,
      highlight: false,
      features: [
        '50 creator contact unlocks / month',
        '3 active campaign shortlists',
        'Basic CSV export with INR pricing',
        'Tier-1 City Filters (Mumbai, Delhi, Bengaluru)',
        'Basic engagement & follower authenticity scores',
        'Standard email support (24h SLA)',
      ],
      notIncluded: [
        'Unlimited Client Pitch Links (/pitch/[token])',
        'Deliverables Kanban Tracker (5 Workflow Stages)',
        'Tier-2 & Tier-3 City Filters (Indore, Surat, Jaipur)',
        'Smart Rate-Card Intelligence (Reel/Story dynamic forecasting)',
        'Team multi-seat logins & role permissions',
      ],
      ctaText: 'Start 7-Day Free Trial',
      ctaHref: '/register?plan=starter',
    },
    {
      id: 'agency',
      name: 'Agency Pro',
      tagline: 'The Operating System for modern Indian influencer agencies managing client campaigns.',
      priceMonthly: 7999,
      priceAnnual: 6399, // ~20% discount
      badge: 'MOST POPULAR',
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
    <div className="relative overflow-x-hidden bg-[#08090B] py-16 sm:py-24 text-zinc-100 min-h-screen">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/10 via-indigo-500/10 to-transparent blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Transparent Indian Rupee (₹) Pricing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            Simple, honest plans for every stage of your creator strategy.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            No expensive USD credit card surprises, no multi-thousand-dollar annual lock-ins.
            Start with our 7-day free trial and cancel whenever you want.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-900/80 p-1 backdrop-blur-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
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
          <div className="mt-8 max-w-xl mx-auto rounded-2xl border border-zinc-800 bg-[#121316] p-4 text-left shadow-lg space-y-3">
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
                  className="w-full rounded-lg bg-[#0B0C0E] border border-zinc-700 px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
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
                  className="w-full rounded-lg bg-[#0B0C0E] border border-zinc-700 px-3 py-1.5 text-xs font-mono text-emerald-400 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none uppercase"
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
                    ? 'border-2 border-emerald-500 bg-[#12141A]/90 shadow-[0_0_35px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/50 scale-[1.02]'
                    : 'border border-white/[0.08] bg-[#12141A]/70 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-emerald-500/30'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600 px-3 py-1 text-[11px] font-bold text-zinc-950 uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                  <p className="mt-2 text-xs text-zinc-400 min-h-[36px]">{plan.tagline}</p>

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
                  <div className="mt-8 border-t border-zinc-800/70 pt-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Included features:
                    </span>
                    <ul className="mt-4 space-y-3 text-xs sm:text-sm text-zinc-300">
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

                <div className="mt-8 pt-6 border-t border-zinc-800/70">
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
                        : 'border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700'
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
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Pick the tier that best matches your team&apos;s campaign scale and deliverables.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-xl border border-[#24272E] bg-[#121316]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="sticky top-16 z-10 bg-[#0B0C0E] border-b border-[#24272E] backdrop-blur-md">
                <tr>
                  <th className="p-4 font-semibold text-zinc-300 font-mono">Capability</th>
                  <th className="p-4 font-semibold text-zinc-300 text-center font-mono">Starter</th>
                  <th className="p-4 font-semibold text-emerald-400 text-center font-mono">Agency Pro</th>
                  <th className="p-4 font-semibold text-indigo-400 text-center font-mono">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {comparisonFeatures.map((row) => (
                  <tr key={row.name} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 font-medium text-zinc-200">{row.name}</td>

                    <td className="p-4 text-center text-zinc-400">
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

                    <td className="p-4 text-center font-medium text-emerald-300 bg-emerald-950/10">
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

                    <td className="p-4 text-center font-medium text-indigo-300">
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
        <div className="mt-16 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white">
              100% Risk-Free 14-Day Money-Back Guarantee
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              If CreatorBase doesn&apos;t save your team at least 10 hours on your first campaign shortlist, reach out to us within 14 days and we&apos;ll refund your subscription in full. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
