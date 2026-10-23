import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Mail, ShieldCheck, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy (SaaS Digital Fulfillment) | CreatorBase India',
  description: 'Digital delivery timeline, electronic account fulfillment, and shipping policy for CreatorBase Technologies.',
};

export default function ShippingPolicyPage() {
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
            <span>FULFILLMENT_REF:</span>
            <span className="text-zinc-300 font-semibold">SHIP-DIGITAL-2026-V2</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header Block */}
        <div className="space-y-4 border-b border-zinc-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Cloud Digital Fulfillment (SaaS)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Shipping &amp; Delivery Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <span>Platform: <strong>CreatorBase (CreatorBase Technologies)</strong></span>
            <span>•</span>
            <span>Service Model: <strong>100% Cloud SaaS Software</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>October 15, 2026</strong></span>
          </div>
        </div>

        {/* Digital Fulfillment Hero Banner */}
        <div className="my-8 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>100% Digital Delivery — Zero Physical Shipping Charges</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            <strong>CreatorBase</strong> is a cloud-hosted Software-as-a-Service (SaaS) digital platform. We do <strong>not</strong> produce, warehouse, pack, or dispatch any physical goods, tangible merchandise, or postal shipments. Consequently, <strong>all shipping and handling fees are ₹0.00 (Nil)</strong>, and all fulfillment occurs electronically and instantaneously over the internet.
          </p>
        </div>

        {/* Fulfillment Metrics */}
        <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Fulfillment Method</span>
            <p className="text-base font-bold text-white font-mono mt-1">Instant Electronic</p>
            <p className="text-xs text-zinc-400 mt-1">Direct workspace upgrade via Razorpay webhook confirmation.</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Fulfillment SLA</span>
            <p className="text-base font-bold text-emerald-400 font-mono mt-1">0 – 5 Minutes</p>
            <p className="text-xs text-zinc-400 mt-1">Average activation latency is under 3 seconds upon payment completion.</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Shipping &amp; Logistics Cost</span>
            <p className="text-base font-bold text-white font-mono mt-1">₹0.00 (NIL)</p>
            <p className="text-xs text-zinc-400 mt-1">No courier, packaging, or postal customs fees ever apply.</p>
          </div>
        </div>

        {/* Policy Clauses */}
        <div className="space-y-10 text-sm leading-relaxed">
          {/* Clause 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">01.</span> Scope of Service Delivery
            </h2>
            <p>
              Upon successful completion of a transaction through our secure payment partner Razorpay, your account is immediately granted access to the features corresponding to your chosen plan:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li><strong>Starter Plan:</strong> Instant unlocking of up to 100 creator contact views, shortlist creation, and pan-India city search filters.</li>
              <li><strong>Agency Pro Plan:</strong> Instant provisioning of up to 1,000 monthly contact unlocks, CSV/PDF report export, campaign budget allocators, and multi-client shortlist folders.</li>
              <li><strong>Enterprise Plan:</strong> Dedicated workspace environment provisioning, custom scraping pipelines, and API key generation within 24 hours of agreement signing.</li>
            </ul>
          </section>

          {/* Clause 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">02.</span> Delivery Confirmation &amp; Invoicing
            </h2>
            <p>
              Immediately upon successful payment authorization, the following digital confirmations are dispatched:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-white">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>1. Email Payment Confirmation &amp; Razorpay Receipt</span>
              </div>
              <p className="text-zinc-400 pl-6">
                Sent to your registered work email with the unique Razorpay Payment ID, Order ID, plan name, and validity timestamp.
              </p>

              <div className="flex items-center gap-2 text-white pt-2 border-t border-zinc-800">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>2. GST-Compliant Tax Invoice</span>
              </div>
              <p className="text-zinc-400 pl-6">
                Available for instant download in PDF format under <strong>Settings &rarr; Subscription &amp; Invoices</strong>, complete with SAC code 998313 (Information Technology Software Services) and CGST/SGST/IGST breakdown.
              </p>
            </div>
          </section>

          {/* Clause 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">03.</span> Handling Delivery Delays &amp; Webhook Issues
            </h2>
            <p>
              Under normal operations, digital access is provisioned within seconds. In rare scenarios where your payment succeeded at your bank but an intermittent network drop delayed the Razorpay webhook delivery:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>Refresh your browser tab or log out and log back in to reload your active session claims.</li>
              <li>Check your registered email inbox for the Razorpay payment confirmation containing your Payment ID (`pay_...`).</li>
              <li>If your plan status does not update within <strong>15 minutes</strong>, email our priority operations desk at <strong>support@creatorbase.in</strong> with your registered email and Payment ID.</li>
              <li>Our technical desk will manually reconcile the transaction with the Razorpay API and activate your workspace within <strong>2 business hours</strong>.</li>
            </ol>
          </section>

          {/* Clause 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">04.</span> Operational &amp; Support Address
            </h2>
            <p>
              For any questions regarding your service fulfillment or digital delivery confirmation, please contact our support desk:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs space-y-1.5">
              <p className="text-white font-bold">Fulfillment &amp; Customer Support</p>
              <p className="text-zinc-400">Company: CreatorBase Technologies</p>
              <p className="text-zinc-400">Registered Office: Scheme 54, Vijay Nagar, Indore, Madhya Pradesh 452010, India</p>
              <p className="text-zinc-400">Email: <a href="mailto:support@creatorbase.in" className="text-emerald-400 underline">support@creatorbase.in</a> / <a href="mailto:billing@creatorbase.in" className="text-emerald-400 underline">billing@creatorbase.in</a></p>
              <p className="text-zinc-400">Support Hours: Monday – Saturday (9:30 AM – 7:30 PM IST)</p>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
          <Link href="/refund-policy" className="text-emerald-400 hover:underline">
            &larr; Read Cancellation &amp; Refund Policy
          </Link>
          <Link href="/terms" className="text-emerald-400 hover:underline">
            Read Terms of Service &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
