import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Heart, ExternalLink, CheckCircle2 } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand Info (Span 1 on lg or full on mobile) */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-md shadow-emerald-950/60">
                <Sparkles className="h-5 w-5 text-emerald-100" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  CreatorBase
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  INDIA
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-xs text-zinc-400 leading-relaxed">
              India&apos;s premier influencer discovery, public telemetry, and campaign intelligence SaaS. Built for high-growth D2C brands and talent agencies.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-medium text-emerald-400">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Product
            </h3>
            <ul className="mt-4 space-y-2 text-xs font-mono">
              <li>
                <Link href="/creators" className="hover:text-emerald-400 transition-colors">
                  Creator Directory
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-emerald-400 transition-colors">
                  Creator Discovery
                </Link>
              </li>
              <li>
                <Link href="/shortlists" className="hover:text-emerald-400 transition-colors">
                  Shortlists &amp; CSV
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-emerald-400 transition-colors">
                  Campaign Tracker
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="hover:text-emerald-400 transition-colors">
                  Live ROI Calculator
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-400 transition-colors">
                  Plans &amp; Pricing (₹)
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Solutions
            </h3>
            <ul className="mt-4 space-y-2 text-xs font-mono">
              <li>
                <Link href="/pricing#starter" className="hover:text-emerald-400 transition-colors">
                  For D2C Founders
                </Link>
              </li>
              <li>
                <Link href="/pricing#agency" className="hover:text-emerald-400 transition-colors">
                  For Creative Agencies
                </Link>
              </li>
              <li>
                <Link href="/pricing#enterprise" className="hover:text-emerald-400 transition-colors">
                  Enterprise SLA
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Custom Apify Scraping
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Schedule Agency Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Company
            </h3>
            <ul className="mt-4 space-y-2 text-xs font-mono">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About CreatorBase
                </Link>
              </li>
              <li>
                <Link href="/about#story" className="hover:text-emerald-400 transition-colors">
                  Our Mission in India
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Sales &amp; Support
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919826000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>WhatsApp Business</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="text-zinc-500">HQ: Indore, MP (India)</span>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (Mandatory for Razorpay Approval) */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Legal &amp; Compliance</span>
            </h3>
            <ul className="mt-4 space-y-2 text-xs font-mono">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (DPDP)
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Cancellation &amp; Refund
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery (SaaS)
                </Link>
              </li>
              <li>
                <Link href="/contact#grievance" className="hover:text-white transition-colors">
                  Grievance Redressal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Operational Entity & Address Notice (Razorpay Mandate) */}
        <div className="mt-12 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-xs font-mono text-zinc-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-400 shrink-0 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% PCI-DSS Secure Gateway Powered by Razorpay</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© 2026 CreatorBase Technologies. All rights reserved.</p>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400 flex-wrap justify-center">
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-emerald-400 transition-colors">Refunds</Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-emerald-400 transition-colors">Fulfillment</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
          </div>

          <p className="flex items-center gap-1 text-zinc-400 text-[11px]">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500 inline" />
            <span>in Indore for Indian Growth Teams</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
