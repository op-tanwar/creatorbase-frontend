'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '@/lib/api';
import { IndianRupee, MapPin, Megaphone, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INDIAN_CITIES = [
  'Pan-India',
  'Indore',
  'Bhopal',
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Pune',
  'Jaipur',
  'Ahmedabad',
];

export function CreateCampaignModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCampaignModalProps) {
  const [title, setTitle] = useState('');
  const [targetCity, setTargetCity] = useState('Pan-India');
  const [budgetINR, setBudgetINR] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Campaign title is required');
      return;
    }
    if (!budgetINR || parseFloat(budgetINR) <= 0) {
      toast.error('Please enter a valid campaign budget');
      return;
    }
    if (!description.trim() || description.trim().length < 5) {
      toast.error('Description must be at least 5 characters');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/campaigns', {
        title: title.trim(),
        targetCity: targetCity === 'Pan-India' ? null : targetCity,
        budgetINR: parseFloat(budgetINR),
        description: description.trim(),
      });

      if (res.data.success) {
        toast.success(`Campaign "${title.trim()}" created successfully!`);
        setTitle('');
        setBudgetINR('');
        setDescription('');
        setTargetCity('Pan-India');
        onClose();
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Campaign"
      description="Define campaign goals, budget allocation, and target geographic focus."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Campaign Title"
          placeholder="e.g. Diwali Festive Electronics Launch 2026"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          leftIcon={<Megaphone className="w-4 h-4" />}
          autoFocus
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Target City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <select
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                className="w-full appearance-none rounded-xl bg-zinc-900 border border-zinc-700/80 pl-9 pr-8 py-2.5 text-sm text-zinc-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Budget (INR)"
              type="number"
              min="1000"
              step="5000"
              placeholder="e.g. 500000"
              value={budgetINR}
              onChange={(e) => setBudgetINR(e.target.value)}
              leftIcon={<IndianRupee className="w-4 h-4" />}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
            Brief & Deliverable Objectives
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-zinc-400 pointer-events-none" />
            <textarea
              rows={3}
              placeholder="Describe the campaign strategy, deliverables required, target demographic, and timeline..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700/80 pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Launch Campaign
          </Button>
        </div>
      </form>
    </Modal>
  );
}
