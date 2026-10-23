'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Directory', href: '/creators' },
    { label: 'Features', href: '/#features' },
    { label: 'Live Demo', href: '/#demo' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-lg shadow-emerald-950/60 transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-emerald-100" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
              CreatorBase
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              <span>🇮🇳</span>
              <span className="hidden sm:inline">PRO</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors ${isActive
                  ? 'text-white bg-zinc-800/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/discover"
              className="group inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              <Compass className="h-4 w-4" />
              <span>Open Workspace</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-zinc-950 shadow-sm transition-all hover:opacity-95 hover:shadow-emerald-500/25 active:scale-[0.98]"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <Link
              href="/discover"
              className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-400"
            >
              App
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-zinc-800 bg-zinc-950/95 px-4 pt-3 pb-6 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <Link
                  href="/discover"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 shadow-md shadow-emerald-500/20"
                >
                  <Compass className="h-4 w-4" />
                  <span>Launch CreatorBase App</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
                  >
                    Sign In to Account
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-indigo-600 py-2.5 text-sm font-semibold text-zinc-950 shadow-md"
                  >
                    <span>Start 7-Day Free Trial</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}

              <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Zero credit card required • Instant access</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
