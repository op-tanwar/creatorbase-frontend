'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  Package,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  MapPin,
  Barcode,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductSeedingTabProps {
  campaignId: string;
  creators: any[];
}

export function ProductSeedingTab({ campaignId, creators }: ProductSeedingTabProps) {
  const [seedings, setSeedings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [productName, setProductName] = useState('');
  const [productSku, setProductSku] = useState('');
  const [productValueINR, setProductValueINR] = useState('2499');
  const [shippingAddress, setShippingAddress] = useState('');
  const [courierPartner, setCourierPartner] = useState('Bluedart');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSeedings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/campaigns/${campaignId}/seeding`);
      if (res.data.success) {
        setSeedings(res.data.data || []);
      }
    } catch (_err) {
      toast.error('Failed to load product seeding shipments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeedings();
  }, [campaignId]);

  const handleCreateSeeding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId || !productName || !shippingAddress) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/campaigns/${campaignId}/seeding`, {
        creatorId: selectedCreatorId,
        productName,
        productSku: productSku || `SKU-${Date.now().toString().slice(-6)}`,
        productValueINR: parseFloat(productValueINR) || 0,
        shippingAddress,
        courierPartner,
        trackingNumber: trackingNumber || undefined,
      });

      if (res.data.success) {
        toast.success('Product seeding shipment logged');
        setIsModalOpen(false);
        setProductName('');
        setShippingAddress('');
        setTrackingNumber('');
        fetchSeedings();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to log shipment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (seedingId: string, status: string) => {
    try {
      const res = await api.patch(`/campaigns/${campaignId}/seeding/${seedingId}/status`, {
        shippingStatus: status,
      });
      if (res.data.success) {
        toast.success(`Shipment marked as ${status}`);
        fetchSeedings();
      }
    } catch (_err) {
      toast.error('Failed to update shipment status');
    }
  };

  const handleDelete = async (seedingId: string) => {
    if (!confirm('Remove this product seeding record?')) return;
    try {
      await api.delete(`/campaigns/${campaignId}/seeding/${seedingId}`);
      toast.success('Product seeding record deleted');
      fetchSeedings();
    } catch (_err) {
      toast.error('Failed to delete seeding record');
    }
  };

  const totalValue = seedings.reduce((sum, s) => sum + (s.productValueINR || 0), 0);
  const deliveredCount = seedings.filter((s) => s.shippingStatus === 'DELIVERED').length;
  const inTransitCount = seedings.filter(
    (s) => s.shippingStatus === 'DISPATCHED' || s.shippingStatus === 'IN_TRANSIT'
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. TELEMETRY HEADER BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Total Seeding Value
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {formatINR(totalValue)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            {seedings.length} product units allocated
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Delivered to Creators
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {deliveredCount}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Ready for unboxing &amp; production
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            In Transit / Dispatched
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {inTransitCount}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Bluedart / Delhivery / Shiprocket
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Delivery Rate
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {seedings.length > 0 ? Math.round((deliveredCount / seedings.length) * 100) : 100}%
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Fulfilment velocity
          </div>
        </div>
      </div>

      {/* 2. ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Product Seeding &amp; Barter Shipment Tracker</span>
          </h3>
          <p className="text-xs font-mono text-zinc-400">
            Track courier tracking numbers, product SKUs, and delivery status dispatched to campaign creators.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Log New Shipment</span>
        </Button>
      </div>

      {/* 3. SHIPMENT TABLE */}
      {isLoading ? (
        <div className="p-8 text-center text-xs font-mono text-zinc-500">
          Loading product shipments...
        </div>
      ) : seedings.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white">No Shipments Logged Yet</div>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
            Dispatch sample products, review kits, and gifts to creators with automated courier tracking.
          </p>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Log First Shipment</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#08090B] text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4">Shipping Destination</th>
                  <th className="py-3 px-4">Courier / AWB Tracking</th>
                  <th className="py-3 px-4 text-right">Value (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {seedings.map((item) => {
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
                        <div className="font-bold text-white text-xs">{item.productName}</div>
                        <div className="text-[10px] text-zinc-500">{item.productSku}</div>
                      </td>

                      <td className="py-3 px-4 text-zinc-300 max-w-[200px] truncate">
                        {item.shippingAddress}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-zinc-200 font-bold text-xs">{item.courierPartner}</div>
                        <div className="text-[11px] text-emerald-400 font-mono">{item.trackingNumber}</div>
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-white">
                        {formatINR(item.productValueINR)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.shippingStatus === 'DELIVERED'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : item.shippingStatus === 'DISPATCHED'
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {item.shippingStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.shippingStatus !== 'DELIVERED' && (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'DELIVERED')}
                              className="px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold transition-colors"
                            >
                              Mark Delivered
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
        title="Log Product Seeding Shipment"
      >
        <form onSubmit={handleCreateSeeding} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Select Creator *
            </label>
            <select
              value={selectedCreatorId}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
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
                Product Name *
              </label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Ceramide Hydrating Cream Kit"
                required
                className="font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Product SKU / Code
              </label>
              <Input
                value={productSku}
                onChange={(e) => setProductSku(e.target.value)}
                placeholder="SKU-HYDRA-01"
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Courier Partner
              </label>
              <select
                value={courierPartner}
                onChange={(e) => setCourierPartner(e.target.value)}
                className="w-full bg-[#08090B] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Bluedart">Bluedart Express</option>
                <option value="Delhivery">Delhivery Logistics</option>
                <option value="Shiprocket">Shiprocket Prime</option>
                <option value="DTDC">DTDC Courier</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                AWB Tracking Number
              </label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="BD-492049102"
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Creator Shipping Address *
            </label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={2}
              placeholder="Full shipping address with PIN code..."
              required
              className="w-full bg-[#08090B] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
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
              {isSubmitting ? 'Logging...' : 'Dispatch Shipment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
