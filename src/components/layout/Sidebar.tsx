'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import {
  Compass,
  BookmarkCheck,
  Megaphone,
  FileSpreadsheet,
  Zap,
  LogOut,
  Building2,
  Settings,
  X,
  ShieldAlert,
  Mail,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { toast } from 'sonner';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [
    {
      name: 'Discover Influencers',
      href: '/discover',
      icon: Compass,
      description: 'Pan-India creator search',
    },
    {
      name: 'My Shortlists',
      href: '/shortlists',
      icon: BookmarkCheck,
      description: 'Curate, price & export',
    },
    {
      name: 'Outreach CRM',
      href: '/outreach',
      icon: Mail,
      description: 'Automated pitches & threads',
    },
    {
      name: 'Bulk CSV Enrichment',
      href: '/enrich',
      icon: FileSpreadsheet,
      description: 'Audit & enrich raw handles',
    },
    {
      name: 'Campaigns',
      href: '/campaigns',
      icon: Megaphone,
      description: 'Budget & ROI tracking',
    },
    {
      name: 'Profile & Settings',
      href: '/profile',
      icon: Settings,
      description: 'Account, plan & billing',
    },
    ...(user?.role === 'SUPER_ADMIN'
      ? [
          {
            name: 'Master Admin Console',
            href: '/admin',
            icon: ShieldAlert,
            description: 'Platform & agency controls',
            isAdmin: true,
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <aside className="flex flex-col h-full w-64 bg-[#060709] border-r border-white/[0.06] text-zinc-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <Link href="/discover" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-transform duration-200 group-hover:scale-105">
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
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-sans">
                CreatorBase
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                IND
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-500 tracking-wide">
              OPERATING SYSTEM
            </p>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 min-h-0 px-3 py-4 sm:py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
          Core Engine
        </div>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          const isAdmin = (item as any).isAdmin;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all group ${
                isAdmin
                  ? isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950/40'
                    : 'text-amber-400/90 hover:text-amber-200 hover:bg-amber-950/30 border border-amber-500/25'
                  : isActive
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isAdmin
                    ? isActive
                      ? 'bg-amber-500/25 text-amber-300'
                      : 'text-amber-400 group-hover:text-amber-200'
                    : isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 leading-tight min-w-0">
                <div className="font-semibold text-xs truncate">{item.name}</div>
                <div className="text-[10px] text-zinc-500 font-normal truncate mt-0.5">
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Section Footer */}
      <div className="p-3 border-t border-white/[0.06] bg-[#08090C]">
        <div className="rounded-xl bg-[#0C0E12] border border-white/[0.07] p-3 space-y-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <Link
            href="/profile"
            onClick={onCloseMobile}
            className="flex items-center gap-3 p-1 -m-1 rounded-lg hover:bg-white/[0.03] transition-colors group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-950 to-zinc-900 text-emerald-400 border border-emerald-500/40 font-mono font-bold text-xs uppercase group-hover:scale-105 transition-transform">
              {user?.name ? user.name.slice(0, 2) : 'CB'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors font-sans">
                  {user?.name || 'Agency Account'}
                </p>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {user?.planType || 'PRO'}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate flex items-center gap-1 mt-0.5 font-mono">
                <Building2 className="w-3 h-3 shrink-0 text-emerald-400" />
                <span className="truncate">{user?.companyName || 'Agency'}</span>
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-mono font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 border border-white/[0.06] hover:border-rose-900/40 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
