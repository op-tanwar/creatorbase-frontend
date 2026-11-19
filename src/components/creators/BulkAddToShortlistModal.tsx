'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setShortlists } from '@/store/slices/shortlistSlice';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '@/lib/api';
import { Creator } from '@/types';
import { estimateReelCost } from '@/lib/utils';
import { Bookmark, Plus, Check, Users } from 'lucide-react';
import { toast } from 'sonner';

interface BulkAddToShortlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCreators: Creator[];
  onSuccess: () => void;
}

export function BulkAddToShortlistModal({
  isOpen,
  onClose,
  selectedCreators,
  onSuccess,
}: BulkAddToShortlistModalProps) {
  const dispatch = useAppDispatch();
  const shortlists = useAppSelector((state) => state.shortlists.shortlists);

  const [selectedShortlistId, setSelectedShortlistId] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newShortlistName, setNewShortlistName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (shortlists.length > 0 && !selectedShortlistId) {
      setSelectedShortlistId(shortlists[0].id);
    }
  }, [shortlists, selectedShortlistId]);

  if (!isOpen || selectedCreators.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      let targetShortlistId = selectedShortlistId;
      let targetShortlistName = '';

      if (isCreatingNew) {
        if (!newShortlistName.trim()) {
          toast.error('Please enter a name for the new campaign shortlist');
          setIsSubmitting(false);
          return;
        }

        const createRes = await api.post('/shortlists', {
          name: newShortlistName.trim(),
        });
        if (createRes.data.success) {
          targetShortlistId = createRes.data.data.id;
          targetShortlistName = createRes.data.data.name;
        } else {
          throw new Error('Failed to create new shortlist');
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

      // Add each creator in parallel with estimated commercial rates
      const addPromises = selectedCreators.map((creator) => {
        const assignedFeeINR = estimateReelCost(creator);
        return api
          .post(`/shortlists/${targetShortlistId}/creators`, {
            creatorId: creator.id,
            assignedFeeINR,
            notes: 'Batch imported from Discover Hub',
          })
          .catch((err) => {
            // Log individual errors (e.g. if already in shortlist) without failing whole batch
            return { error: true, creatorId: creator.id, message: err.message };
          });
      });

      await Promise.all(addPromises);

      // Refresh shortlists in Redux
      const refreshed = await api.get('/shortlists');
      if (refreshed.data.success) {
        dispatch(setShortlists(refreshed.data.data));
      }

      toast.success(
        `Added ${selectedCreators.length} creator${
          selectedCreators.length > 1 ? 's' : ''
        } to "${targetShortlistName}"!`
      );
      onSuccess();
      onClose();
      setIsCreatingNew(false);
      setNewShortlistName('');
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Failed to add creators to shortlist';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add ${selectedCreators.length} Creator${
        selectedCreators.length > 1 ? 's' : ''
      } to Campaign Shortlist`}
      description="Select an existing roster or spin up a new campaign cohort to batch allocate these creators."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selected Creators Avatar Stack Preview */}
        <div className="rounded-xl border border-white/[0.08] bg-[#08090C] p-3 flex items-center justify-between">
          <div className="flex items-center -space-x-2 overflow-hidden">
            {selectedCreators.slice(0, 7).map((c) => (
              <div
                key={c.id}
                className="relative inline-block h-8 w-8 rounded-full ring-2 ring-[#0C0E12] overflow-hidden bg-zinc-800 shrink-0"
              >
                {c.avatarUrl ? (
                  <Image
                    src={c.avatarUrl}
                    alt={c.fullName}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-mono text-[10px] text-zinc-300">
                    {c.fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            {selectedCreators.length > 7 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 ring-2 ring-[#0C0E12] text-xs font-mono font-bold">
                +{selectedCreators.length - 7}
              </div>
            )}
          </div>
          <span className="text-xs font-mono text-zinc-400">
            <strong className="text-white font-bold">{selectedCreators.length}</strong> selected
          </span>
        </div>

        {/* Shortlist Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Select Shortlist
            </label>
            <button
              type="button"
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreatingNew ? 'Pick Existing' : 'Create New'}</span>
            </button>
          </div>

          {isCreatingNew ? (
            <Input
              placeholder="e.g., Q4 Tech Launch / Diwali Fashion Roster"
              value={newShortlistName}
              onChange={(e) => setNewShortlistName(e.target.value)}
              autoFocus
              className="font-mono text-xs"
            />
          ) : shortlists.length > 0 ? (
            <select
              value={selectedShortlistId}
              onChange={(e) => setSelectedShortlistId(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0C0E12] px-3.5 py-2.5 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
            >
              {shortlists.map((sl) => (
                <option key={sl.id} value={sl.id}>
                  {sl.name} ({sl.items?.length || 0} creators)
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[0.1] p-3 text-center text-xs font-mono text-zinc-500">
              No existing shortlists. Click &quot;Create New&quot; above.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="font-mono text-xs border-white/[0.08]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Bookmark className="w-3.5 h-3.5" />}
            className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
          >
            {isSubmitting ? 'Adding...' : `Add ${selectedCreators.length} Creators`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
