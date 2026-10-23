import React from 'react';
import Link from 'next/link';
import { Shield, Lock, ArrowLeft, Mail, MapPin, Database, CheckCircle, Eye, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | CreatorBase India',
  description: 'Privacy Policy and Data Protection practices for CreatorBase Technologies under Indian DPDP and IT Acts.',
};

export default function PrivacyPolicyPage() {
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
            <span>PRIVACY_DOC_REF:</span>
            <span className="text-zinc-300 font-semibold">PRIV-IN-2026-V2</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header Block */}
        <div className="space-y-4 border-b border-zinc-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>DPDP Act (2023) &amp; IT Rules (2021) Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <span>Operating Entity: <strong>CreatorBase Technologies</strong></span>
            <span>•</span>
            <span>Operational Base: <strong>Indore, Madhya Pradesh, India</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>October 15, 2026</strong></span>
          </div>
        </div>

        {/* Data Protection Core Principles */}
        <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 mb-1">
              <Shield className="w-4 h-4" />
              <span>ZERO PAYMENT RETENTION</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We never store debit/credit card details, CVVs, or UPI PINs. All payments are tokenized directly via Razorpay.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 mb-1">
              <Database className="w-4 h-4" />
              <span>ENCRYPTED IN TRANSIT &amp; REST</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All database connections utilize SSL/TLS 1.3 encryption with strict Neon PostgreSQL role-based access.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 mb-1">
              <Eye className="w-4 h-4" />
              <span>NO DATA BROKERING</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We never sell, rent, or lease your brand, agency, or campaign data to third-party ad networks or brokers.
            </p>
          </div>
        </div>

        {/* Privacy Clauses */}
        <div className="space-y-10 text-sm leading-relaxed">
          {/* Clause 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">01.</span> Information We Collect
            </h2>
            <p>
              When you use CreatorBase, we collect and process only the minimum necessary data to provide our B2B SaaS discovery and campaign management services:
            </p>
            <div className="space-y-2 pl-2">
              <p><strong>A. User Profile Data:</strong> Full name, corporate email address, encrypted password hash (bcrypt), company/agency name, and optional phone number.</p>
              <p><strong>B. Transaction &amp; Billing Data:</strong> Razorpay Order IDs, Payment IDs, chosen plan tier (Starter/Pro/Enterprise), transaction timestamps, billing address, and GSTIN (for B2B tax invoicing). <em>Note: Credit card numbers, expiration dates, CVVs, net-banking credentials, and UPI MPINs are handled exclusively by Razorpay and never touch or reside on our servers.</em></p>
              <p><strong>C. Workspace Operational Data:</strong> Creator shortlists created by you, notes, campaign budgets, and saved search filters.</p>
              <p><strong>D. Public Influencer Telemetry:</strong> Publicly accessible social media profile handles, follower counts, bio text, and estimated engagement metrics collected via standard public web APIs and search engines.</p>
            </div>
          </section>

          {/* Clause 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">02.</span> Purpose &amp; Legal Basis of Processing
            </h2>
            <p>
              Under the Digital Personal Data Protection (DPDP) Act, 2023, we process personal data for legitimate business purposes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>To create and authenticate user accounts using cryptographic JSON Web Tokens (JWT).</li>
              <li>To provision subscription access upon successful payment confirmation from Razorpay webhooks.</li>
              <li>To issue compliant GST tax invoices and maintain accounting records required by Indian financial regulations.</li>
              <li>To detect and prevent payment fraud, unauthorized automated scraping, and account abuse.</li>
              <li>To provide customer support and service-related notifications regarding plan expiry or platform updates.</li>
            </ul>
          </section>

          {/* Clause 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">03.</span> Third-Party Data Sub-Processors
            </h2>
            <p>
              We partner with industry-leading cloud infrastructure providers that maintain strict data protection standards:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800 gap-1">
                <span className="text-white font-semibold">Razorpay Software Private Limited</span>
                <span className="text-emerald-400">Payment Processing &amp; Webhooks (PCI-DSS Level 1)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800 gap-1">
                <span className="text-white font-semibold">Neon Inc. (AWS ap-southeast-1)</span>
                <span className="text-indigo-400">Serverless PostgreSQL Database Storage (Encrypted)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-white font-semibold">Apify Technologies</span>
                <span className="text-amber-400">Public Social Media Telemetry Aggregation</span>
              </div>
            </div>
          </section>

          {/* Clause 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">04.</span> Cookies, Session Tokens &amp; Local Storage
            </h2>
            <p>
              CreatorBase uses minimal browser storage mechanisms:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li><strong>Essential Session Tokens:</strong> An encrypted JWT is stored in local storage or HTTP-only cookies to authenticate your requests against our Express REST API.</li>
              <li><strong>User Preferences:</strong> Storing UI preferences such as active search filters and sidebar toggle state.</li>
              <li>We do <strong>not</strong> use invasive third-party cross-site advertising cookies.</li>
            </ul>
          </section>

          {/* Clause 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">05.</span> Data Retention &amp; User Rights
            </h2>
            <p>
              As a user of CreatorBase, you have complete sovereignty over your data under the DPDP Act 2023:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li><strong>Right to Access &amp; Portability:</strong> You can export your creator shortlists and campaign data to standard CSV/JSON format at any time.</li>
              <li><strong>Right to Rectification:</strong> You can modify your name, company details, and password directly in the Profile settings.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request complete deletion of your workspace and account data by writing to <strong>privacy@creatorbase.in</strong>. All workspace records and campaign files will be permanently purged within 14 calendar days, subject to statutory tax invoice retention obligations under Indian law.</li>
            </ul>
          </section>

          {/* Clause 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">06.</span> Security Safeguards
            </h2>
            <p>
              We implement industry-standard technical and organizational security measures including salted bcrypt password hashing (12 salt rounds), HTTPS-only transmission, CORS origin verification, SQL injection prevention via Prisma ORM parameterized queries, and strict rate-limiting.
            </p>
          </section>

          {/* Clause 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="text-emerald-400">07.</span> Grievance Redressal &amp; Regulatory Contact
            </h2>
            <p>
              If you have any questions, concerns, or grievances regarding the processing of your personal data or compliance with data privacy laws, please contact our designated Grievance Officer:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs space-y-1.5">
              <p className="text-white font-bold">Grievance Officer: Mr. Rohan Sharma</p>
              <p className="text-zinc-400">Designation: Head of Compliance &amp; Information Security</p>
              <p className="text-zinc-400">Entity: CreatorBase Technologies</p>
              <p className="text-zinc-400">Physical Address: Scheme 54, Vijay Nagar, Indore, Madhya Pradesh 452010, India</p>
              <p className="text-zinc-400">Email: <a href="mailto:grievance@creatorbase.in" className="text-emerald-400 underline">grievance@creatorbase.in</a></p>
              <p className="text-zinc-400">Data Protection Inquiries: <a href="mailto:privacy@creatorbase.in" className="text-emerald-400 underline">privacy@creatorbase.in</a></p>
              <p className="text-zinc-500 pt-1">
                Acknowledgement SLA: 48 hours | Resolution SLA: Within 30 calendar days
              </p>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
          <Link href="/terms" className="text-emerald-400 hover:underline">
            &larr; Read Terms of Service
          </Link>
          <Link href="/refund-policy" className="text-emerald-400 hover:underline">
            Read Cancellation &amp; Refund Policy &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
