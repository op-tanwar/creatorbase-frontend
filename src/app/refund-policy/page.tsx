import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle, Clock, CreditCard, AlertCircle, Mail, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy | CreatorBase India',
  description: '14-Day Money-Back Guarantee, subscription cancellation, and Razorpay refund timelines for CreatorBase Technologies.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#08090B] text-zinc-300 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Breadcrumb */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs font-mono">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>back_to_home()</span>
          </Link>
          <div className="flex items-center gap-2 text-zinc-500">
            <span>COMPLIANCE_REF:</span>
            <span className="text-zinc-300 font-semibold">REF-IN-2026-V2</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header Block */}
        <div className="space-y-4 border-b border-zinc-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>100% Risk-Free Guarantee &amp; Razorpay Automated Reversal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cancellation &amp; Refund Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <span>Operating Entity: <strong>CreatorBase Technologies</strong></span>
            <span>•</span>
            <span>Currency: <strong>INR (₹)</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>October 15, 2026</strong></span>
          </div>
        </div>

        {/* 14-Day Guarantee Hero Card */}
        <div className="my-8 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm uppercase tracking-wider">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>14-Day No-Questions-Asked Money-Back Guarantee</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            We want you to build high-ROI influencer marketing campaigns with absolute confidence. If you subscribe to our <strong>Starter</strong> or <strong>Agency Pro</strong> plan and find that CreatorBase does not meet your team&apos;s needs, you are entitled to a full 100% refund of your initial subscription fee within <strong>14 calendar days</strong> of your first purchase.
          </p>
        </div>

        {/* Timeline Infographic / Steps */}
        <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 mb-1">
              <Clock className="w-4 h-4" />
              <span>STEP 1: REQUEST</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Email <strong>billing@creatorbase.in</strong> with your registered email and Razorpay Payment ID within 14 days.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>STEP 2: APPROVAL</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our billing desk verifies your transaction and initiates the Razorpay refund within 24 business hours.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 mb-1">
              <CreditCard className="w-4 h-4" />
              <span>STEP 3: REVERSAL</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Funds credit back to your original source (UPI, Credit/Debit card, Netbanking) within 5–7 banking days.
            </p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="space-y-10 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">01.</span> Subscription Cancellation Terms
            </h2>
            <p>
              You have complete freedom to cancel your recurring subscription at any time without penalties:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li><strong>Self-Service Cancellation:</strong> You can cancel your subscription directly from your <strong>Profile &amp; Organization Settings &rarr; Subscription &amp; Invoices</strong> tab by clicking &quot;Cancel Renewal&quot;.</li>
              <li><strong>Support Request:</strong> Alternatively, you can send an email to <strong>billing@creatorbase.in</strong> from your registered account email at least 24 hours prior to the next scheduled renewal date.</li>
              <li><strong>Access Retention:</strong> Upon cancellation, your account will remain fully functional with all active plan privileges until the conclusion of the paid billing period. No future automatic renewal charges will occur.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">02.</span> Refund Eligibility &amp; Criteria
            </h2>
            <div className="space-y-2">
              <p><strong>Eligible for 100% Refund:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
                <li>First-time subscription purchases for Starter or Agency Pro plans requested within 14 calendar days of payment.</li>
                <li>Accidental duplicate charges caused by network drops or multiple button clicks (verified via dual Razorpay Payment IDs).</li>
                <li>Technical billing errors where the user was charged but subscription provisioning failed and could not be resolved by support within 24 hours.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <p><strong>Non-Refundable Situations:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
                <li>Refund requests submitted after 14 calendar days from the initial payment date.</li>
                <li>Subsequent recurring monthly or annual renewal charges (users are responsible for cancelling prior to their renewal date).</li>
                <li>Custom Enterprise contracts, dedicated SLA agreements, or custom manual crawler engineering services.</li>
                <li>Accounts suspended or terminated due to explicit violations of our Terms of Service (e.g. automated scraping or credential reselling).</li>
                <li>Accounts that have exported extensive bulk creator databases (&gt;2,000 creator contacts) during the 14-day trial window.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">03.</span> Banking Protocol &amp; Refund Processing Timelines
            </h2>
            <p>
              Once approved, all refunds are routed directly through Razorpay to the original source payment instrument:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 font-mono text-xs space-y-2.5">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-white">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                <span className="text-emerald-400 font-semibold">24 to 48 Hours</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-white">Net Banking (HDFC, ICICI, SBI, Axis, etc.)</span>
                <span className="text-emerald-400 font-semibold">3 to 5 Business Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white">Credit / Debit Cards (Visa, Mastercard, RuPay)</span>
                <span className="text-emerald-400 font-semibold">5 to 7 Business Days</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              * The exact crediting time depends on your issuing bank&apos;s settlement protocol under RBI clearing cycles. You will receive an automated Razorpay ARN (Acquirer Reference Number) email to track the refund with your bank.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">04.</span> Contact Billing Desk
            </h2>
            <p>
              To initiate a cancellation or submit a refund request, reach out to our dedicated billing team:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs space-y-1.5">
              <p className="text-white font-bold">Billing &amp; Payments Support Desk</p>
              <p className="text-zinc-400">CreatorBase Technologies</p>
              <p className="text-zinc-400">Email: <a href="mailto:billing@creatorbase.in" className="text-emerald-400 underline">billing@creatorbase.in</a></p>
              <p className="text-zinc-400">Escalations: <a href="mailto:support@creatorbase.in" className="text-emerald-400 underline">support@creatorbase.in</a></p>
              <p className="text-zinc-400">Office: Scheme 54, Vijay Nagar, Indore, Madhya Pradesh 452010, India</p>
              <p className="text-zinc-500 pt-1">Response Time: Under 4 business hours (Mon–Sat, 9:30 AM – 7:30 PM IST)</p>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
          <Link href="/terms" className="text-emerald-400 hover:underline">
            &larr; Read Terms of Service
          </Link>
          <Link href="/shipping-policy" className="text-emerald-400 hover:underline">
            Read Delivery &amp; Shipping Policy &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
