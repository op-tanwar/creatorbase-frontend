'use client';

import React, { useState, useEffect } from 'react';
import { Shortlist, ShortlistItem, DeliverableStage } from '@/types';
import { KanbanCard } from './KanbanCard';
import { EditDeliverableModal } from './EditDeliverableModal';
import { formatINR } from '@/lib/utils';
import {
  Kanban,
  Sparkles,
  IndianRupee,
  Video,
  CheckCircle2,
  Users,
  Clock,
  Plus,
  RefreshCw,
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface KanbanBoardProps {
  shortlist: Shortlist;
  onRefresh?: () => void;
}

interface ColumnConfig {
  key: DeliverableStage;
  title: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    key: 'SHORTLISTED',
    title: 'Shortlisted',
    dotColor: 'bg-zinc-400',
    badgeBg: 'bg-zinc-900/80',
    badgeText: 'text-zinc-300',
    badgeBorder: 'border-zinc-800',
    description: 'Initial creator selection & audit',
  },
  {
    key: 'EMAIL_SENT',
    title: 'Outreach Sent',
    dotColor: 'bg-sky-400',
    badgeBg: 'bg-sky-950/30',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-800/40',
    description: 'Collab inquiry & rate kit requested',
  },
  {
    key: 'COMMERCIALS_AGREED',
    title: 'Commercials Agreed',
    dotColor: 'bg-amber-400',
    badgeBg: 'bg-amber-950/30',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-800/40',
    description: 'Agreed INR payout & deliverables locked',
  },
  {
    key: 'DRAFT_UNDER_REVIEW',
    title: 'Draft Under Review',
    dotColor: 'bg-indigo-400',
    badgeBg: 'bg-indigo-950/30',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-800/40',
    description: 'Reel / video cut submitted for brand QA',
  },
  {
    key: 'LIVE_AND_PAID',
    title: 'Live & Paid',
    dotColor: 'bg-emerald-400',
    badgeBg: 'bg-emerald-950/40',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-800/50',
    description: 'Reel published live & payout disbursed',
  },
];

export function KanbanBoard({ shortlist, onRefresh }: KanbanBoardProps) {
  const [items, setItems] = useState<ShortlistItem[]>(shortlist.items || []);
  const [dragOverColumn, setDragOverColumn] = useState<DeliverableStage | null>(null);
  const [editingItem, setEditingItem] = useState<ShortlistItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setItems(shortlist.items || []);
  }, [shortlist.items]);

  // Stage grouping
  const getItemsForStage = (stage: DeliverableStage) => {
    return items.filter((it) => (it.stage || 'SHORTLISTED') === stage);
  };

  // Telemetry computations
  const totalAllocatedBudgetINR = items.reduce((sum, it) => {
    const fee = it.agreedFeeINR ?? (it.assignedFeeINR ? Math.round(it.assignedFeeINR) : 0);
    return sum + fee;
  }, 0);

  const livePostsCount = items.filter(
    (it) => it.liveUrl && it.liveUrl.trim().length > 0
  ).length;

  const liveAndPaidCount = items.filter((it) => it.stage === 'LIVE_AND_PAID').length;
  const progressPercent = items.length > 0 ? Math.round((liveAndPaidCount / items.length) * 100) : 0;

  // Optimistic Stage update
  const handleMoveStage = async (creatorId: string, newStage: DeliverableStage) => {
    const previousItems = [...items];

    // Optimistically update local state
    setItems((prev) =>
      prev.map((it) =>
        it.creatorId === creatorId
          ? { ...it, stage: newStage, updatedAt: new Date().toISOString() }
          : it
      )
    );

    try {
      setIsUpdating(true);
      await api.patch(`/shortlists/${shortlist.id}/items/${creatorId}/stage`, {
        stage: newStage,
      });
      toast.success(`Moved to ${newStage.replace(/_/g, ' ')}`);
      if (onRefresh) onRefresh();
    } catch (_err) {
      toast.error('Failed to move stage. Reverting...');
      setItems(previousItems);
    } finally {
      setIsUpdating(false);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent, colStage: DeliverableStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colStage) {
      setDragOverColumn(colStage);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: DeliverableStage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const creatorId = e.dataTransfer.getData('text/plain');
    if (!creatorId) return;

    const currentItem = items.find((it) => it.creatorId === creatorId);
    if (!currentItem || (currentItem.stage || 'SHORTLISTED') === targetStage) {
      return;
    }

    await handleMoveStage(creatorId, targetStage);
  };

  // Full Details Save from Modal
  const handleSaveDeliverables = async (
    creatorId: string,
    updates: {
      stage: DeliverableStage;
      agreedFeeINR?: number | null;
      liveUrl?: string | null;
      draftUrl?: string | null;
      deliverableNotes?: string | null;
    }
  ) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((it) =>
        it.creatorId === creatorId
          ? {
              ...it,
              stage: updates.stage,
              agreedFeeINR: updates.agreedFeeINR,
              assignedFeeINR: updates.agreedFeeINR !== null && updates.agreedFeeINR !== undefined ? Number(updates.agreedFeeINR) : it.assignedFeeINR,
              liveUrl: updates.liveUrl,
              draftUrl: updates.draftUrl,
              deliverableNotes: updates.deliverableNotes,
            }
          : it
      )
    );

    await api.patch(`/shortlists/${shortlist.id}/items/${creatorId}/stage`, updates);
    if (onRefresh) onRefresh();
  };

  // Remove creator from shortlist
  const handleRemoveCreator = async (creatorId: string) => {
    try {
      await api.delete(`/shortlists/${shortlist.id}/creators/${creatorId}`);
      setItems((prev) => prev.filter((it) => it.creatorId !== creatorId));
      toast.success('Creator removed from shortlist');
      if (onRefresh) onRefresh();
    } catch (_err) {
      toast.error('Failed to remove creator');
    }
  };

  return (
    <div className="space-y-6">
      {/* Telemetry Rollup Banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            <span>Active Deliverables</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
            {items.length} Creators
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Across 5 workflow stages</div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
            <span>Allocated Budget</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
            {formatINR(totalAllocatedBudgetINR)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Negotiated creator fees</div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Video className="h-3.5 w-3.5 text-indigo-400" />
            <span>Live Published Content</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 flex items-center gap-2">
            <span>{livePostsCount}</span>
            <span className="text-xs font-mono text-zinc-500 font-normal">/ {items.length}</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Verified Reels &amp; Videos</div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Campaign Execution</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
            {progressPercent}% Complete
          </div>
          <div className="mt-1.5 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start min-h-[600px]">
        {COLUMNS.map((col) => {
          const colItems = getItemsForStage(col.key);
          const colFeeTotal = colItems.reduce((acc, it) => {
            const fee = it.agreedFeeINR ?? (it.assignedFeeINR ? Math.round(it.assignedFeeINR) : 0);
            return acc + fee;
          }, 0);
          const isOver = dragOverColumn === col.key;

          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
              className={`flex flex-col rounded-2xl border transition-all duration-200 min-h-[500px] p-3 ${
                isOver
                  ? 'border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                  : 'border-zinc-800/80 bg-zinc-950/40'
              }`}
            >
              {/* Column Header */}
              <div className="mb-3 pb-3 border-b border-zinc-800/60">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                    <h3 className="text-xs font-bold tracking-tight text-zinc-100">
                      {col.title}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold ${col.badgeBg} ${col.badgeText} ${col.badgeBorder}`}
                  >
                    {colItems.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Subtotal:</span>
                  <span className="text-zinc-300 font-semibold">{formatINR(colFeeTotal)}</span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-2.5">
                {colItems.map((item) => (
                  <KanbanCard
                    key={item.creatorId}
                    item={item}
                    shortlistName={shortlist.name}
                    onEdit={(it) => setEditingItem(it)}
                    onMoveStage={handleMoveStage}
                    onRemove={handleRemoveCreator}
                  />
                ))}

                {colItems.length === 0 && (
                  <div
                    className={`flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/80 p-4 text-center transition-colors ${
                      isOver ? 'border-emerald-500/50 bg-emerald-950/20' : 'bg-zinc-900/10'
                    }`}
                  >
                    <p className="text-[11px] text-zinc-500">
                      {isOver ? 'Drop creator here' : 'No creators in this stage'}
                    </p>
                    <span className="text-[10px] text-zinc-600 mt-1">
                      Drag cards here to update
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Deliverable Modal */}
      <EditDeliverableModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onSave={handleSaveDeliverables}
      />
    </div>
  );
}
