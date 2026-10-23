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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#24272E] bg-[#0B0C0E]/90 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Market Status pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-200">India Tier 1 & 2 Hubs</span>
          <Badge variant="indigo" size="sm" className="py-0 px-1 text-[10px]">
            Live Feed
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline">Precision Match</span>
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
        </div>

        {user?.role === 'SUPER_ADMIN' && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:border-amber-400 hover:text-amber-200 transition-all shadow-sm shadow-amber-950"
          >
            <span className="text-sm">👑</span>
            <span className="tracking-wide">Admin Console</span>
          </Link>
        )}

        {/* Profile Avatar Shortcut */}
        <Link
          href="/profile"
          className="flex items-center gap-2 pl-2 border-l border-zinc-800 hover:opacity-85 transition-opacity"
          title="Account & Organization Settings"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold text-xs uppercase shadow-sm">
            {user?.name ? user.name.slice(0, 2) : 'CB'}
          </div>
        </Link>
      </div>
    </header>
  );
}
