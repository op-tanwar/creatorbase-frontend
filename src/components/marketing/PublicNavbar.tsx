'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ShieldCheck, Compass, Sparkles } from 'lucide-react';

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Dynamic scroll glassmorphism trigger (scrollY > 20)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Auto-close mobile drawer when window resizes to desktop breakpoint (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { label: 'Engine', href: '/#engine' },
    { label: 'Pitch Portals', href: '/#pitch-portals' },
    { label: 'Workflow', href: '/#workflow' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Cities', href: '/#cities' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? 'bg-[#060709]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
          : 'bg-[#060709]/60 backdrop-blur-md border-b border-white/[0.05]'
        }`}
    >
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Crisp Geometric Logo Mark + Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-transform duration-200 group-hover:scale-105">
            <svg
              className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-emerald-400"
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
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
              CreatorBase
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              <span>v2.4</span>
            </span>
          </div>
        </Link>

        {/* Center: Clean Navigation Links with Sliding Hover Pill (Hidden below 1024px to prevent crowding) */}
        <nav
          className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.06] bg-[#0C0E12]/80 p-1 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          onMouseLeave={() => setHoveredNav(null)}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onMouseEnter={() => setHoveredNav(link.label)}
              className="relative rounded-full px-4 py-1.5 text-xs font-medium text-zinc-400 transition-colors duration-200 hover:text-white"
            >
              {hoveredNav === link.label && (
                <motion.div
                  layoutId="navbar-hover-pill"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="absolute inset-0 rounded-full bg-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: Desktop Auth Actions (Hidden below lg) */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/discover"
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_26px_rgba(16,185,129,0.45)] active:scale-95"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Launch Engine</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-emerald-500/40 bg-emerald-500 px-4 py-2 text-xs font-semibold text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] active:scale-95"
              >
                <span>Start Free →</span>
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile / Tablet (< 1024px) Header Actions */}
        <div className="flex lg:hidden items-center gap-2">
          {isAuthenticated ? (
            <Link
              href="/discover"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black"
            >
              Engine
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black"
            >
              Start Free
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/[0.08] bg-[#0C0E12] text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-b border-white/[0.08] bg-[#060709]/95 px-4 pt-3 pb-6 backdrop-blur-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-zinc-200 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-zinc-500 font-mono">→</span>
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-white/[0.08] flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  href="/discover"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 min-h-[48px] py-3 text-sm font-semibold text-black shadow-md shadow-emerald-500/20 active:scale-98 transition-transform"
                >
                  <Compass className="h-4 w-4" />
                  <span>Launch CreatorBase Engine</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#0C0E12] min-h-[48px] py-3 text-sm font-medium text-zinc-200 hover:bg-white/[0.05] active:scale-98 transition-all"
                  >
                    Sign In to Account
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-500 min-h-[48px] py-3 text-sm font-semibold text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-98 transition-all"
                  >
                    <span>Start Free Trial →</span>
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                  </Link>
                </>
              )}

              <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>GST SAC 998314 COMPLIANT • ZERO CREDIT CARD REQUIRED</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
