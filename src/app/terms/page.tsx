import React from 'react';
import Link from 'next/link';
import { Shield, FileText, ArrowLeft, Mail, MapPin, Scale, Clock, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | CreatorBase India',
  description: 'Terms of Service, user agreement, and compliance policies for CreatorBase Technologies.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#08090B] text-zinc-300 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Banner / Breadcrumb */}
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
            <span>LEGAL_DOC_REF:</span>
            <span className="text-zinc-300 font-semibold">TOS-IN-2026-V2</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header Block */}
        <div className="space-y-4 border-b border-zinc-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Scale className="w-3.5 h-3.5" />
            <span>Indian IT Act (2000) &amp; Consumer Protection Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <span>Operating Entity: <strong>CreatorBase Technologies</strong></span>
            <span>•</span>
            <span>Effective Date: <strong>January 1, 2026</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>October 15, 2026</strong></span>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="my-8 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-sm leading-relaxed text-zinc-300 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Summary for Commercial Brands &amp; Agencies</span>
          </div>
          <p>
            CreatorBase is a cloud-based B2B SaaS software platform facilitating influencer discovery, public social media metric indexing, campaign workflow management, and analytics for brands and talent agencies in India. By accessing our services or creating an account, you enter into a binding legal contract with <strong>CreatorBase Technologies</strong>, located in Indore, Madhya Pradesh, India.
          </p>
        </div>

        {/* Content Clauses */}
        <div className="space-y-10 text-sm leading-relaxed">
          {/* Clause 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">01.</span> Scope of Service &amp; Platform Role
            </h2>
            <p>
              CreatorBase provides commercial tools including influencer discovery search filters (city, niche, follower range, engagement rate), public profile aggregation, shortlist organization, and campaign tracking.
            </p>
            <p>
              CreatorBase is an independent telemetry software and search tool. CreatorBase is <strong>not</strong> a talent agency, booking agent, or direct employer of creators indexed on the platform. All brand-creator commercial partnerships, deliverables, and financial agreements negotiated outside of CreatorBase are the sole responsibility of the respective parties.
            </p>
          </section>

          {/* Clause 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">02.</span> Account Registration &amp; Security
            </h2>
            <p>
              To access search and shortlist capabilities, you must register a corporate or personal user account with accurate information (full legal name, verifiable work email address, and company name).
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>You are strictly responsible for maintaining the confidentiality of your login credentials and JWT tokens.</li>
              <li>Account sharing across multiple external entities or programmatic reverse-engineering of CreatorBase APIs without an enterprise contract is strictly prohibited and constitutes grounds for immediate termination without refund.</li>
              <li>You must immediately notify <strong>security@creatorbase.in</strong> if you detect unauthorized access to your account.</li>
            </ul>
          </section>

          {/* Clause 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">03.</span> Subscription Plans &amp; Commercial Billing (INR)
            </h2>
            <p>
              Paid subscription tiers (Starter, Agency Pro, Enterprise) are billed in <strong>Indian Rupees (INR - ₹)</strong> on a recurring monthly or annual basis, as configured by the user at checkout.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>All payments are securely processed through Razorpay (RBI Authorized Payment Aggregator, PCI-DSS Level 1 certified). CreatorBase does not store card numbers, CVVs, or UPI PINs.</li>
              <li>Applicable Goods and Services Tax (GST at 18%) is calculated and shown at checkout in compliance with the Central Goods and Services Tax Act, 2017. Tax invoices with valid GSTIN are issued automatically.</li>
              <li>Subscriptions renew automatically unless cancelled prior to the renewal date via the workspace profile settings.</li>
            </ul>
          </section>

          {/* Clause 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">04.</span> Fair Use, Scraping Restrictions &amp; Third-Party APIs
            </h2>
            <p>
              Metrics displayed on CreatorBase (follower counts, engagement rates, reel views) are retrieved from publicly accessible social media web profiles and compliant developer connectors (including Apify actors).
            </p>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 font-mono text-xs text-zinc-400 space-y-2">
              <p className="text-amber-400 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                RESTRICTIONS ON AUTOMATED SCRAPING
              </p>
              <p>
                Users agree not to scrape, spider, or programmatic-harvest CreatorBase data using headless browsers, curl bots, or unauthorized scraping scripts. Rate limits (HTTP 429) are enforced to maintain platform integrity.
              </p>
            </div>
            <p>
              Third-party social media platforms (Instagram, YouTube) may alter their public HTML or API availability without notice. While CreatorBase maintains high-availability sync pipelines, temporary metric latency or rate-limiting by third-party platforms does not constitute a breach of service.
            </p>
          </section>

          {/* Clause 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">05.</span> Intellectual Property Rights
            </h2>
            <p>
              All proprietary algorithms, metric scoring systems, software code, UI designs, graphics, and trademarks associated with CreatorBase are the exclusive property of <strong>CreatorBase Technologies</strong>.
            </p>
            <p>
              Users retain full ownership of their proprietary campaign briefs, uploaded media assets, and internal shortlist notes created within their workspace.
            </p>
          </section>

          {/* Clause 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">06.</span> Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted under applicable Indian law, CreatorBase Technologies and its directors, employees, or affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Inaccuracies or third-party modifications in public social media influencer telemetry;</li>
              <li>Creator performance, campaign sales outcomes, or contractual disputes with third-party influencers;</li>
              <li>Unauthorized access resulting from compromised user credentials.</li>
            </ul>
            <p>
              In all cases, the total aggregate liability of CreatorBase Technologies shall not exceed the amount paid by you in the 3 months preceding the claim.
            </p>
          </section>

          {/* Clause 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">07.</span> Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the <strong>Republic of India</strong>, including the Information Technology Act, 2000, and the Consumer Protection (E-Commerce) Rules, 2020.
            </p>
            <p>
              Any dispute, controversy, or claim arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts situated in <strong>Indore, Madhya Pradesh, India</strong>.
            </p>
          </section>

          {/* Clause 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">08.</span> Grievance Officer &amp; Communication
            </h2>
            <p>
              In accordance with the Information Technology Act 2000 and the rules made thereunder, the contact details of the designated Grievance Officer are provided below:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs space-y-1.5">
              <p className="text-white font-bold">Grievance Officer: Mr. Rohan Sharma</p>
              <p className="text-zinc-400">Entity: CreatorBase Technologies</p>
              <p className="text-zinc-400">Address: Scheme 54, Vijay Nagar, Indore, Madhya Pradesh 452010, India</p>
              <p className="text-zinc-400">Official Grievance Email: <a href="mailto:grievance@creatorbase.in" className="text-emerald-400 underline">grievance@creatorbase.in</a></p>
              <p className="text-zinc-400">General Support Email: <a href="mailto:support@creatorbase.in" className="text-emerald-400 underline">support@creatorbase.in</a></p>
              <p className="text-zinc-500 pt-1">Acknowledgement SLA: Within 48 hours | Resolution SLA: Within 30 days</p>
            </div>
          </section>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
          <Link href="/privacy" className="text-emerald-400 hover:underline">
            Read Privacy Policy &rarr;
          </Link>
          <Link href="/refund-policy" className="text-emerald-400 hover:underline">
            Read Cancellation &amp; Refund Policy &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
