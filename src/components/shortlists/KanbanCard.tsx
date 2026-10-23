'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShortlistItem, DeliverableStage } from '@/types';
import { formatFollowers, formatINR, formatPercentage, getCreatorPlatformUrl, EXTERNAL_LINK_PROPS } from '@/lib/utils';
import { InstagramIcon, YoutubeIcon } from '../ui/Icons';
import {
  CheckCircle2,
  MapPin,
  TrendingUp,
  Users,
  IndianRupee,
  ExternalLink,
  Mail,
  FileVideo,
  Link as LinkIcon,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Edit2,
  Trash2,
  GripVertical,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface KanbanCardProps {
  item: ShortlistItem;
  shortlistName: string;
  onEdit: (item: ShortlistItem) => void;
  onMoveStage: (creatorId: string, targetStage: DeliverableStage) => void;
  onRemove: (creatorId: string) => void;
}

const STAGES: DeliverableStage[] = [
  'SHORTLISTED',
  'EMAIL_SENT',
  'COMMERCIALS_AGREED',
  'DRAFT_UNDER_REVIEW',
  'LIVE_AND_PAID',
];

export function KanbanCard({
  item,
  shortlistName,
  onEdit,
  onMoveStage,
  onRemove,
}: KanbanCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const currentStage = item.stage || 'SHORTLISTED';
  const stageIndex = STAGES.indexOf(currentStage);
  const prevStage = stageIndex > 0 ? STAGES[stageIndex - 1] : null;
  const nextStage = stageIndex < STAGES.length - 1 ? STAGES[stageIndex + 1] : null;

  const fee = item.agreedFeeINR ?? (item.assignedFeeINR ? Math.round(item.assignedFeeINR) : null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', item.creatorId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Pre-fill email outreach template
  const handleOpenMailto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const recipient = item.creator.businessEmail || '';
    const subject = encodeURIComponent(`Brand Collaboration Inquiry • ${item.creator.fullName || item.creator.handle}`);
    const body = encodeURIComponent(
      `Hi ${item.creator.fullName || item.creator.handle},\n\nWe discovered your profile on CreatorBase and loved your recent content in ${item.creator.city} (${item.creator.niche}).\n\nWe would love to discuss a paid collaboration for our upcoming campaign (${shortlistName}).\n\nPlease let us know your standard deliverables and rate card for 1 dedicated Instagram Reel.\n\nBest regards,\nCreatorBase Campaign Team`
    );
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative flex flex-col justify-between rounded-xl border bg-zinc-900/70 p-3.5 transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
        isDragging
          ? 'opacity-40 border-emerald-500 scale-95 shadow-xl'
          : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/95 hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Header: Drag Handle, Creator Profile, Menu */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar */}
            <a
              href={getCreatorPlatformUrl(item.creator)}
              {...EXTERNAL_LINK_PROPS}
              onClick={(e) => e.stopPropagation()}
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 transition-transform hover:scale-105"
              title={`Visit @${item.creator.handle} on live platform`}
            >
              {item.creator.avatarUrl ? (
                <Image
                  src={item.creator.avatarUrl}
                  alt={item.creator.handle}
                  fill
                  className="object-cover"
                  sizes="40px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-xs text-zinc-400">
                  {item.creator.handle.slice(0, 2).toUpperCase()}
                </div>
              )}
            </a>

            {/* Handle & Name */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <a
                  href={getCreatorPlatformUrl(item.creator)}
                  {...EXTERNAL_LINK_PROPS}
                  onClick={(e) => e.stopPropagation()}
                  className="truncate text-xs font-bold text-zinc-100 group-hover:text-emerald-400 hover:underline transition-colors"
                >
                  {item.creator.fullName || item.creator.handle}
                </a>
                {item.creator.isVerified && (
                  <span title="Audited & Platform Verified Reach" className="inline-flex items-center text-emerald-400">
                    <ShieldCheck className="h-3 w-3 shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                <a
                  href={getCreatorPlatformUrl(item.creator)}
                  {...EXTERNAL_LINK_PROPS}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-emerald-400 hover:underline"
                >
                  @{item.creator.handle}
                </a>
                <span>•</span>
                <span className="truncate text-zinc-500">{item.creator.city}</span>
              </div>
            </div>
          </div>

          {/* Quick Options Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              aria-label="Creator actions"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-6 z-30 w-36 rounded-xl border border-zinc-700 bg-zinc-950 p-1 shadow-xl">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit(item);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Edit Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onRemove(item.creatorId);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 2-Column Metrics */}
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-2 text-center mb-2.5">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
              Reach
            </div>
            <div className="text-xs font-mono font-bold text-zinc-200">
              {formatFollowers(item.creator.followerCount)}
            </div>
          </div>
          <div className="border-l border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
              Engagement
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400">
              {formatPercentage(item.creator.engagementRate)}
            </div>
          </div>
        </div>

        {/* Agreed Commercial Fee Pill */}
        <div
          onClick={() => onEdit(item)}
          className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/40 px-2.5 py-1.5 text-xs cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/40 transition-all mb-2.5"
          title="Click to edit agreed commercial fee"
        >
          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
            <IndianRupee className="h-3 w-3 text-emerald-400" />
            <span>Commercial Fee:</span>
          </span>
          <span className="font-mono font-bold text-zinc-100">
            {fee ? formatINR(fee) : <span className="text-zinc-500 italic">+ Set Fee</span>}
          </span>
        </div>

        {/* Stage-Specific Contextual Actions */}
        {currentStage === 'EMAIL_SENT' && (
          <div className="mb-2.5">
            <button
              onClick={handleOpenMailto}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20 transition-colors"
            >
              <Mail className="h-3 w-3" />
              <span>Open Mailto Template</span>
            </button>
          </div>
        )}

        {currentStage === 'DRAFT_UNDER_REVIEW' && (
          <div className="mb-2.5">
            {item.draftUrl ? (
              <a
                href={item.draftUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-colors"
              >
                <FileVideo className="h-3 w-3" />
                <span className="truncate">Review Video Draft</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            ) : (
              <button
                onClick={() => onEdit(item)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <LinkIcon className="h-3 w-3" />
                <span>+ Attach Draft Link</span>
              </button>
            )}
          </div>
        )}

        {currentStage === 'LIVE_AND_PAID' && (
          <div className="mb-2.5">
            {item.liveUrl ? (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate">View Live Post</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            ) : (
              <button
                onClick={() => onEdit(item)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-950/50 transition-colors"
              >
                <FileVideo className="h-3 w-3" />
                <span>+ Attach Live Reel URL</span>
              </button>
            )}
          </div>
        )}

        {/* Deliverable Notes Snippet */}
        {(item.deliverableNotes || item.notes) && (
          <p className="line-clamp-2 text-[11px] text-zinc-400 bg-zinc-950/40 rounded p-1.5 border border-zinc-800/60 mb-2.5">
            {item.deliverableNotes || item.notes}
          </p>
        )}
      </div>

      {/* Bottom Stage Transition Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px]">
        {prevStage ? (
          <button
            onClick={() => onMoveStage(item.creatorId, prevStage)}
            className="inline-flex items-center gap-0.5 text-zinc-400 hover:text-zinc-200 transition-colors"
            title={`Move back to ${prevStage}`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => onEdit(item)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-[10px]"
        >
          Details
        </button>

        {nextStage ? (
          <button
            onClick={() => onMoveStage(item.creatorId, nextStage)}
            className="inline-flex items-center gap-0.5 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            title={`Advance to ${nextStage}`}
          >
            <span>Advance</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 font-bold text-emerald-400 text-[10px]">
            <Check className="h-3 w-3" />
            <span>Done</span>
          </span>
        )}
      </div>
    </div>
  );
}
