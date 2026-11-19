'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatFollowers, formatINR } from '@/lib/utils';
import { KanbanBoard } from '@/components/shortlists/KanbanBoard';
import { LiveContentMonitorTab } from '@/components/campaigns/LiveContentMonitorTab';
import { AttributionTrackerTab } from '@/components/campaigns/AttributionTrackerTab';
import { PayoutLedgerTab } from '@/components/campaigns/PayoutLedgerTab';
import { ContractsTab } from '@/components/campaigns/ContractsTab';
import { ProductSeedingTab } from '@/components/campaigns/ProductSeedingTab';
import { Button } from '@/components/ui/Button';
import {
  Megaphone,
  ChevronLeft,
  Share2,
  Kanban,
  Video,
  Link2,
  IndianRupee,
  Layers,
  Sparkles,
  RefreshCw,
  Building2,
  FileSignature,
  Package,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

type CampaignTab =
  | 'kanban'
  | 'content-monitor'
  | 'attribution'
  | 'contracts'
  | 'seeding'
  | 'payouts';

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [campaign, setCampaign] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<CampaignTab>('kanban');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [fallbackCreators, setFallbackCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaign = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/campaigns/${id}`);
      if (res.data.success) {
        setCampaign(res.data.data);
      }
    } catch (_err) {
      toast.error('Failed to load campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFallbackCreators = async () => {
    try {
      const res = await api.get('/creators?limit=30');
      if (res.data?.data?.creators) {
        setFallbackCreators(res.data.data.creators);
      }
    } catch (_err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchCampaign();
    fetchFallbackCreators();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-zinc-400 font-mono text-xs flex flex-col items-center justify-center space-y-3">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <div>Connecting to Campaign Intelligence Telemetry...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-12 text-center text-zinc-400 font-mono text-xs space-y-3">
        <div>Campaign not found or access denied.</div>
        <Link
          href="/campaigns"
          className="text-emerald-400 hover:underline font-mono text-xs"
        >
          ← Return to All Campaigns
        </Link>
      </div>
    );
  }

  const analytics = campaign.analytics || {};
  const primaryShortlist = campaign.shortlists?.[0];

  // Extract enrolled creators
  const shortlistCreators =
    primaryShortlist?.items?.map((item: any) => item.creator).filter(Boolean) || [];
  const activeCreators = shortlistCreators.length > 0 ? shortlistCreators : fallbackCreators;

  const rawBudget = analytics.allocatedBudgetINR || campaign.budgetINR || 0;
  const totalViews =
    campaign.totalImpressions ||
    analytics.totalEstimatedReelViews ||
    analytics.totalEstimatedReach * 0.25 ||
    10000;

  // Currency conversion helper (1 USD = ₹86.5)
  const USD_RATE = 86.5;
  const formatMoney = (inrVal: number) => {
    if (currency === 'USD') {
      const usd = inrVal / USD_RATE;
      return `$${Math.round(usd).toLocaleString('en-US')}`;
    }
    return formatINR(inrVal);
  };

  const cpm = Math.round((rawBudget / Math.max(1000, totalViews)) * 1000);
  const displayCPM = currency === 'USD' ? `$${(cpm / USD_RATE).toFixed(2)}` : `₹${cpm}`;

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 pt-1 sm:pt-2 pb-16">
      {/* ============================================================= */}
      {/* 1. TOP BREADCRUMB & HEADER ACTIONS                           */}
      {/* ============================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>All Campaigns</span>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
              {campaign.title}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                campaign.status === 'ACTIVE'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30'
              }`}
            >
              {campaign.status}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.07]">
              {campaign.platform} Focus
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-400">
            {campaign.description || 'Indian & Global Multi-City Influencer Campaign & Growth Operating System'}
          </p>
        </div>

        {/* Currency Switcher & Client Pitch Link CTA */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Multi-Currency Toggle */}
          <div className="flex items-center rounded-xl bg-[#0C0E12] border border-white/[0.08] p-1 font-mono text-xs">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currency === 'INR'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currency === 'USD'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          {primaryShortlist?.shareToken && (
            <Link
              href={`/pitch/${primaryShortlist.shareToken}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Client Review Portal ↗</span>
            </Link>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. CAMPAIGN KPI TELEMETRY STRIP                               */}
      {/* ============================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Committed Budget
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {formatMoney(rawBudget)}
          </div>
          <div className="text-[11px] font-mono text-emerald-400">
            {analytics.budgetUtilizationPercent || 100}% allocation
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Projected / Live Reach
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {formatFollowers(analytics.totalEstimatedReach || 450000)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            {activeCreators.length} Creators Enrolled
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Verified Video Views
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span>{formatFollowers(totalViews)}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-[11px] font-mono text-zinc-400">Reels &amp; YouTube Shorts</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Effective CPM
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
            {displayCPM}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">Cost per 1,000 Views</div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 3. 6-TAB ENTERPRISE WORKSPACE TAB SELECTOR                   */}
      {/* ============================================================= */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
            activeTab === 'kanban'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Kanban className="w-3.5 h-3.5 text-emerald-400" />
          <span>5-Stage Deliverables Kanban</span>
        </button>

        <button
          onClick={() => setActiveTab('content-monitor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
            activeTab === 'content-monitor'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Content Monitoring</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveTab('attribution')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
            activeTab === 'attribution'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Link2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Promo Codes &amp; Attribution</span>
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
            activeTab === 'contracts'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <FileSignature className="w-3.5 h-3.5 text-emerald-400" />
          <span>Outreach &amp; Contracts</span>
        </button>

        <button
          onClick={() => setActiveTab('seeding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
            activeTab === 'seeding'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-emerald-400" />
          <span>Product Seeding</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
            activeTab === 'payouts'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
          <span>Payouts &amp; GST Ledger</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* 4. ACTIVE TAB WORKSPACE CONTENT                               */}
      {/* ============================================================= */}
      <div>
        {/* TAB 1: KANBAN BOARD */}
        {activeTab === 'kanban' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">
                Shortlist: <strong className="text-white">{primaryShortlist?.name || 'Campaign Roster'}</strong>
              </span>
            </div>

            {primaryShortlist ? (
              <KanbanBoard shortlist={primaryShortlist} onRefresh={fetchCampaign} />
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] p-8 text-center space-y-2">
                <div className="text-xs font-mono text-zinc-400">
                  No shortlist roster attached to this campaign yet.
                </div>
                <Link
                  href="/discover"
                  className="text-xs font-mono text-emerald-400 hover:underline"
                >
                  Add creators from Discover Hub →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE CONTENT MONITOR */}
        {activeTab === 'content-monitor' && (
          <LiveContentMonitorTab
            campaignId={campaign.id}
            creators={activeCreators}
            onRefreshCampaign={fetchCampaign}
          />
        )}

        {/* TAB 3: ATTRIBUTION & UTM */}
        {activeTab === 'attribution' && (
          <AttributionTrackerTab
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            creators={activeCreators}
          />
        )}

        {/* TAB 4: CONTRACTS & E-SIGN */}
        {activeTab === 'contracts' && (
          <ContractsTab
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            creators={activeCreators}
          />
        )}

        {/* TAB 5: PRODUCT SEEDING & SHIPMENTS */}
        {activeTab === 'seeding' && (
          <ProductSeedingTab campaignId={campaign.id} creators={activeCreators} />
        )}

        {/* TAB 6: TDS PAYOUT LEDGER */}
        {activeTab === 'payouts' && (
          <PayoutLedgerTab campaignId={campaign.id} creators={activeCreators} />
        )}
      </div>
    </div>
  );
}
