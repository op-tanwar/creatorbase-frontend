'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Creator } from '@/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { estimateReelCost } from '@/lib/utils';
import api from '@/lib/api';
import { Mail, Send, Sparkles, Check, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface SendPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator | null;
}

export function SendPitchModal({ isOpen, onClose, creator }: SendPitchModalProps) {
  const [deliverable, setDeliverable] = useState('1x Dedicated Reel + 2x Stories');
  const [offerINR, setOfferINR] = useState('');
  const [brandName, setBrandName] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (creator) {
      const estimatedFee = estimateReelCost(creator);
      setOfferINR(estimatedFee.toString());
      setBrandName('CreatorBase Partner Brand');
      setCustomSubject(`Collaboration Proposal: Brand Partner x @${creator.handle}`);
      setCustomBody(
        `Hi ${creator.fullName},\n\nWe love your high-engagement content in the ${creator.niche} space across ${creator.city}.\n\nWe'd love to partner with you for our upcoming brand campaign!\n\nDeliverable: 1x Dedicated Reel + 2x Stories\nCommercial Offer: ₹${estimatedFee.toLocaleString('en-IN')}\n\nPlease let us know if you're open for collaborations this month.`
      );
    }
  }, [creator]);

  if (!isOpen || !creator) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSending(true);
      const res = await api.post('/outreach/send', {
        creatorId: creator.id,
        deliverable,
        offerINR: offerINR ? parseFloat(offerINR) : undefined,
        brandName: brandName.trim(),
        customSubject: customSubject.trim(),
        customBody: customBody.trim(),
      });

      if (res.data.success) {
        toast.success(`Collaboration pitch sent to @${creator.handle}!`);
        onClose();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to dispatch pitch';
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Direct Collaboration Pitch — @${creator.handle}`}
      description="Send a verified collaboration pitch directly to this creator's business inbox with automated tracking."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Creator Identity Header */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#08090C] border border-white/[0.08]">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-zinc-800 ring-1 ring-white/10 shrink-0">
            {creator.avatarUrl ? (
              <Image
                src={creator.avatarUrl}
                alt={creator.fullName}
                width={40}
                height={40}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-mono text-xs text-white">
                {creator.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white truncate font-sans">{creator.fullName}</div>
            <div className="text-xs font-mono text-zinc-400">
              Recipient: <span className="text-emerald-400">{creator.businessEmail || 'Direct Agency Pipeline'}</span>
            </div>
          </div>
        </div>

        {/* Deliverables & Commercial Offer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Deliverables Package
            </label>
            <input
              type="text"
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
              className="w-full h-9 rounded-lg bg-[#0C0E12] border border-white/[0.08] px-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
              placeholder="e.g. 1x Dedicated Reel + 2x Stories"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Commercial Offer (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">₹</span>
              <input
                type="number"
                value={offerINR}
                onChange={(e) => setOfferINR(e.target.value)}
                className="w-full h-9 rounded-lg bg-[#0C0E12] border border-white/[0.08] pl-7 pr-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                placeholder="25000"
              />
            </div>
          </div>
        </div>

        {/* Email Subject */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
            Email Subject
          </label>
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            className="w-full h-9 rounded-lg bg-[#0C0E12] border border-white/[0.08] px-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
            required
          />
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
            Pitch Message Body
          </label>
          <textarea
            rows={5}
            value={customBody}
            onChange={(e) => setCustomBody(e.target.value)}
            className="w-full rounded-lg bg-[#0C0E12] border border-white/[0.08] p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 focus:outline-none leading-relaxed"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSending}
            className="font-mono text-xs border-white/[0.08]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSending}
            leftIcon={<Send className="w-3.5 h-3.5" />}
            className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
          >
            {isSending ? 'Dispatching...' : 'Dispatch Collaboration Pitch'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
