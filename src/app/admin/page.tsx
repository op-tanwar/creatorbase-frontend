'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import adminService, { AdminMetricsResponse } from '@/services/adminService';
import {
  Users,
  CreditCard,
  TrendingUp,
  Sparkles,
  Building2,
  Receipt,
  UserPlus,
  ArrowUpRight,
  RefreshCw,
  FolderKanban,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminMetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchMetrics = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const res = await adminService.getMetrics();
      setData(res);
      if (showToast) toast.success('Platform metrics refreshed');
    } catch (err: any) {
      toast.error('Failed to load admin metrics');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const metrics = data?.metrics;
  const planBreakdown = data?.planBreakdown || {};
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#24272E] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Master Admin Intelligence
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time subscriber health, Razorpay financial metrics, and creator ecosystem indexing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchMetrics(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Stats</span>
          </button>

          <Link
            href="/admin/creators"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-md shadow-amber-950/40"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Creator</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Platform Revenue */}
        <div className="rounded-xl bg-[#111317] border border-[#24272E] p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Gross Platform Revenue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-white">
              {isLoading ? (
                <div className="h-8 w-28 bg-zinc-800 animate-pulse rounded" />
              ) : (
                `₹${(metrics?.totalRevenueINR || 0).toLocaleString('en-IN')}`
              )}
            </div>
            <p className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Razorpay Production Verified</span>
            </p>
          </div>
        </div>

        {/* Total Registered Agencies */}
        <div className="rounded-xl bg-[#111317] border border-[#24272E] p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Registered Agencies</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-white">
              {isLoading ? (
                <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded" />
              ) : (
                metrics?.totalAgencies ?? 0
              )}
            </div>
            <p className="text-[11px] font-mono text-zinc-400 mt-1">
              Brands &amp; Talent Agencies
            </p>
          </div>
        </div>

        {/* Active Paid Subscriptions */}
        <div className="rounded-xl bg-[#111317] border border-[#24272E] p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Active Paid Subs</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400">
              {isLoading ? (
                <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded" />
              ) : (
                metrics?.activeSubscriptions ?? 0
              )}
            </div>
            <p className="text-[11px] font-mono text-zinc-400 mt-1">
              Starter, Pro &amp; Enterprise Tiers
            </p>
          </div>
        </div>

        {/* Total Creators Indexed */}
        <div className="rounded-xl bg-[#111317] border border-[#24272E] p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Verified Creators</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-white">
              {isLoading ? (
                <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded" />
              ) : (
                metrics?.totalCreators ?? 0
              )}
            </div>
            <p className="text-[11px] font-mono text-zinc-400 mt-1">
              Pan-India Indexed Cohort
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Breakdown & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier Distribution Card */}
        <div className="lg:col-span-1 rounded-xl bg-[#111317] border border-[#24272E] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#24272E] pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Agency Tier Distribution
            </h2>
            <Link
              href="/admin/agencies"
              className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { key: 'ENTERPRISE', label: 'Enterprise Custom', color: 'bg-purple-500', text: 'text-purple-400' },
              { key: 'PRO', label: 'Growth Agency Pro (₹4,999)', color: 'bg-emerald-500', text: 'text-emerald-400' },
              { key: 'STARTER', label: 'Starter Brand (₹2,999)', color: 'bg-indigo-500', text: 'text-indigo-400' },
              { key: 'FREE_TRIAL', label: 'Free Trial (14-Day)', color: 'bg-zinc-500', text: 'text-zinc-400' },
            ].map((tier) => {
              const count = planBreakdown[tier.key] || 0;
              const total = metrics?.totalAgencies || 1;
              const percent = Math.round((count / total) * 100);

              return (
                <div key={tier.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{tier.label}</span>
                    <span className="font-mono text-zinc-400">
                      <strong className={tier.text}>{count}</strong> accounts ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full ${tier.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#24272E] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Total Shortlists: <strong>{metrics?.totalShortlists ?? 0}</strong></span>
            <span>Total Campaigns: <strong>{metrics?.totalCampaigns ?? 0}</strong></span>
          </div>
        </div>

        {/* Live System Activity Feed */}
        <div className="lg:col-span-2 rounded-xl bg-[#111317] border border-[#24272E] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#24272E] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Platform Events
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Last 10 Actions</span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-zinc-900/60 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              No platform activity recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-[#20232A] overflow-y-auto max-h-[380px] pr-1">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="py-3 flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 p-1.5 rounded-lg border ${
                        activity.type === 'PAYMENT'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : activity.type === 'SIGNUP'
                          ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}
                    >
                      {activity.type === 'PAYMENT' && <Receipt className="w-3.5 h-3.5" />}
                      {activity.type === 'SIGNUP' && <Building2 className="w-3.5 h-3.5" />}
                      {activity.type === 'CAMPAIGN' && <FolderKanban className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 whitespace-nowrap">
                    {new Date(activity.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          href="/admin/agencies"
          className="rounded-xl bg-[#111317] border border-[#24272E] p-5 hover:border-amber-500/50 hover:bg-[#15171C] transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white font-sans">Agencies &amp; Subscriptions</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Override agency tiers, extend billing expiration, or suspend abusive accounts.
          </p>
        </Link>

        <Link
          href="/admin/revenue"
          className="rounded-xl bg-[#111317] border border-[#24272E] p-5 hover:border-amber-500/50 hover:bg-[#15171C] transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Receipt className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white font-sans">Revenue &amp; Transactions</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Browse complete Razorpay order &amp; payment ledger with instant CSV export.
          </p>
        </Link>

        <Link
          href="/admin/creators"
          className="rounded-xl bg-[#111317] border border-[#24272E] p-5 hover:border-amber-500/50 hover:bg-[#15171C] transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white font-sans">Creator Catalog Manager</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Add new Indian creators, calibrate metrics, verified badges, and audience demographics.
          </p>
        </Link>
      </div>
    </div>
  );
}
