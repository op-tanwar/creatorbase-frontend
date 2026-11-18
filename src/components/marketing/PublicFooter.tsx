import React from 'react';
import Link from 'next/link';
import { Shield, Heart, ExternalLink, CheckCircle2 } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060709] text-zinc-400 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <svg
                  className="h-4 w-4 text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white font-sans">
                  CreatorBase
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-emerald-400">
                  IND
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-xs text-zinc-400 leading-relaxed font-sans">
              India&apos;s #1 influencer discovery &amp; campaign execution operating system. Built for high-performance D2C brands &amp; media agencies.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono font-medium text-emerald-400">
                All Systems Operational • 24ms
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs font-mono">
              <li>
                <Link href="/discover" className="hover:text-emerald-400 transition-colors">
                  Discovery Engine
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-emerald-400 transition-colors">
                  Creator Directory
                </Link>
              </li>
              <li>
                <Link href="/#pitch-portals" className="hover:text-emerald-400 transition-colors">
                  Client Pitch Portals
                </Link>
              </li>
              <li>
                <Link href="/#workflow" className="hover:text-emerald-400 transition-colors">
                  Workflow Kanban
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-emerald-400 transition-colors">
                  Pricing &amp; Plans (₹)
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Solutions
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs font-mono">
              <li>
                <Link href="/#pricing" className="hover:text-emerald-400 transition-colors">
                  For Boutique Agencies
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-emerald-400 transition-colors">
                  For High-Growth D2C
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Enterprise Networks
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Schedule Agency Walkthrough
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919826000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>WhatsApp Concierge</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs font-mono">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About CreatorBase
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <span className="text-zinc-500">HQ: Indore, MP (India)</span>
              </li>
              <li>
                <span className="text-zinc-500">Node: Mumbai AP-South-1</span>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (Razorpay & DPDP Mandate) */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Legal &amp; Compliance</span>
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs font-mono">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund &amp; Cancellation
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  SaaS Fulfillment Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Grievance Redressal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Operational Entity & Security Verification Banner */}
        <div className="mt-12 rounded-xl border border-white/[0.06] bg-[#0A0C10] p-4 text-xs font-mono text-zinc-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-400 shrink-0 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% PCI-DSS Compliant Payment Gateway Powered by Razorpay</span>
          </div>
          <div className="text-[11px] text-zinc-500">
            SAC Code 998314 • 18% Input Tax Credit Eligible
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© 2026 CreatorBase Technologies. All rights reserved.</p>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400 flex-wrap justify-center">
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-emerald-400 transition-colors">Refunds</Link>
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
