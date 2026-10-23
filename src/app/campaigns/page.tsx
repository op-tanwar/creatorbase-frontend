'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Campaign } from '@/types';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { formatFollowers, formatINR } from '@/lib/utils';
import {
  Megaphone,
  Plus,
  Loader2,
  TrendingUp,
  IndianRupee,
  Users,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/campaigns');
      if (res.data.success) {
        setCampaigns(res.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Aggregated campaign portfolio metrics
  const totalBudgetINR = campaigns.reduce((acc, c) => acc + c.budgetINR, 0);
  const totalAllocatedINR = campaigns.reduce(
    (acc, c) => acc + (c.analytics?.allocatedBudgetINR || 0),
    0
  );
  const totalReach = campaigns.reduce(
    (acc, c) => acc + (c.analytics?.totalEstimatedReach || 0),
    0
  );
  const totalCreators = campaigns.reduce(
    (acc, c) => acc + (c.analytics?.totalCreatorsCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-400" />
            Brand Campaigns & Budget Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Oversee commercial payouts, target tier 1/2 hubs, and track cumulative ROI.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          New Campaign
        </Button>
      </div>

      {/* Aggregate Metric StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Campaigns"
          value={campaigns.length}
          subtitle="Running marketing drives"
          icon={<Target className="w-5 h-5" />}
          tag="Status: Active"
          tagVariant="emerald"
        />

        <StatCard
          title="Total Budget INR"
          value={formatINR(totalBudgetINR)}
          subtitle={`Committed: ${formatINR(totalAllocatedINR)}`}
          icon={<IndianRupee className="w-5 h-5" />}
          tag={
            totalBudgetINR > 0
              ? `${Math.round((totalAllocatedINR / totalBudgetINR) * 100)}% Utilized`
              : '0% Utilized'
          }
          tagVariant="indigo"
        />

        <StatCard
          title="Targeted Reach"
          value={formatFollowers(totalReach)}
          subtitle="Combined pan-India audience"
          icon={<Users className="w-5 h-5" />}
          tag="Tier 1 & 2 Concentrated"
          tagVariant="emerald"
        />

        <StatCard
          title="Contracted Creators"
          value={totalCreators}
          subtitle="Talent with assigned fees"
          icon={<TrendingUp className="w-5 h-5" />}
          tag="Deliverables Tracked"
          tagVariant="amber"
        />
      </div>

      {/* Campaign List */}
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-16 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-emerald-400 border border-zinc-700/60">
            <Megaphone className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Campaigns Created Yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Launch your first campaign to allocate budget and link creator cohorts.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Create First Campaign
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <CampaignCard key={camp.id} campaign={camp} />
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCampaigns}
      />
    </div>
  );
}
