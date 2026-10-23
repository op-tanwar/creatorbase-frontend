'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setQuickAddCreator,
  setShortlists,
  addCreatorToShortlistState,
} from '@/store/slices/shortlistSlice';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '@/lib/api';
import { Bookmark, IndianRupee, FileText, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

export function AddToShortlistModal() {
  const dispatch = useAppDispatch();
  const creator = useAppSelector((state) => state.shortlists.quickAddCreator);
  const shortlists = useAppSelector((state) => state.shortlists.shortlists);

  const [selectedShortlistId, setSelectedShortlistId] = useState<string>('');
  const [fee, setFee] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newShortlistName, setNewShortlistName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (shortlists.length > 0 && !selectedShortlistId) {
      setSelectedShortlistId(shortlists[0].id);
    }
  }, [shortlists, selectedShortlistId]);

  // Pre-fill suggested fee if empty when creator opened
  useEffect(() => {
    if (creator) {
      const suggested = Math.round(
        creator.followerCount * 0.35 + creator.avgReelViews * 0.12
      );
      setFee(suggested.toString());
      setNotes('1x Dedicated Reel + 2x Stories with campaign tag');
    }
  }, [creator]);

  if (!creator) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator) return;

    try {
      setIsSubmitting(true);
      let targetShortlistId = selectedShortlistId;
      let targetShortlistName = '';

      if (isCreatingNew) {
        if (!newShortlistName.trim()) {
          toast.error('Please enter a name for the new shortlist');
          setIsSubmitting(false);
          return;
        }

        const createRes = await api.post('/shortlists', {
          name: newShortlistName.trim(),
        });
        if (createRes.data.success) {
          targetShortlistId = createRes.data.data.id;
          targetShortlistName = createRes.data.data.name;
          // Refresh shortlists
          const refreshed = await api.get('/shortlists');
          if (refreshed.data.success) {
            dispatch(setShortlists(refreshed.data.data));
          }
        }
      } else {
        const found = shortlists.find((s) => s.id === targetShortlistId);
        targetShortlistName = found ? found.name : 'Shortlist';
      }

      if (!targetShortlistId) {
        toast.error('Please select or create a shortlist first');
        setIsSubmitting(false);
        return;
      }

      const assignedFeeINR = fee ? parseFloat(fee) : null;
      const res = await api.post(`/shortlists/${targetShortlistId}/creators`, {
        creatorId: creator.id,
        assignedFeeINR,
        notes: notes.trim() || null,
      });

      if (res.data.success) {
        dispatch(
          addCreatorToShortlistState({
            shortlistId: targetShortlistId,
            item: res.data.data,
          })
        );
        toast.success(
          `Added @${creator.handle} to "${targetShortlistName}" successfully!`
        );
        dispatch(setQuickAddCreator(null));
        setIsCreatingNew(false);
        setNewShortlistName('');
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Failed to add creator to shortlist';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={!!creator}
      onClose={() => dispatch(setQuickAddCreator(null))}
      title={`Add @${creator.handle} to Shortlist`}
      description={`Allocate ${creator.fullName} to an existing or new campaign roster.`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shortlist Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Select Shortlist
            </label>
            <button
              type="button"
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {isCreatingNew ? 'Pick Existing' : 'Create New'}
            </button>
          </div>

          {isCreatingNew ? (
            <Input
              placeholder="e.g., Diwali 2026 Tier-2 Food Creators"
              value={newShortlistName}
              onChange={(e) => setNewShortlistName(e.target.value)}
              autoFocus
            />
          ) : (
            <div className="relative">
              <Bookmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedShortlistId}
                onChange={(e) => setSelectedShortlistId(e.target.value)}
                className="w-full appearance-none rounded-xl bg-slate-900 border border-slate-700/80 pl-9 pr-8 py-2.5 text-sm text-slate-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {shortlists.length === 0 ? (
                  <option value="">No existing shortlists. Create one!</option>
                ) : (
                  shortlists.map((sl) => (
                    <option key={sl.id} value={sl.id}>
                      {sl.name} ({sl.creatorCount || sl.items?.length || 0} creators)
                    </option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>

        {/* Assigned Fee INR */}
        <div>
          <Input
            label="Assigned Fee (INR)"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g. 50000"
            leftIcon={<IndianRupee className="w-4 h-4" />}
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            helperText="Commercial payout allocated for this creator's deliverables."
          />
        </div>

        {/* Deliverable Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Deliverable Notes & Requirements
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <textarea
              rows={3}
              placeholder="e.g., 1x Dedicated 60s Reel, 2x Stories with promo coupon code..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700/80 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => dispatch(setQuickAddCreator(null))}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save to Shortlist
          </Button>
        </div>
      </form>
    </Modal>
  );
}
