'use client';

import React, { useEffect, useState } from 'react';
import adminService from '@/services/adminService';
import { AdminTransaction } from '@/types';
import {
  Receipt,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRevenuePage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getTransactions({
        page,
        limit,
        search,
        status: statusFilter,
      });
      setTransactions(res.transactions);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      toast.error('Failed to load transaction ledger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error('No transactions available to export');
      return;
    }

    const headers = [
      'Order ID',
      'Payment ID',
      'Agency Name',
      'User Name',
      'Email',
      'Plan Tier',
      'Amount (INR)',
      'Currency',
      'Status',
      'Created At',
    ];

    const rows = transactions.map((t) => [
      `"${t.orderId}"`,
      `"${t.paymentId || 'N/A'}"`,
      `"${t.user?.companyName || 'N/A'}"`,
      `"${t.user?.name || 'N/A'}"`,
      `"${t.user?.email || 'N/A'}"`,
      `"${t.plan}"`,
      t.amountINR,
      `"${t.currency}"`,
      `"${t.status}"`,
      `"${new Date(t.createdAt).toISOString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `creatorbase-revenue-ledger-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Transaction ledger exported to CSV');
  };

  const successfulTxns = transactions.filter((t) => t.status === 'SUCCESS');
  const totalVolumeINR = successfulTxns.reduce((acc, t) => acc + t.amountINR, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#24272E] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <span>Platform Revenue &amp; Razorpay Ledger</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Auditable transaction logs, payment signatures, and billing reconciliation records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-[#111317] border border-[#24272E] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
              Total Logged Transactions
            </span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{total}</div>
          </div>
        </div>

        <div className="rounded-xl bg-[#111317] border border-[#24272E] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
              Page Successful Volume
            </span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
              ₹{totalVolumeINR.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#111317] border border-[#24272E] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
              Gateway Provider
            </span>
            <div className="text-sm font-bold font-mono text-zinc-200 mt-0.5">
              Razorpay India (INR)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID, payment ID, or agency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#121418] border border-[#24272E] rounded-xl text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60 font-mono transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 transition-colors shadow-sm"
          >
            Filter
          </button>
        </form>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {['ALL', 'SUCCESS', 'FAILED', 'CREATED'].map((s) => (
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
              {s === 'ALL' ? 'All Transactions' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-xl border border-[#24272E] bg-[#111317] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15171D] border-b border-[#24272E] text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Order &amp; Payment IDs</th>
                <th className="py-3 px-4">Agency / Customer</th>
                <th className="py-3 px-4">Subscription Plan</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2027]">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4">
                      <div className="h-6 bg-zinc-800/60 rounded" />
                    </td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => {
                  return (
                    <tr
                      key={txn.id}
                      className="hover:bg-[#15171E] transition-colors"
                    >
                      {/* Order & Payment IDs */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                          <span>{txn.orderId}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {txn.paymentId ? `PayID: ${txn.paymentId}` : 'Payment Pending'}
                        </div>
                      </td>

                      {/* Agency / Customer */}
                      <td className="py-3.5 px-4">
                        <div className="text-zinc-200 font-medium">{txn.user?.companyName || 'N/A'}</div>
                        <div className="text-[11px] font-mono text-zinc-400">
                          {txn.user?.name} ({txn.user?.email})
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {txn.plan}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                        ₹{txn.amountINR.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            txn.status === 'SUCCESS'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                              : txn.status === 'FAILED'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                          }`}
                        >
                          {txn.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {txn.status === 'FAILED' && <XCircle className="w-3 h-3 text-rose-400" />}
                          {txn.status === 'CREATED' && <Clock className="w-3 h-3 text-amber-400" />}
                          <span>{txn.status}</span>
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                        <div>{new Date(txn.createdAt).toLocaleDateString()}</div>
                        <div className="text-zinc-500">
                          {new Date(txn.createdAt).toLocaleTimeString()}
                        </div>
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
    </div>
  );
}
