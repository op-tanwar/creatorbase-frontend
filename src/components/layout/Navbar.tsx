'use client';

import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { Menu, Radio, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  title: string;
  subtitle?: string;
}

export function Navbar({ onOpenMobileMenu, title, subtitle }: NavbarProps) {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-4 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.07] bg-[#060709]/90 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/[0.08] bg-[#0C0E12] text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm md:text-base font-bold tracking-tight text-white font-sans flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-zinc-400 hidden sm:block font-sans">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live Feed Hub Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0C0E12] border border-white/[0.08] text-xs font-mono text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>50+ Indian Hubs Active</span>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
            24ms
          </span>
        </div>

        {/* Precision Match Engine Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-[0_0_15px_rgba(16,185,129,0.12)]">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline">Precision Match</span>
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
        </div>

        {user?.role === 'SUPER_ADMIN' && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold hover:border-amber-400 hover:bg-amber-500/20 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            <span>👑</span>
            <span className="tracking-wide">Admin</span>
          </Link>
        )}

        {/* Profile Avatar Shortcut */}
        <Link
          href="/profile"
          className="flex items-center gap-2 pl-2 sm:pl-3 pr-1 sm:pr-2 border-l border-white/[0.08] hover:opacity-90 transition-opacity"
          title="Account & Organization Settings"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-950 to-zinc-900 text-emerald-400 border border-emerald-500/40 font-mono font-bold text-xs uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
        </Link>
      </div>
    </header>
  );
}
