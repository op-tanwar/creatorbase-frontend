'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  FileCheck2,
  AlertCircle,
  FileSignature,
} from 'lucide-react';
import { toast } from 'sonner';

interface ContractsTabProps {
  campaignId: string;
  campaignTitle: string;
  creators: any[];
}

export function ContractsTab({ campaignId, campaignTitle, creators }: ContractsTabProps) {
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [deliverables, setDeliverables] = useState('1x Dedicated Reel + 2x Stories');
  const [usageRightsDays, setUsageRightsDays] = useState('90');
  const [exclusivityDays, setExclusivityDays] = useState('30');
  const [compensationINR, setCompensationINR] = useState('25000');
  const [terms, setTerms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/campaigns/${campaignId}/contracts`);
      if (res.data.success) {
        setContracts(res.data.data || []);
      }
    } catch (_err) {
      toast.error('Failed to load campaign contracts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [campaignId]);

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId || !deliverables || !compensationINR) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/campaigns/${campaignId}/contracts`, {
        creatorId: selectedCreatorId,
        deliverables,
        usageRightsDays: parseInt(usageRightsDays, 10) || 90,
        exclusivityDays: parseInt(exclusivityDays, 10) || 30,
        compensationINR: parseFloat(compensationINR) || 25000,
        termsAndConditions: terms || undefined,
      });

      if (res.data.success) {
        toast.success('Digital agreement generated & ready for signature');
        setIsModalOpen(false);
        fetchContracts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySigningLink = (contract: any) => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://creatorbase-one.vercel.app';
    const link = `${origin}/contracts/${contract.shareToken}`;
    navigator.clipboard.writeText(link);
    setCopiedId(contract.id);
    toast.success('Signing link copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalContracted = contracts.reduce((sum, c) => sum + (c.compensationINR || 0), 0);
  const signedCount = contracts.filter((c) => c.status === 'SIGNED').length;
  const pendingCount = contracts.length - signedCount;

  return (
    <div className="space-y-6">
      {/* 1. TELEMETRY HEADER BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Total Contracted Value
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {formatINR(totalContracted)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Across {contracts.length} agreements
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Signed Agreements
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {signedCount}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Legally executed &amp; locked
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Awaiting Signature
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {pendingCount}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Outreach dispatched to creators
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Standard Usage Terms
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            90 Days
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Digital Ads &amp; Whitelisting
          </div>
        </div>
      </div>

      {/* 2. ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-emerald-400" />
            <span>Creator Deliverable Agreements &amp; E-Sign</span>
          </h3>
          <p className="text-xs font-mono text-zinc-400">
            Generate digital deliverables contracts with category exclusivity, usage rights, and audit trails.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Generate New Agreement</span>
        </Button>
      </div>

      {/* 3. CONTRACTS LIST / TABLE */}
      {isLoading ? (
        <div className="p-8 text-center text-xs font-mono text-zinc-500">
          Loading contracts...
        </div>
      ) : contracts.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white">No Contracts Generated Yet</div>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
            Generate digital influencer agreements with custom usage rights, deliverable timelines, and 1-click creator e-signatures.
          </p>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Generate First Contract</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#08090B] text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Contract #</th>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Scope of Deliverables</th>
                  <th className="py-3 px-4 text-center">Usage Rights</th>
                  <th className="py-3 px-4 text-center">Exclusivity</th>
                  <th className="py-3 px-4 text-right">Fee (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {contracts.map((item) => {
                  const creator = item.creator || {};
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {item.contractNumber}
                      </td>

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
                            <div className="text-[11px] text-zinc-500">@{creator.handle}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-zinc-300 max-w-[220px] truncate">
                        {item.deliverables}
                      </td>

                      <td className="py-3 px-4 text-center text-zinc-300">
                        {item.usageRightsDays} Days
                      </td>

                      <td className="py-3 px-4 text-center text-zinc-300">
                        {item.exclusivityDays} Days
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        {formatINR(item.compensationINR)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.status === 'SIGNED'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {item.status === 'SIGNED' ? 'DIGITALLY SIGNED' : 'PENDING SIGNATURE'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopySigningLink(item)}
                            className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/[0.05] flex items-center gap-1 text-[11px] transition-colors"
                            title="Copy E-Sign Link"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === item.id ? 'Copied' : 'Sign Link'}</span>
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
        title="Generate Influencer Deliverables Agreement"
      >
        <form onSubmit={handleCreateContract} className="space-y-4">
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

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Scope of Deliverables *
            </label>
            <Input
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="1x Dedicated Reel + 2x Stories with link sticker"
              required
              className="font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Compensation (₹ INR) *
              </label>
              <Input
                type="number"
                value={compensationINR}
                onChange={(e) => setCompensationINR(e.target.value)}
                placeholder="25000"
                required
                className="font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Ad Usage Rights
              </label>
              <select
                value={usageRightsDays}
                onChange={(e) => setUsageRightsDays(e.target.value)}
                className="w-full bg-[#08090B] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="30">30 Days</option>
                <option value="60">60 Days</option>
                <option value="90">90 Days (Standard)</option>
                <option value="180">180 Days (Extended)</option>
                <option value="365">365 Days (Perpetual)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Category Exclusivity
              </label>
              <select
                value={exclusivityDays}
                onChange={(e) => setExclusivityDays(e.target.value)}
                className="w-full bg-[#08090B] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="0">None</option>
                <option value="15">15 Days</option>
                <option value="30">30 Days (Standard)</option>
                <option value="60">60 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Custom Terms (Optional)
            </label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={3}
              placeholder="Leave blank to use CreatorBase standardized Indian agency terms with TDS 194J clause..."
              className="w-full bg-[#08090B] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

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
              {isSubmitting ? 'Generating...' : 'Generate & Issue Contract'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
