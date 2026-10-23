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
  Sparkles,
  Building2,
  Settings,
  X,
  ShieldAlert,
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
    <aside className="flex flex-col h-full w-64 bg-[#0E1014] border-r border-[#24272E] text-zinc-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#24272E]">
        <Link href="/discover" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white shadow-md shadow-emerald-950 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-sans">
                CreatorBase
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                IN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Influencer Intelligence
            </p>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Platform Modules
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isAdmin
                  ? isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950/40'
                    : 'text-amber-400/90 hover:text-amber-200 hover:bg-amber-950/30 border border-amber-500/25'
                  : isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isAdmin
                    ? isActive
                      ? 'bg-amber-500/25 text-amber-300'
                      : 'text-amber-400 group-hover:text-amber-200 group-hover:bg-amber-950/50'
                    : isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 leading-tight">
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-[11px] text-slate-400 font-normal">
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 space-y-3">
          <Link
            href="/profile"
            onClick={onCloseMobile}
            className="flex items-center gap-3 p-1 -m-1 rounded-lg hover:bg-slate-800/50 transition-colors group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-bold text-xs uppercase group-hover:scale-105 transition-transform">
              {user?.name ? user.name.slice(0, 2) : 'CB'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                  {user?.name || 'Account'}
                </p>
                <Badge variant="emerald" size="sm" className="text-[10px] py-0 px-1.5">
                  {user?.planType || 'PRO'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{user?.companyName || 'Agency'}</span>
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-700/60 hover:border-rose-900/40 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
