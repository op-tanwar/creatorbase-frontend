'use client';

import React, { useEffect, useState } from 'react';
import adminService from '@/services/adminService';
import { AdminAgency, PlanType, SubscriptionStatus } from '@/types';
import {
  Search,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Mail,
  User,
  X,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<AdminAgency[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal State
  const [selectedAgency, setSelectedAgency] = useState<AdminAgency | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State in Modal
  const [formPlan, setFormPlan] = useState<PlanType>('PRO');
  const [formStatus, setFormStatus] = useState<SubscriptionStatus>('ACTIVE');
  const [formExpiresAt, setFormExpiresAt] = useState<string>('');
  const [formIsSuspended, setFormIsSuspended] = useState<boolean>(false);
  const [formSuspensionReason, setFormSuspensionReason] = useState<string>('');

  const fetchAgencies = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAgencies({
        page,
        limit,
        search,
        plan: planFilter,
        status: statusFilter,
      });
      setAgencies(res.agencies);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      toast.error('Failed to load agencies list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, [page, planFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAgencies();
  };

  const openManageModal = (agency: AdminAgency) => {
    setSelectedAgency(agency);
    setFormPlan(agency.planType);
    setFormStatus(agency.subscriptionStatus || 'INACTIVE');
    setFormExpiresAt(agency.planExpiresAt ? agency.planExpiresAt.slice(0, 10) : '');
    setFormIsSuspended(agency.isSuspended || false);
    setFormSuspensionReason(agency.suspensionReason || '');
    setModalOpen(true);
  };

  const handleSaveAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgency) return;

    try {
      setIsSaving(true);
      const updated = await adminService.updateAgency(selectedAgency.id, {
        planType: formPlan,
        subscriptionStatus: formStatus,
        planExpiresAt: formExpiresAt ? new Date(formExpiresAt).toISOString() : null,
        isSuspended: formIsSuspended,
        suspensionReason: formIsSuspended ? formSuspensionReason || 'Suspended by admin' : null,
      });

      // Update in state
      setAgencies((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
      );

      toast.success(`Updated settings for ${selectedAgency.companyName}`);
      setModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update agency settings';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#24272E] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <span>Agencies &amp; Subscription Controls</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage organization tiers, extend plan expiry dates, or enforce account suspension.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span>Total Organizations:</span>
          <strong className="text-amber-400 font-bold text-sm">{total}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company name, founder, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#121418] border border-[#24272E] rounded-xl text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60 font-mono transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Plan Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Plan:
            </span>
            {['ALL', 'FREE_TRIAL', 'STARTER', 'PRO', 'ENTERPRISE'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPlanFilter(p);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  planFilter === p
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800'
                }`}
              >
                {p === 'ALL' ? 'All Plans' : p.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Status:
            </span>
            {['ALL', 'ACTIVE', 'INACTIVE', 'EXPIRED', 'SUSPENDED'].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                  statusFilter === s
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800'
                }`}
              >
                {s === 'ALL' ? 'All Status' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#24272E] bg-[#111317] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15171D] border-b border-[#24272E] text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Founder / Contact</th>
                <th className="py-3 px-4">Plan &amp; Status</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2027]">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-6 bg-zinc-800/60 rounded" />
                    </td>
                  </tr>
                ))
              ) : agencies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-mono">
                    No agencies match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                agencies.map((agency) => {
                  return (
                    <tr
                      key={agency.id}
                      className="hover:bg-[#15171E] transition-colors group"
                    >
                      {/* Organization */}
                      <td className="py-3.5 px-4 font-medium text-zinc-200">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold shrink-0">
                            {agency.companyName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{agency.companyName}</span>
                              {agency.isSuspended && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800/60">
                                  SUSPENDED
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500">
                              ID: {agency.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Founder */}
                      <td className="py-3.5 px-4">
                        <div className="text-zinc-300 font-medium">{agency.name}</div>
                        <div className="text-zinc-500 text-[11px] font-mono">{agency.email}</div>
                      </td>

                      {/* Plan & Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              agency.planType === 'ENTERPRISE'
                                ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50'
                                : agency.planType === 'PRO'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                                : agency.planType === 'STARTER'
                                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/50'
                                : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            }`}
                          >
                            {agency.planType}
                          </span>

                          <span
                            className={`text-[10px] font-mono flex items-center gap-1 ${
                              agency.isSuspended
                                ? 'text-rose-400'
                                : agency.subscriptionStatus === 'ACTIVE'
                                ? 'text-emerald-400'
                                : 'text-zinc-500'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                agency.isSuspended
                                  ? 'bg-rose-500'
                                  : agency.subscriptionStatus === 'ACTIVE'
                                  ? 'bg-emerald-500'
                                  : 'bg-zinc-500'
                              }`}
                            />
                            {agency.isSuspended ? 'Account Blocked' : agency.subscriptionStatus}
                          </span>
                        </div>
                      </td>

                      {/* Activity */}
                      <td className="py-3.5 px-4 font-mono text-zinc-400">
                        <div>{agency.shortlistsCount} Shortlists</div>
                        <div className="text-[11px] text-zinc-500">{agency.campaignsCount} Campaigns</div>
                      </td>

                      {/* Total Spent */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-zinc-200">
                        ₹{(agency.totalSpentINR || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 font-mono text-zinc-500 text-[11px]">
                        {new Date(agency.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openManageModal(agency)}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-colors"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#13151A] border-t border-[#24272E] text-xs font-mono">
            <span className="text-zinc-400">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 hover:bg-zinc-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subscription & Account Override Modal */}
      {modalOpen && selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#121418] border border-[#2A2E38] p-6 shadow-2xl space-y-5 text-zinc-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#24272E] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Manage Agency Controls</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {selectedAgency.companyName} ({selectedAgency.email})
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgency} className="space-y-4 text-xs">
              {/* Plan Type Override */}
              <div className="space-y-1.5">
                <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                  Subscription Plan Tier
                </label>
                <select
                  value={formPlan}
                  onChange={(e) => setFormPlan(e.target.value as PlanType)}
                  className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                >
                  <option value="FREE_TRIAL">FREE_TRIAL (14-Day Free Evaluation)</option>
                  <option value="STARTER">STARTER (₹2,999 / mo - 3 Shortlists)</option>
                  <option value="PRO">PRO (₹4,999 / mo - Unlimited Shortlists)</option>
                  <option value="ENTERPRISE">ENTERPRISE (Custom Tailored)</option>
                </select>
              </div>

              {/* Subscription Status */}
              <div className="space-y-1.5">
                <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                  Subscription Status Flag
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as SubscriptionStatus)}
                  className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                >
                  <option value="ACTIVE">ACTIVE (Full Platform Access)</option>
                  <option value="INACTIVE">INACTIVE (Trial Expired / Unpaid)</option>
                  <option value="EXPIRED">EXPIRED (Past Due Date)</option>
                </select>
              </div>

              {/* Plan Expiration Date */}
              <div className="space-y-1.5">
                <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                  Plan Expiry Date
                </label>
                <input
                  type="date"
                  value={formExpiresAt}
                  onChange={(e) => setFormExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-zinc-500 font-mono">
                  Leave blank for perpetual / indefinite access.
                </p>
              </div>

              {/* Account Suspension Switch */}
              <div className="pt-2 border-t border-[#24272E] space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Suspend Agency Account</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Instantly revokes login access and API authorization.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsSuspended}
                    onChange={(e) => setFormIsSuspended(e.target.checked)}
                    className="h-4 w-4 accent-rose-500 rounded cursor-pointer"
                  />
                </div>

                {formIsSuspended && (
                  <div className="space-y-1.5">
                    <label className="font-mono font-medium text-rose-300 uppercase tracking-wider text-[11px]">
                      Suspension Reason (Visible to User on login)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Terms violation, payment dispute, or fraudulent activity"
                      value={formSuspensionReason}
                      onChange={(e) => setFormSuspensionReason(e.target.value)}
                      className="w-full px-3 py-2 bg-[#171920] border border-rose-900/60 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#24272E]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-colors disabled:opacity-50 shadow-md shadow-amber-950"
                >
                  {isSaving ? 'Applying Changes...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
