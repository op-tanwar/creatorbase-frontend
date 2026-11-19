'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  IndianRupee,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Trash2,
  CreditCard,
  Building2,
  FileCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface PayoutLedgerTabProps {
  campaignId: string;
  creators: any[];
}

export function PayoutLedgerTab({ campaignId, creators }: PayoutLedgerTabProps) {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [grossFeeINR, setGrossFeeINR] = useState('25000');
  const [tdsSection, setTdsSection] = useState<'194J' | '194C'>('194J');
  const [advancePaidINR, setAdvancePaidINR] = useState('0');
  const [panNumber, setPanNumber] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayouts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/campaigns/${campaignId}/payouts`);
      if (res.data.success) {
        setPayouts(res.data.data || []);
      }
    } catch (_err) {
      toast.error('Failed to load campaign payout ledger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [campaignId]);

  const handleCreatePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId || !grossFeeINR) {
      toast.error('Please select creator and enter gross fee');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/campaigns/${campaignId}/payouts`, {
        creatorId: selectedCreatorId,
        grossFeeINR: parseFloat(grossFeeINR),
        tdsSection,
        advancePaidINR: parseFloat(advancePaidINR) || 0,
        panNumber: panNumber.toUpperCase() || undefined,
        paymentRef: paymentRef || undefined,
      });

      if (res.data.success) {
        toast.success('Payout entry recorded with TDS computation');
        setIsModalOpen(false);
        setGrossFeeINR('25000');
        setAdvancePaidINR('0');
        setPanNumber('');
        setPaymentRef('');
        fetchPayouts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save payout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettlePayout = async (payoutId: string) => {
    const ref = prompt('Enter Bank IMPS / NEFT UTR Reference for settlement:', `IMPS-${Date.now()}`);
    if (ref === null) return;

    try {
      const res = await api.patch(`/campaigns/${campaignId}/payouts/${payoutId}/settle`, {
        paymentRef: ref,
      });
      if (res.data.success) {
        toast.success('Payout marked as fully settled');
        fetchPayouts();
      }
    } catch (_err) {
      toast.error('Failed to settle payout');
    }
  };

  const handleDeletePayout = async (payoutId: string) => {
    if (!confirm('Remove this payout ledger entry?')) return;
    try {
      await api.delete(`/campaigns/${campaignId}/payouts/${payoutId}`);
      toast.success('Payout entry deleted');
      fetchPayouts();
    } catch (_err) {
      toast.error('Failed to delete payout');
    }
  };

  const totalGross = payouts.reduce((sum, p) => sum + (p.grossFeeINR || 0), 0);
  const totalTDS = payouts.reduce((sum, p) => sum + (p.tdsAmountINR || 0), 0);
  const totalNet = payouts.reduce((sum, p) => sum + (p.netPayableINR || 0), 0);
  const totalAdvance = payouts.reduce((sum, p) => sum + (p.advancePaidINR || 0), 0);
  const totalBalanceDue = payouts.reduce((sum, p) => sum + (p.balanceDueINR || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. TELEMETRY HEADER BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Total Gross Fee
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {formatINR(totalGross)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Agreed creator invoices
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90">
            TDS Withheld (194J/194C)
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
            {formatINR(totalTDS)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Deposited to Govt of India
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Net Creator Payable
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {formatINR(totalNet)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Gross minus TDS
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Advance Dispatched
          </div>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">
            {formatINR(totalAdvance)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Pre-production escrow
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/90">
            Outstanding Balance
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
            {formatINR(totalBalanceDue)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Due on asset go-live
          </div>
        </div>
      </div>

      {/* 2. REGULATORY COMPLIANCE CALLOUT */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#0C0E12] to-transparent border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Indian Income Tax Act Compliance: Section 194J &amp; 194C</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 font-mono">
                FY 2026-27 Compliant
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Agency withholding tax: 10% under Section 194J (Fees for Professional / Influencer Services) or 2% under Section 194C (Production Contracts). Auto-computed into net payable creator remittances.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Add Payout Entry</span>
          </Button>
        </div>
      </div>

      {/* 3. PAYOUT LEDGER TABLE */}
      {isLoading ? (
        <div className="p-8 text-center text-xs font-mono text-zinc-500">
          Loading creator payout ledger...
        </div>
      ) : payouts.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white">No Payout Records in Ledger</div>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
            Record creator compensation with automated TDS withholding (10% or 2%) and track advance vs balance due.
          </p>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Record First Payout</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#08090B] text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Creator / PAN</th>
                  <th className="py-3 px-4 text-right">Gross Fee</th>
                  <th className="py-3 px-4 text-center">TDS Section</th>
                  <th className="py-3 px-4 text-right">TDS (₹)</th>
                  <th className="py-3 px-4 text-right">Net Payable</th>
                  <th className="py-3 px-4 text-right">Advance Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {payouts.map((item) => {
                  const creator = item.creator || {};
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {creator.avatarUrl ? (
                            <img
                              src={creator.avatarUrl}
                              alt={creator.fullName || creator.handle}
                              className="w-7 h-7 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                              {(creator.fullName || creator.handle || 'C')[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white text-xs">
                              {creator.fullName || creator.handle}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              PAN: <span className="text-zinc-200">{item.panNumber || 'ABCDE1234F'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-white">
                        {formatINR(item.grossFeeINR)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                          Sec {item.tdsSection} ({item.tdsRate}%)
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-amber-400">
                        -{formatINR(item.tdsAmountINR)}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-white">
                        {formatINR(item.netPayableINR)}
                      </td>

                      <td className="py-3 px-4 text-right text-cyan-400 font-bold">
                        {formatINR(item.advancePaidINR)}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        {formatINR(item.balanceDueINR)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.payoutStatus === 'FULLY_SETTLED'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : item.payoutStatus === 'ADVANCE_PAID'
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {item.payoutStatus === 'FULLY_SETTLED'
                            ? 'FULLY SETTLED'
                            : item.payoutStatus === 'ADVANCE_PAID'
                            ? 'ADVANCE DISPATCHED'
                            : 'PENDING'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.balanceDueINR > 0 && (
                            <button
                              onClick={() => handleSettlePayout(item.id)}
                              className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold transition-colors"
                              title="Settle Outstanding Balance"
                            >
                              Settle Due
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePayout(item.id)}
                            className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            title="Delete Payout Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Creator Payout & TDS Entry"
      >
        <form onSubmit={handleCreatePayout} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Select Creator *
            </label>
            <select
              value={selectedCreatorId}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
              required
              className="w-full bg-[#08090B] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="">-- Choose Campaign Creator --</option>
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName || c.handle} (@{c.handle})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Gross Commercial Fee (₹ INR) *
              </label>
              <Input
                type="number"
                value={grossFeeINR}
                onChange={(e) => setGrossFeeINR(e.target.value)}
                placeholder="25000"
                required
                className="font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Indian TDS Section
              </label>
              <select
                value={tdsSection}
                onChange={(e) => setTdsSection(e.target.value as any)}
                className="w-full bg-[#08090B] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="194J">Sec 194J (10% - Professional / Influencer)</option>
                <option value="194C">Sec 194C (2% - Production Contracts)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Advance Paid (₹ INR)
              </label>
              <Input
                type="number"
                value={advancePaidINR}
                onChange={(e) => setAdvancePaidINR(e.target.value)}
                placeholder="0"
                className="font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Creator PAN Number
              </label>
              <Input
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="font-mono text-xs uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Payment Reference / IMPS UTR
            </label>
            <Input
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              placeholder="e.g. IMPS-4129849204"
              className="font-mono text-xs"
            />
          </div>

          {/* Quick Real-Time Preview */}
          {grossFeeINR && (
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-[11px] font-mono space-y-1">
              <div className="text-zinc-400 flex justify-between">
                <span>Gross Fee:</span>
                <span className="text-white font-bold">{formatINR(parseFloat(grossFeeINR) || 0)}</span>
              </div>
              <div className="text-zinc-400 flex justify-between">
                <span>TDS ({tdsSection === '194C' ? '2%' : '10%'}):</span>
                <span className="text-amber-400 font-bold">
                  -{formatINR(((parseFloat(grossFeeINR) || 0) * (tdsSection === '194C' ? 0.02 : 0.1)))}
                </span>
              </div>
              <div className="text-zinc-400 flex justify-between border-t border-white/[0.05] pt-1">
                <span>Net Payable:</span>
                <span className="text-emerald-400 font-bold">
                  {formatINR(
                    (parseFloat(grossFeeINR) || 0) -
                      (parseFloat(grossFeeINR) || 0) * (tdsSection === '194C' ? 0.02 : 0.1)
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="font-mono text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
            >
              {isSubmitting ? 'Recording...' : 'Record Payout Entry'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
