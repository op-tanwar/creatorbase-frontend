'use client';

import React, { useState, useEffect } from 'react';
import { ShortlistItem, DeliverableStage } from '@/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  IndianRupee,
  Link as LinkIcon,
  FileVideo,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { toast } from 'sonner';

interface EditDeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShortlistItem | null;
  onSave: (
    creatorId: string,
    updates: {
      stage: DeliverableStage;
      agreedFeeINR?: number | null;
      liveUrl?: string | null;
      draftUrl?: string | null;
      deliverableNotes?: string | null;
    }
  ) => Promise<void>;
}

const STAGES: { key: DeliverableStage; label: string }[] = [
  { key: 'SHORTLISTED', label: '1. Shortlisted' },
  { key: 'EMAIL_SENT', label: '2. Email Sent' },
  { key: 'COMMERCIALS_AGREED', label: '3. Commercials Agreed' },
  { key: 'DRAFT_UNDER_REVIEW', label: '4. Draft Under Review' },
  { key: 'LIVE_AND_PAID', label: '5. Live & Paid' },
];

export function EditDeliverableModal({
  isOpen,
  onClose,
  item,
  onSave,
}: EditDeliverableModalProps) {
  const [stage, setStage] = useState<DeliverableStage>('SHORTLISTED');
  const [fee, setFee] = useState<string>('');
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [draftUrl, setDraftUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setStage(item.stage || 'SHORTLISTED');
      const currentFee = item.agreedFeeINR ?? (item.assignedFeeINR ? Math.round(item.assignedFeeINR) : '');
      setFee(currentFee ? String(currentFee) : '');
      setLiveUrl(item.liveUrl || '');
      setDraftUrl(item.draftUrl || '');
      setNotes(item.deliverableNotes || item.notes || '');
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const parsedFee = fee.trim() ? parseInt(fee.replace(/[^0-9]/g, ''), 10) : null;

      await onSave(item.creatorId, {
        stage,
        agreedFeeINR: isNaN(parsedFee as number) ? null : parsedFee,
        liveUrl: liveUrl.trim() || null,
        draftUrl: draftUrl.trim() || null,
        deliverableNotes: notes.trim() || null,
      });

      toast.success(`Deliverable details saved for @${item.creator.handle}`);
      onClose();
    } catch (_err) {
      toast.error('Failed to update deliverable details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Deliverable Tracking • @${item.creator.handle}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Creator Mini Bar */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-300">
              {item.creator.handle.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                <span>{item.creator.fullName || item.creator.handle}</span>
                {item.creator.isVerified && (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                )}
              </div>
              <div className="text-[11px] font-mono text-zinc-500">
                {item.creator.city} • {item.creator.niche}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Followers</div>
            <div className="text-xs font-mono font-bold text-zinc-200">
              {item.creator.followerCount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Workflow Stage Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Workflow Stage
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as DeliverableStage)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Negotiated Commercial Fee (₹ INR) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
            <span>Agreed Commercial Fee (₹ INR)</span>
            {fee && !isNaN(parseInt(fee, 10)) && (
              <span className="font-mono text-emerald-400 normal-case font-normal">
                {formatINR(parseInt(fee, 10))}
              </span>
            )}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <IndianRupee className="h-4 w-4" />
            </div>
            <input
              type="number"
              min="0"
              placeholder="e.g. 25000"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 pl-9 pr-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Live Reel / Video URL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <FileVideo className="h-3.5 w-3.5 text-emerald-400" />
              <span>Live Reel / YouTube URL</span>
            </label>
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Test Link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <input
            type="url"
            placeholder="https://www.instagram.com/reel/C... or YouTube link"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Draft Video URL (Drive/Frame.io) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-indigo-400" />
              <span>Draft Video Review Link</span>
            </label>
            {draftUrl && (
              <a
                href={draftUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Open Draft</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <input
            type="url"
            placeholder="https://drive.google.com/... or frame.io link"
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Agency Deliverable Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-zinc-400" />
            <span>Internal Agency Notes &amp; Script Deliverables</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Approved 2nd cut with client logo at 0:03. Creator asked to pin client promo code in caption."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            Save Deliverables
          </Button>
        </div>
      </form>
    </Modal>
  );
}
