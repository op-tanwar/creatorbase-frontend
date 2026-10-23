'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shortlist, ShortlistItem } from '@/types';
import { formatFollowers, formatINR, formatPercentage, getCreatorPlatformUrl, EXTERNAL_LINK_PROPS } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { InstagramIcon, YoutubeIcon } from '../ui/Icons';
import {
  Trash2,
  Download,
  IndianRupee,
  Check,
  CheckCircle2,
  Users,
  FileSpreadsheet,
  Share2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import api from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  removeCreatorFromShortlistState,
  updateShortlistItemFeeState,
} from '@/store/slices/shortlistSlice';
import { UpgradeModal } from '../subscription/UpgradeModal';
import { Modal } from '../ui/Modal';
import { toast } from 'sonner';

interface ShortlistTableProps {
  shortlist: Shortlist;
  onRefresh?: () => void;
}

export function ShortlistTable({ shortlist, onRefresh }: ShortlistTableProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editFee, setEditFee] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedPitchLink, setCopiedPitchLink] = useState(false);

  const shareToken = shortlist.shareToken || shortlist.id;
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/pitch/${shareToken}`
    : `https://creatorbase.in/pitch/${shareToken}`;

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedPitchLink(true);
    toast.success('Client pitch link copied to clipboard!');
    setTimeout(() => setCopiedPitchLink(false), 2000);
  };

  const startEdit = (item: ShortlistItem) => {
    setEditingItemId(item.id);
    setEditFee(item.assignedFeeINR?.toString() || '');
    setEditNotes(item.notes || '');
  };

  const handleSaveEdit = async (item: ShortlistItem) => {
    try {
      setIsUpdating(true);
      const parsedFee = editFee ? parseFloat(editFee) : null;
      const res = await api.patch(
        `/shortlists/${shortlist.id}/creators/${item.creatorId}`,
        {
          assignedFeeINR: parsedFee,
          notes: editNotes.trim() || null,
        }
      );

      if (res.data.success) {
        dispatch(
          updateShortlistItemFeeState({
            shortlistId: shortlist.id,
            creatorId: item.creatorId,
            assignedFeeINR: parsedFee,
            notes: editNotes.trim() || null,
          })
        );
        toast.success(`Updated fee and deliverables for @${item.creator.handle}`);
        setEditingItemId(null);
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update item');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (item: ShortlistItem) => {
    try {
      const res = await api.delete(
        `/shortlists/${shortlist.id}/creators/${item.creatorId}`
      );
      if (res.data.success) {
        dispatch(
          removeCreatorFromShortlistState({
            shortlistId: shortlist.id,
            creatorId: item.creatorId,
          })
        );
        toast.success(`Removed @${item.creator.handle} from ${shortlist.name}`);
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      toast.error('Failed to remove creator from shortlist');
    }
  };

  const handleExportCsv = async () => {
    // Plan guard: Free Trial users must upgrade to Agency Pro to export CSV
    if (user?.planType === 'FREE_TRIAL') {
      setUpgradeModalOpen(true);
      return;
    }

    try {
      setIsExporting(true);
      const response = await api.get(`/shortlists/${shortlist.id}/export-csv`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${shortlist.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_creatorbase.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Exported "${shortlist.name}" to CSV successfully!`);
    } catch (err) {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const items = shortlist.items || [];
  // Real-time calculation reflecting active inline fee editing
  const totalCost = items.reduce((acc, curr) => {
    if (editingItemId === curr.id) {
      const parsed = parseFloat(editFee);
      return acc + (isNaN(parsed) ? 0 : parsed);
    }
    return acc + (curr.assignedFeeINR || 0);
  }, 0);

  const totalFollowers = items.reduce(
    (acc, curr) => acc + (curr.creator?.followerCount || 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Header bar: Shortlist Summary & CSV Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-[#121316] border border-[#24272E] p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {shortlist.name}
            </h2>
            <Badge variant="emerald" size="sm">
              {items.length} Creators
            </Badge>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Total Combined Reach: <span className="font-semibold text-zinc-200">{formatFollowers(totalFollowers)}</span>
            {shortlist.campaign && (
              <span className="ml-2 pl-2 border-l border-zinc-800 text-indigo-400">
                Linked Campaign: {shortlist.campaign.title}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block">
              Total Budget Required
            </span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono transition-all">
              {formatINR(totalCost)}
            </span>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setShareModalOpen(true)}
            disabled={items.length === 0}
            leftIcon={<Share2 className="w-4 h-4 text-emerald-400" />}
          >
            Share Pitch Link
          </Button>

          <Button
            variant="primary"
            size="md"
            isLoading={isExporting}
            onClick={handleExportCsv}
            disabled={items.length === 0}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Table Container */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">No creators in this shortlist yet</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
            Discover verified Indian creators and use the "Shortlist" button to add them into this cohort.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Cards View (< 768px) */}
          <div className="space-y-3 md:hidden">
            {items.map((item) => {
              const c = item.creator;
              const isEditing = editingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                        <Image
                          src={c.avatarUrl}
                          alt={c.fullName}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm truncate">
                            {c.fullName}
                          </span>
                          {c.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                          {c.platform === 'INSTAGRAM' ? (
                            <InstagramIcon className="w-3 h-3 text-pink-400 shrink-0" />
                          ) : (
                            <YoutubeIcon className="w-3 h-3 text-rose-400 shrink-0" />
                          )}
                          @{c.handle}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:text-rose-400 p-1.5"
                      onClick={() => handleRemove(item)}
                      aria-label="Remove from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Badges & Metrics */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="emerald" size="sm">
                      {c.niche}
                    </Badge>
                    <Badge variant="indigo" size="sm">
                      {c.city}
                    </Badge>
                    <span className="text-xs text-zinc-300 ml-auto font-mono">
                      {formatFollowers(c.followerCount)} • {formatPercentage(c.engagementRate)}
                    </span>
                  </div>

                  {/* Fee & Notes Editable Block */}
                  <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-zinc-400">
                        Assigned Fee (INR)
                      </span>
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(item)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-mono font-bold"
                        >
                          {formatINR(item.assignedFeeINR)} (Edit)
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={editFee}
                            onChange={(e) => setEditFee(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(item);
                            }}
                            className="w-full rounded-lg bg-zinc-900 border border-emerald-500 pl-7 pr-2 py-1.5 text-xs text-white"
                            placeholder="Amount in INR"
                            autoFocus
                          />
                        </div>

                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(item);
                          }}
                          className="w-full rounded-lg bg-zinc-900 border border-emerald-500 px-2.5 py-1.5 text-xs text-white"
                          placeholder="Deliverable notes (e.g. 1 Reel + 2 Stories)"
                        />

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs py-1 px-2.5 text-zinc-400"
                            onClick={() => setEditingItemId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs py-1 px-3"
                            isLoading={isUpdating}
                            onClick={() => handleSaveEdit(item)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p
                        onClick={() => startEdit(item)}
                        className="text-xs text-zinc-400 line-clamp-1 italic cursor-pointer hover:text-zinc-200"
                      >
                        {item.notes || 'No deliverable notes. Tap to add.'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
            <table className="w-full text-left text-sm text-zinc-200">
              <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-3.5">Creator</th>
                  <th className="px-4 py-3.5">Niche & City</th>
                  <th className="px-4 py-3.5">Metrics</th>
                  <th className="px-4 py-3.5">Assigned Fee (INR)</th>
                  <th className="px-4 py-3.5">Deliverable Notes</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {items.map((item) => {
                  const c = item.creator;
                  const isEditing = editingItemId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* Creator Identity */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <a
                            href={getCreatorPlatformUrl(c)}
                            {...EXTERNAL_LINK_PROPS}
                            className="relative h-11 w-11 rounded-full overflow-hidden border border-zinc-700 shrink-0 transition-transform hover:scale-105"
                            title={`Open live profile on ${c.platform === 'YOUTUBE' ? 'YouTube' : 'Instagram'}`}
                          >
                            <Image
                              src={c.avatarUrl}
                              alt={c.fullName}
                              width={44}
                              height={44}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          </a>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <a
                                href={getCreatorPlatformUrl(c)}
                                {...EXTERNAL_LINK_PROPS}
                                className="font-bold text-white text-sm truncate hover:text-emerald-400 hover:underline transition-colors"
                              >
                                {c.fullName}
                              </a>
                              {c.isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono mt-0.5">
                              <a
                                href={getCreatorPlatformUrl(c)}
                                {...EXTERNAL_LINK_PROPS}
                                className="inline-flex items-center gap-1 hover:text-emerald-400 hover:underline"
                              >
                                {c.platform === 'INSTAGRAM' ? (
                                  <InstagramIcon className="w-3 h-3 text-pink-400 shrink-0" />
                                ) : (
                                  <YoutubeIcon className="w-3 h-3 text-rose-400 shrink-0" />
                                )}
                                @{c.handle}
                              </a>
                            </div>
                            {c.businessEmail && (
                              <span className="text-[11px] text-zinc-400 truncate block mt-0.5">
                                {c.businessEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Niche & Location */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <Badge variant="emerald" size="sm">
                            {c.niche}
                          </Badge>
                          <div className="text-xs text-zinc-400">
                            {c.city}, {c.state}
                          </div>
                        </div>
                      </td>

                      {/* Metrics */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-white flex items-center gap-1">
                            <Users className="w-3 h-3 text-zinc-400" />
                            {formatFollowers(c.followerCount)}
                          </div>
                          <div className="text-xs text-emerald-400 font-medium">
                            {formatPercentage(c.engagementRate)} eng.
                          </div>
                        </div>
                      </td>

                      {/* Assigned Fee */}
                      <td className="px-4 py-4">
                        {isEditing ? (
                          <div className="relative w-32">
                            <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              value={editFee}
                              onChange={(e) => setEditFee(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(item);
                              }}
                              className="w-full rounded-lg bg-zinc-950 border border-emerald-500 pl-7 pr-2 py-1 text-xs text-white focus:outline-none"
                              placeholder="Amount"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div
                            onClick={() => startEdit(item)}
                            className="cursor-pointer group/fee flex items-center gap-1.5"
                          >
                            <span className="font-bold text-sm text-emerald-400 font-mono">
                              {formatINR(item.assignedFeeINR)}
                            </span>
                            <span className="opacity-0 group-hover/fee:opacity-100 text-[10px] text-zinc-400 underline">
                              edit
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Notes & Client Approval */}
                      <td className="px-4 py-4 max-w-xs">
                        <div className="space-y-1">
                          {item.clientApprovalStatus && item.clientApprovalStatus !== 'PENDING' && (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                item.clientApprovalStatus === 'APPROVED'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              Client: {item.clientApprovalStatus}
                            </span>
                          )}
                          {isEditing ? (
                            <input
                              type="text"
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(item);
                              }}
                              className="w-full rounded-lg bg-zinc-950 border border-emerald-500 px-2.5 py-1 text-xs text-white focus:outline-none"
                              placeholder="e.g. 1x Reel + 2x Stories"
                            />
                          ) : (
                            <p
                              onClick={() => startEdit(item)}
                              className="text-xs text-zinc-300 truncate cursor-pointer hover:text-white"
                              title={item.notes || 'Click to add deliverables'}
                            >
                              {item.notes || (
                                <span className="text-zinc-500 italic">Add deliverable notes...</span>
                              )}
                            </p>
                          )}
                          {item.clientNotes && (
                            <p
                              className="text-[10px] font-mono text-amber-300/90 italic truncate"
                              title={`Client note: ${item.clientNotes}`}
                            >
                              Client: &ldquo;{item.clientNotes}&rdquo;
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                className="text-xs py-1 px-2.5"
                                isLoading={isUpdating}
                                onClick={() => handleSaveEdit(item)}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs py-1 px-2 text-zinc-400"
                                onClick={() => setEditingItemId(null)}
                              >
                                ✕
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs py-1 px-2 text-zinc-400 hover:text-white"
                                onClick={() => startEdit(item)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs py-1 px-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30"
                                onClick={() => handleRemove(item)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Plan Guard Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Export Shortlist to CSV"
        description="Upgrade to Agency Pro to export unlimited verified creator contacts & CSVs with live INR commercial pricing."
        feature="CSV Export"
      />

      {/* Public Share Pitch Link Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Pitch with Client"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#24272E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-zinc-300">
                Interactive Client Review Link
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live & Password-Free
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Brand clients can open this link on any browser to review verified creator metrics, approve or decline creators with 1 click, and leave feedback notes without creating an account.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Public Pitch URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 rounded-xl bg-[#0B0C0E] border border-[#262930] px-3.5 py-2.5 text-xs font-mono text-emerald-400 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyShareUrl}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-mono font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shrink-0"
              >
                {copiedPitchLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPitchLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500">
              Linked Shortlist: <strong className="text-zinc-300">{shortlist.name}</strong>
            </span>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
            >
              <span>Open Client Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
