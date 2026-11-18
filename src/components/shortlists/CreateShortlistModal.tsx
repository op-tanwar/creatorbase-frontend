'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '@/lib/api';
import { useAppDispatch } from '@/store/hooks';
import { addShortlist } from '@/store/slices/shortlistSlice';
import { Bookmark, Megaphone } from 'lucide-react';
import { Campaign } from '@/types';
import { toast } from 'sonner';

interface CreateShortlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns?: Campaign[];
  onSuccess?: () => void;
}

export function CreateShortlistModal({
  isOpen,
  onClose,
  campaigns = [],
  onSuccess,
}: CreateShortlistModalProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Shortlist name is required');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/shortlists', {
        name: name.trim(),
        campaignId: campaignId ? campaignId : null,
      });

      if (res.data.success) {
        dispatch(addShortlist(res.data.data));
        toast.success(`Created shortlist "${name.trim()}"`);
        setName('');
        setCampaignId('');
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create shortlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Shortlist"
      description="Organize influencers into cohorts for outreach, review, and client approval."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Shortlist Name"
          placeholder="e.g. Q4 Bengaluru Tech Vloggers"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<Bookmark className="w-4 h-4" />}
          autoFocus
          required
        />

        {campaigns.length > 0 && (
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
              Link to Campaign (Optional)
            </label>
            <div className="relative">
              <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full appearance-none rounded-xl bg-[#08090C] border border-white/[0.08] pl-9 pr-8 py-2.5 text-xs font-mono text-zinc-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="" className="bg-[#0C0E12]">No linked campaign (Standalone Shortlist)</option>
                {campaigns.map((camp) => (
                  <option key={camp.id} value={camp.id} className="bg-[#0C0E12]">
                    {camp.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
          >
            Create Shortlist
          </Button>
        </div>
      </form>
    </Modal>
  );
}
