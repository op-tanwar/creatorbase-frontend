'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  Link2,
  Copy,
  Check,
  Plus,
  Percent,
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  Trash2,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

interface AttributionTrackerTabProps {
  campaignId: string;
  campaignTitle: string;
  creators: any[];
}

export function AttributionTrackerTab({
  campaignId,
  campaignTitle,
  creators,
}: AttributionTrackerTabProps) {
  const [attributions, setAttributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [campaignCode, setCampaignCode] = useState('');
  const [creatorSlug, setCreatorSlug] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('https://creatorbase.in');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAttributions = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/campaigns/${campaignId}/attribution`);
      if (res.data.success) {
        setAttributions(res.data.data || []);
      }
    } catch (_err) {
      toast.error('Failed to load campaign attribution links');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributions();
    if (campaignTitle) {
      setCampaignCode(
        campaignTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  }, [campaignId, campaignTitle]);

  const handleCreateAttribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId || !campaignCode || !creatorSlug) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/campaigns/${campaignId}/attribution`, {
        creatorId: selectedCreatorId,
        campaignCode: campaignCode.toLowerCase(),
        creatorSlug: creatorSlug.toLowerCase(),
        destinationUrl,
        promoCode: promoCode.toUpperCase() || `${creatorSlug.toUpperCase()}${discountPercent}`,
        discountPercent: parseInt(discountPercent, 10) || 15,
      });

      if (res.data.success) {
        toast.success('Attribution link & promo code registered');
        setIsModalOpen(false);
        setCreatorSlug('');
        setPromoCode('');
        fetchAttributions();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create tracking link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = (item: any) => {
    // Generate public redirect URL
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://creatorbase-one.vercel.app';
    // Redirect through API or full URL
    const fullLink = `${origin}/api/r/${item.campaignCode}/${item.creatorSlug}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedId(item.id);
    toast.success('UTM tracking link copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateMetric = async (attributionId: string, clicks: number, conversions: number, revenueINR: number) => {
    try {
      await api.post(`/campaigns/${campaignId}/attribution/${attributionId}/record`, {
        clicks,
        conversions,
        revenueINR,
      });
      toast.success(clicks > 0 ? '+1 Live Click Recorded' : '+1 Verified Order (₹1,500) Recorded');
      fetchAttributions();
    } catch (_err) {
      toast.error('Failed to record simulation metric');
    }
  };

  const handleDelete = async (attributionId: string) => {
    if (!confirm('Delete this attribution tracking link?')) return;
    try {
      await api.delete(`/campaigns/${campaignId}/attribution/${attributionId}`);
      toast.success('Attribution link deleted');
      fetchAttributions();
    } catch (_err) {
      toast.error('Failed to delete attribution link');
    }
  };

  const totalClicks = attributions.reduce((sum, a) => sum + (a.totalClicks || 0), 0);
  const totalConversions = attributions.reduce((sum, a) => sum + (a.totalConversions || 0), 0);
  const totalRevenue = attributions.reduce((sum, a) => sum + (a.revenueAttributedINR || 0), 0);
  const avgRoas =
    attributions.length > 0
      ? +(
          attributions.reduce((sum, a) => sum + (a.roas || 0), 0) / attributions.length
        ).toFixed(2)
      : 0;

  return (
    <div className="space-y-6">
      {/* 1. TELEMETRY HEADER BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Attributed Revenue
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {formatINR(totalRevenue)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            {totalConversions} verified orders
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Total Inbound Clicks
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Unique UTM creator visits
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Conversion Rate
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Visitor-to-buyer velocity
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Average Campaign ROAS
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {avgRoas}x
          </div>
          <div className="text-[11px] font-mono text-emerald-500/80">
            Return on Ad Spend
          </div>
        </div>
      </div>

      {/* 2. ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <Link2 className="w-4 h-4 text-emerald-400" />
            <span>Promo Codes &amp; UTM Link Attribution</span>
          </h3>
          <p className="text-xs font-mono text-zinc-400">
            Generate custom discount coupon codes and auto-tagged UTM redirect links for every creator.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>New Attribution Link</span>
        </Button>
      </div>

      {/* 3. ATTRIBUTION LINKS TABLE */}
      {isLoading ? (
        <div className="p-8 text-center text-xs font-mono text-zinc-500">
          Loading attribution links...
        </div>
      ) : attributions.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <Link2 className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white">No Attribution Links Generated</div>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
            Create unique promo codes (e.g. RAHUL15) and UTM tracking URLs to track sales conversions and ROAS per influencer.
          </p>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Generate First Code</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#08090B] text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Promo Code</th>
                  <th className="py-3 px-4">UTM Redirect URL</th>
                  <th className="py-3 px-4 text-center">Clicks</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Revenue (₹)</th>
                  <th className="py-3 px-4 text-center">ROAS</th>
                  <th className="py-3 px-4 text-center">Telemetry Simulation</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {attributions.map((item) => {
                  const creator = item.creator || {};
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {creator.avatarUrl ? (
                            <img
                              src={creator.avatarUrl}
                              alt={creator.fullName || creator.handle}
                              className="w-7 h-7 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                              {(creator.fullName || creator.handle || 'C')[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white text-xs">
                              {creator.fullName || creator.handle}
                            </div>
                            <div className="text-[11px] text-zinc-500">@{creator.handle}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold tracking-wider text-xs">
                          {item.promoCode}
                          <span className="text-[10px] text-emerald-400/80 font-normal">
                            (-{item.discountPercent}%)
                          </span>
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="flex items-center gap-1.5">
                          <code className="text-[11px] text-zinc-400 truncate max-w-[180px] bg-black/40 px-2 py-0.5 rounded border border-white/[0.05]">
                            /api/r/{item.campaignCode}/{item.creatorSlug}
                          </code>
                          <button
                            onClick={() => handleCopyLink(item)}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                            title="Copy Tracking Link"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-white">
                        {item.totalClicks.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-emerald-300">
                        {item.totalConversions}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        {formatINR(item.revenueAttributedINR)}
                      </td>

                      <td className="py-3 px-4 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            item.roas >= 3
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {item.roas}x
                        </span>
                      </td>

                      {/* Quick demo click / conversion triggers */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleSimulateMetric(item.id, 1, 0, 0)}
                            className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[10px] text-zinc-300 border border-white/[0.05] transition-colors"
                            title="Simulate 1 Click"
                          >
                            +1 Click
                          </button>
                          <button
                            onClick={() => handleSimulateMetric(item.id, 0, 1, 1500)}
                            className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] text-emerald-400 border border-emerald-500/20 transition-colors"
                            title="Simulate 1 Order (₹1,500)"
                          >
                            +1 Order
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Creator Promo Code & UTM Link"
      >
        <form onSubmit={handleCreateAttribution} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Select Creator *
            </label>
            <select
              value={selectedCreatorId}
              onChange={(e) => {
                setSelectedCreatorId(e.target.value);
                const c = creators.find((cr) => cr.id === e.target.value);
                if (c) {
                  const slug = c.handle.toLowerCase().replace(/[^a-z0-9]/g, '');
                  setCreatorSlug(slug);
                  setPromoCode(`${slug.toUpperCase()}${discountPercent}`);
                }
              }}
              required
              className="w-full bg-[#08090B] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="">-- Choose Campaign Creator --</option>
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName || c.handle} (@{c.handle})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Campaign Slug *
              </label>
              <Input
                value={campaignCode}
                onChange={(e) => setCampaignCode(e.target.value)}
                placeholder="summer-glow-2026"
                required
                className="font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Creator Slug *
              </label>
              <Input
                value={creatorSlug}
                onChange={(e) => setCreatorSlug(e.target.value)}
                placeholder="disha"
                required
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Promo Coupon Code
              </label>
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="DISHA15"
                className="font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Discount Percentage (%)
              </label>
              <Input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="15"
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Destination Website URL
            </label>
            <Input
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://yourbrand.com/products"
              className="font-mono text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="font-mono text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
            >
              {isSubmitting ? 'Generating...' : 'Create Tracking Link'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
