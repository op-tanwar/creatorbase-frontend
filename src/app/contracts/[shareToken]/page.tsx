'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FileSignature,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  Building2,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function PublicContractSignPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = use(params);

  const [contract, setContract] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [legalName, setLegalName] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const fetchContract = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/public/contracts/${shareToken}`);
      if (res.data.success) {
        setContract(res.data.data);
        if (res.data.data.creator?.fullName) {
          setLegalName(res.data.data.creator.fullName);
        }
      }
    } catch (_err) {
      toast.error('Failed to load contract agreement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [shareToken]);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName.trim() || !isAgreed) {
      toast.error('Please agree to terms and enter your full legal name');
      return;
    }

    try {
      setIsSigning(true);
      const res = await api.post(`/public/contracts/${shareToken}/sign`, {
        signedByName: legalName.trim(),
      });
      if (res.data.success) {
        toast.success('Agreement digitally executed successfully!');
        setContract(res.data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sign contract');
    } finally {
      setIsSigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060709] flex items-center justify-center p-4">
        <div className="text-zinc-400 font-mono text-xs flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying encrypted contract token...</span>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-[#060709] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0C0E12] border border-white/[0.08] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-white font-sans">Contract Not Found</h1>
          <p className="text-xs font-mono text-zinc-400">
            This agreement link is invalid or has expired. Please contact the campaign agency.
          </p>
        </div>
      </div>
    );
  }

  const isSigned = contract.status === 'SIGNED';

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />

      {/* Main Container */}
      <div className="max-w-3xl w-full mx-auto space-y-6 relative z-10 my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-black text-sm">
              CB
            </div>
            <div>
              <div className="text-xs font-bold text-white font-sans">
                CreatorBase Operating System
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                Official Deliverables E-Contract
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${
              isSigned
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {isSigned ? '✓ DIGITALLY EXECUTED' : 'AWAITING DIGITAL SIGNATURE'}
          </span>
        </div>

        {/* Contract Paper Surface */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0C0E12] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Agreement Reference
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
                {contract.contractNumber}
              </h1>
              <div className="text-xs font-mono text-emerald-400 mt-0.5">
                Campaign: {contract.campaign?.title}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Total Compensation</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {formatINR(contract.compensationINR)}
              </div>
              <div className="text-[10px] font-mono text-zinc-400">Sec 194J TDS Applicable</div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#08090B] p-4 rounded-xl border border-white/[0.05] text-xs font-mono">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase">Agency / Brand</span>
              <div className="font-bold text-white mt-0.5">
                {contract.campaign?.brandName || 'CreatorBase Agency Partner'}
              </div>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] uppercase">Creator / Influencer</span>
              <div className="font-bold text-white mt-0.5">
                {contract.creator?.fullName} (@{contract.creator?.handle})
              </div>
            </div>
          </div>

          {/* Key Clauses */}
          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-zinc-500 text-[10px] uppercase">Scope of Work</span>
              <div className="font-bold text-white mt-1 text-[11px]">{contract.deliverables}</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-zinc-500 text-[10px] uppercase">Ad Usage Rights</span>
              <div className="font-bold text-emerald-400 mt-1">{contract.usageRightsDays} Days</div>
              <div className="text-[9px] text-zinc-500">Digital whitelisting</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-zinc-500 text-[10px] uppercase">Category Exclusivity</span>
              <div className="font-bold text-emerald-400 mt-1">{contract.exclusivityDays} Days</div>
              <div className="text-[9px] text-zinc-500">No direct competitors</div>
            </div>
          </div>

          {/* Terms Box */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Legal Terms &amp; Provisions
            </div>
            <div className="p-4 rounded-xl bg-[#08090B] border border-white/[0.05] max-h-48 overflow-y-auto custom-scrollbar text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-line">
              {contract.termsAndConditions}
            </div>
          </div>

          {/* Execution Section */}
          {isSigned ? (
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Legally Executed Digital Agreement</span>
              </div>
              <div className="text-zinc-300 space-y-0.5 text-[11px]">
                <div>
                  Signatory: <strong className="text-white">{contract.signedByName}</strong>
                </div>
                <div>
                  Timestamp:{' '}
                  <span className="text-zinc-400">
                    {new Date(contract.signedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                  </span>
                </div>
                <div>
                  Digital Audit ID: <code className="text-emerald-400">{contract.shareToken}</code>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSign} className="pt-4 border-t border-white/[0.08] space-y-4">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agree"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-0.5 accent-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="agree" className="text-xs font-mono text-zinc-300 cursor-pointer">
                  I, the creator, agree to fulfill the verified deliverables above in accordance with the specified usage rights, exclusivity terms, and ASCI disclosure standards.
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Signatory Full Legal Name *
                </label>
                <Input
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="Enter your full legal name"
                  required
                  className="font-mono text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isSigning || !isAgreed}
                className="w-full font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-11"
              >
                {isSigning ? 'Recording Digital Signature...' : 'Digitally Sign & Execute Agreement ✍️'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
