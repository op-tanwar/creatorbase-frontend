'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import {
  ShieldAlert,
  LayoutDashboard,
  Building2,
  Receipt,
  Users2,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        toast.error('Please sign in to access the Master Admin Console');
        router.push('/login');
      } else if (user.role !== 'SUPER_ADMIN') {
        toast.error('Access denied: Master Admin privileges required');
        router.push('/discover');
      } else {
        setAuthorized(true);
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (isLoading || !authorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0C0E] text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="font-mono text-sm tracking-wide text-amber-400">
            Verifying Master Admin Authorization...
          </span>
        </div>
      </div>
    );
  }

  const adminNav = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Agencies & Subscriptions',
      href: '/admin/agencies',
      icon: Building2,
    },
    {
      name: 'Revenue & Ledger',
      href: '/admin/revenue',
      icon: Receipt,
    },
    {
      name: 'Creator Catalog',
      href: '/admin/creators',
      icon: Users2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0C] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Root Admin Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#22252C] bg-[#0E1014]/95 backdrop-blur-md px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-zinc-950 font-black shadow-lg shadow-amber-950/60 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-zinc-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-white font-sans">
                    CreatorBase
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <span>👑</span>
                    <span>MASTER ADMIN</span>
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400">
                  Root Governance &amp; Platform Controls
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1 pl-6 ml-4 border-l border-[#24272E]">
              {adminNav.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-950/40 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Exit to App & Admin Profile */}
          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>Agency View</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-zinc-200">{user?.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800/40">
                ROOT
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-900/40 transition-colors"
              title="Sign out of Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center gap-1 overflow-x-auto py-2 border-t border-[#22252C] scrollbar-none">
          {adminNav.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
