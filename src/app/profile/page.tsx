'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, logout } from '@/store/slices/authSlice';
import api from '@/lib/api';
import { User } from '@/types';
import { formatINR } from '@/lib/utils';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  User as UserIcon,
  Shield,
  CreditCard,
  KeyRound,
  Building2,
  Mail,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Lock,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  Megaphone,
  BookmarkCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData extends User {
  _count?: {
    shortlists: number;
    campaigns: number;
  };
  payments?: Array<{
    orderId: string;
    paymentId: string | null;
    amount: number;
    plan: string;
    status: 'CREATED' | 'SUCCESS' | 'FAILED';
    createdAt: string;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );

  const [activeTab, setActiveTab] = useState<
    'general' | 'subscription' | 'billing' | 'security'
  >('general');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch complete profile details from GET /api/auth/me
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setProfile(data);
        setName(data.name || '');
        setCompanyName(data.companyName || '');
      }
    } catch (err: any) {
      toast.error('Failed to load profile details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleCopyUserId = () => {
    if (profile?.id) {
      navigator.clipboard.writeText(profile.id);
      setCopiedId(true);
      toast.success('Copied User ID to clipboard');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyOrder = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    toast.success('Copied Order ID to clipboard');
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error('Full name must be at least 2 characters');
      return;
    }
    if (!companyName.trim() || companyName.trim().length < 2) {
      toast.error('Company name must be at least 2 characters');
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await api.put('/auth/profile', {
        name: name.trim(),
        companyName: companyName.trim(),
      });

      if (res.data.success) {
        toast.success('Profile details updated successfully');
        dispatch(setUser(res.data.data));
        setProfile((prev) => (prev ? { ...prev, ...res.data.data } : res.data.data));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await api.put('/auth/profile', {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        toast.success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDaysRemaining = (isoString?: string | null) => {
    if (!isoString) return null;
    const diff = new Date(isoString).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires today';
    return `${days} day${days === 1 ? '' : 's'} remaining`;
  };

  if (authLoading || (isLoading && !profile)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-xs font-mono text-zinc-400">Loading profile & organization settings...</p>
        </div>
      </div>
    );
  }

  const currentUser = profile || authUser;
  const planType = currentUser?.planType || 'FREE_TRIAL';
  const isPro = planType === 'PRO' || planType === 'ENTERPRISE';
  const payments = profile?.payments || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Banner / Hero Profile Card */}
      <div className="rounded-2xl bg-[#121316] border border-[#24272E] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Glowing Emerald Avatar Ring */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white font-mono text-2xl font-black shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-500/50">
              <span>{currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'CB'}</span>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 border-2 border-emerald-500 text-[10px]">
                🇮🇳
              </span>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                  {currentUser?.name || 'User Account'}
                </h1>
                <Badge
                  variant={currentUser?.role === 'BRAND_ADMIN' ? 'indigo' : 'emerald'}
                  size="sm"
                  className="font-mono text-[10px] tracking-wide uppercase"
                >
                  {currentUser?.role === 'BRAND_ADMIN' ? 'Brand Admin' : 'Agency Member'}
                </Badge>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isPro
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{planType}</span>
                </span>
              </div>

              <p className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentUser?.companyName || 'CreatorBase Agency'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentUser?.email}</span>
                </span>
              </p>

              {/* ID & Member Since */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-zinc-500">
                <div className="flex items-center gap-1">
                  <span>ID:</span>
                  <span className="text-zinc-400">{currentUser?.id?.slice(0, 16)}...</span>
                  <button
                    onClick={handleCopyUserId}
                    className="p-1 hover:text-white transition-colors"
                    title="Copy full User ID"
                  >
                    {copiedId ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-400" />
                    )}
                  </button>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  <span>Member since {formatDate(currentUser?.createdAt)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA on Top Right */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {!isPro && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setUpgradeModalOpen(true)}
                className="w-full md:w-auto text-xs font-mono font-bold shadow-lg shadow-emerald-950/50"
                leftIcon={<Zap className="w-4 h-4 text-zinc-950 fill-zinc-950" />}
              >
                Upgrade to Pro
              </Button>
            )}
            <Button
              variant="outline"
              size="md"
              onClick={handleLogout}
              className="w-full md:w-auto text-xs font-mono text-zinc-400 hover:text-rose-400 hover:border-rose-900/50"
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#24272E] pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'general', label: 'General & Profile', icon: UserIcon },
          { id: 'subscription', label: 'Subscription & Plan', icon: Zap },
          { id: 'billing', label: 'Billing & Receipts', icon: CreditCard },
          { id: 'security', label: 'Security & Access', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#121316] border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ====================================================================
          TAB 1: GENERAL & COMPANY PROFILE
      ==================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#121316] border border-[#24272E] p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-4 border-b border-[#20232A]">
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <span>Personal & Organization Details</span>
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Manage your profile name and organization information across campaign reports.
              </p>
            </div>

            <form onSubmit={handleSaveGeneral} className="space-y-5 max-w-2xl">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Rao"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
                    Work Email Address
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Email
                  </span>
                </div>
                <Input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="opacity-75 cursor-not-allowed bg-[#0B0C0E]"
                />
                <p className="text-[11px] font-mono text-zinc-500">
                  Email address cannot be modified as it is linked to your billing account.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
                  Company / Agency Brand Name
                </label>
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Elevation Media & Talent India"
                  required
                />
                <p className="text-[11px] font-mono text-zinc-500">
                  This brand name appears on white-label CSV client exports and campaign receipts.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
                  Assigned Account Role
                </label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0B0C0E] border border-[#24272E]">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-zinc-200 font-semibold">
                    {currentUser?.role === 'BRAND_ADMIN'
                      ? 'BRAND_ADMIN (Full Creator Discovery & Financial Access)'
                      : 'AGENCY_MEMBER (Discovery & Campaign Management)'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSavingProfile}
                  className="text-xs font-mono font-bold"
                  leftIcon={<Check className="w-4 h-4 text-zinc-950" />}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 2: SUBSCRIPTION & PLAN USAGE
      ==================================================================== */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          {/* Active Plan Overview Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#121316] via-[#121316] to-emerald-950/20 border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-xl shadow-emerald-950/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#24272E]">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Current Active Tier
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                  {planType === 'PRO'
                    ? 'Agency Pro Plan 🚀'
                    : planType === 'STARTER'
                    ? 'Starter Plan'
                    : 'Free Trial'}
                </h2>
                <p className="text-xs font-mono text-zinc-400 max-w-xl leading-relaxed">
                  {isPro
                    ? 'Full Pan-India Tier 1, 2 & 3 city coverage, unlimited searches, client-ready CSV exports, and direct verified emails.'
                    : 'Explore Indian influencer discovery with sample credits. Upgrade to unlock direct contacts and CSV exports.'}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="text-xs font-mono text-zinc-400">Status</div>
                <div className="text-sm font-mono font-bold text-emerald-400 flex items-center sm:justify-end gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{currentUser?.subscriptionStatus === 'ACTIVE' ? 'Active Subscription' : 'Trial Active'}</span>
                </div>
                {currentUser?.planExpiresAt && (
                  <div className="text-[11px] font-mono text-zinc-400 mt-1">
                    Renewal: {formatDate(currentUser.planExpiresAt)} ({formatDaysRemaining(currentUser.planExpiresAt)})
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Workspace Telemetry Metrics */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Workspace Resources & Utilization
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="rounded-xl bg-[#0B0C0E] border border-[#24272E] p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>Shortlists Created</span>
                    <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {profile?._count?.shortlists ?? 0}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    {isPro ? 'Unlimited Available' : '2 Max on Free Trial'}
                  </div>
                </div>

                <div className="rounded-xl bg-[#0B0C0E] border border-[#24272E] p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>Active Campaigns</span>
                    <Megaphone className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {profile?._count?.campaigns ?? 0}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Budget & ROI Tracking Active
                  </div>
                </div>

                <div className="rounded-xl bg-[#0B0C0E] border border-[#24272E] p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>CSV Export Allowance</span>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {isPro ? 'Unlimited' : 'Upgrade Required'}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    With INR commercial guide rates
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Upgrade / Change CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              {!isPro ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setUpgradeModalOpen(true)}
                  className="w-full sm:w-auto text-xs font-mono font-bold py-2.5 shadow-lg shadow-emerald-950/50"
                  leftIcon={<Zap className="w-4 h-4 text-zinc-950 fill-zinc-950" />}
                >
                  Upgrade to Agency Pro (₹7,999/mo)
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => router.push('/pricing')}
                  className="w-full sm:w-auto text-xs font-mono"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  View All Plan Tiers
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 3: BILLING & RECEIPTS
      ==================================================================== */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#121316] border border-[#24272E] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#20232A]">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Billing & Transaction History</span>
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  Review all past Razorpay subscription invoices, amounts paid in INR, and receipt statuses.
                </p>
              </div>

              <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 bg-[#0B0C0E] px-3 py-1.5 rounded-lg border border-[#24272E]">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>PCI-DSS Compliant • GST Invoicing</span>
              </div>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-dashed border-[#24272E] bg-[#0B0C0E] space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#16181D] text-zinc-500 font-mono text-sm">
                  ₹
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white font-sans">No Transaction History Found</p>
                  <p className="text-xs text-zinc-400 font-mono max-w-sm mx-auto">
                    You have not completed any payments yet. When you upgrade your plan, receipts will appear here.
                  </p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono"
                    onClick={() => setUpgradeModalOpen(true)}
                  >
                    Explore Upgrade Options
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#24272E] bg-[#0B0C0E]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#16181D] text-[11px] uppercase tracking-wider text-zinc-400 border-b border-[#24272E]">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Plan / Subscription</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#20232A]">
                    {payments.map((p) => (
                      <tr key={p.orderId} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="px-4 py-3.5 text-zinc-200">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-100">{p.orderId}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyOrder(p.orderId)}
                              className="text-zinc-500 hover:text-white"
                              title="Copy Order ID"
                            >
                              {copiedOrderId === p.orderId ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {p.paymentId && (
                            <span className="text-[10px] text-zinc-500 block">
                              Ref: {p.paymentId}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-300">
                          <span className="font-medium text-white">
                            {p.plan === 'PRO' ? 'Agency Pro' : 'Starter'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-white">
                          {formatINR(p.amount / 100)}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-400">
                          {formatDate(p.createdAt)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'SUCCESS'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : p.status === 'FAILED'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                p.status === 'SUCCESS'
                                  ? 'bg-emerald-400'
                                  : p.status === 'FAILED'
                                  ? 'bg-rose-400'
                                  : 'bg-zinc-400'
                              }`}
                            />
                            <span>{p.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 4: SECURITY & CREDENTIALS
      ==================================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#121316] border border-[#24272E] p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-4 border-b border-[#20232A]">
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Password & Authentication</span>
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Update your account password to ensure maximum security for your team credentials.
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
                  New Password (min. 6 characters)
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isUpdatingPassword}
                  className="text-xs font-mono font-bold"
                  leftIcon={<Lock className="w-3.5 h-3.5 text-zinc-950" />}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          {/* Active Session & Danger Zone Card */}
          <div className="rounded-2xl bg-[#121316] border border-[#24272E] p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-4 border-b border-[#20232A]">
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Active Session & Device Security</span>
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Current active session details and account danger zone controls.
              </p>
            </div>

            <div className="rounded-xl bg-[#0B0C0E] border border-[#24272E] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Current Browser Session (Active 🟢)</span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500">
                  Signed in via JWT with 7-day cryptographic validity token.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-mono"
                onClick={handleLogout}
              >
                End Current Session
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-rose-900/40 bg-rose-950/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Danger Zone</span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                Deleting your organization account will purge all campaigns, shortlists, and historical analytics. This action cannot be undone.
              </p>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-mono text-rose-400 border-rose-900/60 hover:bg-rose-950/40"
                  onClick={() => toast.info('To permanently delete your organization account, please contact security@creatorbase.in.')}
                >
                  Request Account Deletion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal Hook */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => {
          setUpgradeModalOpen(false);
          fetchProfile();
        }}
        title="Upgrade to Agency Pro"
        description="Unlock full Pan-India Tier 1, 2 & 3 influencer intel, client-ready CSV exports, and direct verified contacts."
      />
    </div>
  );
}
