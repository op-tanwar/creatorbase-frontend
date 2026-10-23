'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import adminService from '@/services/adminService';
import { Creator, Platform } from '@/types';
import {
  Users2,
  Search,
  Plus,
  Edit2,
  Trash2,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';
import { ApifySyncModal } from '@/components/creators/ApifySyncModal';

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apifyModalOpen, setApifyModalOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');

  // Modal States
  const [modalType, setModalType] = useState<'NONE' | 'CREATE' | 'EDIT' | 'DELETE'>('NONE');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [formData, setFormData] = useState({
    handle: '',
    platform: 'INSTAGRAM' as Platform,
    fullName: '',
    avatarUrl: '',
    city: '',
    state: 'India',
    niche: '',
    followerCount: 50000,
    engagementRate: 4.5,
    avgLikes: 2500,
    avgComments: 150,
    avgReelViews: 80000,
    businessEmail: '',
    isVerified: true,
    audienceTopCity: '',
    audienceFemalePercentage: 50,
    audienceMalePercentage: 50,
  });

  const fetchCreators = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/creators', {
        params: {
          page,
          limit,
          search: search.trim() || undefined,
          platform: platformFilter !== 'ALL' ? platformFilter : undefined,
        },
      });

      if (res.data.success && res.data.data) {
        setCreators(res.data.data.creators || []);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (err: any) {
      toast.error('Failed to load creator directory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [page, platformFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCreators();
  };

  const openCreateModal = () => {
    setSelectedCreator(null);
    setFormData({
      handle: '',
      platform: 'INSTAGRAM',
      fullName: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      city: 'Indore',
      state: 'Madhya Pradesh',
      niche: 'Food & Cafes',
      followerCount: 75000,
      engagementRate: 4.8,
      avgLikes: 3600,
      avgComments: 210,
      avgReelViews: 120000,
      businessEmail: '',
      isVerified: true,
      audienceTopCity: 'Indore',
      audienceFemalePercentage: 52,
      audienceMalePercentage: 48,
    });
    setModalType('CREATE');
  };

  const openEditModal = (creator: Creator) => {
    setSelectedCreator(creator);
    setFormData({
      handle: creator.handle,
      platform: creator.platform,
      fullName: creator.fullName,
      avatarUrl: creator.avatarUrl,
      city: creator.city,
      state: creator.state || 'India',
      niche: creator.niche,
      followerCount: creator.followerCount,
      engagementRate: creator.engagementRate,
      avgLikes: creator.avgLikes,
      avgComments: creator.avgComments,
      avgReelViews: creator.avgReelViews,
      businessEmail: creator.businessEmail || '',
      isVerified: creator.isVerified,
      audienceTopCity: creator.audienceTopCity || creator.city,
      audienceFemalePercentage: creator.audienceFemalePercentage || 50,
      audienceMalePercentage: creator.audienceMalePercentage || 50,
    });
    setModalType('EDIT');
  };

  const openDeleteModal = (creator: Creator) => {
    setSelectedCreator(creator);
    setModalType('DELETE');
  };

  const handleSaveCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (modalType === 'CREATE') {
        const created = await adminService.createCreator(formData);
        toast.success(`Created creator @${created.handle}`);
      } else if (modalType === 'EDIT' && selectedCreator) {
        const updated = await adminService.updateCreator(selectedCreator.id, formData);
        toast.success(`Updated @${updated.handle}`);
      }
      setModalType('NONE');
      fetchCreators();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCreator = async () => {
    if (!selectedCreator) return;
    try {
      setIsSubmitting(true);
      await adminService.deleteCreator(selectedCreator.id);
      toast.success(`Deleted @${selectedCreator.handle} from catalog`);
      setModalType('NONE');
      fetchCreators();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete creator';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#24272E] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <span>Creator Catalog Manager</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Maintain curated Pan-India influencer directory, benchmark rates, and verify creators.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setApifyModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/50 hover:border-emerald-500 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Import via Apify</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-md shadow-amber-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Creator</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by creator name, @handle, city, or niche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#121418] border border-[#24272E] rounded-xl text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60 font-mono transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Platform filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono text-zinc-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Platform:
          </span>
          {['ALL', 'INSTAGRAM', 'YOUTUBE'].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPlatformFilter(p);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                platformFilter === p
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800'
              }`}
            >
              {p === 'ALL' ? 'All Platforms' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#24272E] bg-[#111317] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15171D] border-b border-[#24272E] text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Niche &amp; Location</th>
                <th className="py-3 px-4">Followers</th>
                <th className="py-3 px-4">Eng. Rate</th>
                <th className="py-3 px-4">Avg. Reel Views</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2027]">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-6 bg-zinc-800/60 rounded" />
                    </td>
                  </tr>
                ))
              ) : creators.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-mono">
                    No creators match the query.
                  </td>
                </tr>
              ) : (
                creators.map((c) => {
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-[#15171E] transition-colors group"
                    >
                      {/* Creator Details */}
                      <td className="py-3.5 px-4 font-medium text-zinc-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatarUrl}
                            alt={c.fullName}
                            className="h-9 w-9 rounded-full object-cover border border-zinc-700 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1">
                              <span>{c.fullName}</span>
                              {c.isVerified && (
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-zinc-400">
                              @{c.handle}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            c.platform === 'INSTAGRAM'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                              : 'bg-red-950/80 text-red-300 border border-red-800/50'
                          }`}
                        >
                          {c.platform === 'INSTAGRAM' ? (
                            <InstagramIcon className="w-3 h-3" />
                          ) : (
                            <YoutubeIcon className="w-3 h-3" />
                          )}
                          <span>{c.platform}</span>
                        </span>
                      </td>

                      {/* Niche & Location */}
                      <td className="py-3.5 px-4">
                        <div className="text-zinc-200 font-medium">{c.niche}</div>
                        <div className="text-zinc-500 font-mono text-[11px]">
                          {c.city}, {c.state}
                        </div>
                      </td>

                      {/* Followers */}
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-200">
                        {c.followerCount >= 1000000
                          ? `${(c.followerCount / 1000000).toFixed(1)}M`
                          : c.followerCount >= 1000
                          ? `${(c.followerCount / 1000).toFixed(0)}K`
                          : c.followerCount}
                      </td>

                      {/* Engagement Rate */}
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {c.engagementRate}%
                      </td>

                      {/* Avg Reel Views */}
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {c.avgReelViews >= 1000000
                          ? `${(c.avgReelViews / 1000000).toFixed(1)}M`
                          : c.avgReelViews >= 1000
                          ? `${(c.avgReelViews / 1000).toFixed(0)}K`
                          : c.avgReelViews}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
                            title="Edit Creator"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(c)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                            title="Delete Creator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#13151A] border-t border-[#24272E] text-xs font-mono">
            <span className="text-zinc-400">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 hover:bg-zinc-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Creator Modal */}
      {(modalType === 'CREATE' || modalType === 'EDIT') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#121418] border border-[#2A2E38] p-6 shadow-2xl space-y-5 text-zinc-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#24272E] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{modalType === 'CREATE' ? 'Add Verified Creator' : 'Edit Creator Record'}</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Provide verified profile metrics, audience stats, and business credentials.
                </p>
              </div>
              <button
                onClick={() => setModalType('NONE')}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreator} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Handle */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Social Handle (without @)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    placeholder="e.g. indori_foodie_rahul"
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Platform */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Platform Channel
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as Platform })}
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="INSTAGRAM">INSTAGRAM</option>
                    <option value="YOUTUBE">YOUTUBE</option>
                  </select>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Creator Real / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Rahul Agrawal"
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-sans focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Avatar URL */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Indore"
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Madhya Pradesh"
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Niche */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Content Niche / Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    placeholder="e.g. Food & Cafes, Tech, Fashion"
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Business Email */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Business Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                    placeholder="e.g. contact@indorifoodie.in"
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Followers */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Follower Count
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formData.followerCount}
                    onChange={(e) => setFormData({ ...formData, followerCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Engagement Rate */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Engagement Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={formData.engagementRate}
                    onChange={(e) => setFormData({ ...formData, engagementRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Avg Reel Views */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Avg Reel / Video Views
                  </label>
                  <input
                    type="number"
                    value={formData.avgReelViews}
                    onChange={(e) => setFormData({ ...formData, avgReelViews: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Audience Top City */}
                <div className="space-y-1.5">
                  <label className="font-mono font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
                    Top Audience City
                  </label>
                  <input
                    type="text"
                    value={formData.audienceTopCity}
                    onChange={(e) => setFormData({ ...formData, audienceTopCity: e.target.value })}
                    placeholder="e.g. Indore"
                    className="w-full px-3 py-2 bg-[#171920] border border-[#2A2E38] rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Verified Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  className="h-4 w-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="isVerified" className="font-mono text-xs text-zinc-300 cursor-pointer">
                  Mark as Verified Creator (displays verified check badge in catalog)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#24272E]">
                <button
                  type="button"
                  onClick={() => setModalType('NONE')}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-colors disabled:opacity-50 shadow-md shadow-amber-950"
                >
                  {isSubmitting
                    ? 'Saving Creator...'
                    : modalType === 'CREATE'
                    ? 'Create Creator'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === 'DELETE' && selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl bg-[#121418] border border-rose-900/60 p-6 shadow-2xl space-y-4 text-zinc-200">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-900/60">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Creator Record</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">Permanent catalog removal</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">@{selectedCreator.handle}</strong> ({selectedCreator.fullName})?
              This will remove this creator from the directory and any associated shortlists.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#24272E]">
              <button
                type="button"
                onClick={() => setModalType('NONE')}
                className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCreator}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors disabled:opacity-50 shadow-md shadow-rose-950"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Creator'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apify Sync Modal */}
      <ApifySyncModal
        isOpen={apifyModalOpen}
        onClose={() => setApifyModalOpen(false)}
        onCreatorSynced={() => {
          fetchCreators();
        }}
      />
    </div>
  );
}
