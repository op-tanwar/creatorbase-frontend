'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatFollowers, formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  Video,
  ExternalLink,
  Plus,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface LiveContentMonitorTabProps {
  campaignId: string;
  creators: any[];
  onRefreshCampaign?: () => void;
}

export function LiveContentMonitorTab({
  campaignId,
  creators,
  onRefreshCampaign,
}: LiveContentMonitorTabProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [mediaType, setMediaType] = useState('REEL');
  const [agreedFeeINR, setAgreedFeeINR] = useState('15000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/campaigns/${campaignId}/posts`);
      if (res.data.success) {
        setPosts(res.data.data || []);
      }
    } catch (_err) {
      toast.error('Failed to load tracked campaign posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [campaignId]);

  const handleSyncMetrics = async () => {
    try {
      setIsSyncing(true);
      const res = await api.post(`/campaigns/${campaignId}/sync-metrics`);
      if (res.data.success) {
        toast.success('Live metrics refreshed from social feeds');
        fetchPosts();
        if (onRefreshCampaign) onRefreshCampaign();
      }
    } catch (_err) {
      toast.error('Failed to sync live metrics');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTrackPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId || !postUrl) {
      toast.error('Please select a creator and enter a post URL');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/campaigns/${campaignId}/track-post`, {
        creatorId: selectedCreatorId,
        postUrl,
        mediaType,
        agreedFeeINR: parseFloat(agreedFeeINR) || 15000,
      });

      if (res.data.success) {
        toast.success('Post verified & added to live monitoring');
        setIsAddModalOpen(false);
        setPostUrl('');
        fetchPosts();
        if (onRefreshCampaign) onRefreshCampaign();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to track post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Remove this post from campaign tracking?')) return;
    try {
      await api.delete(`/campaigns/${campaignId}/posts/${postId}`);
      toast.success('Post tracking removed');
      fetchPosts();
      if (onRefreshCampaign) onRefreshCampaign();
    } catch (_err) {
      toast.error('Failed to delete tracked post');
    }
  };

  const totalViews = posts.reduce((sum, p) => sum + (p.liveViews || 0), 0);
  const totalLikes = posts.reduce((sum, p) => sum + (p.liveLikes || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.liveComments || 0), 0);
  const totalEMV = posts.reduce((sum, p) => sum + (p.estimatedEmvINR || 0), 0);
  const compliantPosts = posts.filter((p) => p.hasAdDisclosure).length;
  const complianceRate = posts.length > 0 ? Math.round((compliantPosts / posts.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* 1. TELEMETRY HEADER BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Live Verified Views
          </div>
          <div className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span>{formatFollowers(totalViews)}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            {posts.length} tracked assets
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Total Engagements
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {formatFollowers(totalLikes + totalComments)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            {totalLikes.toLocaleString()} likes · {totalComments.toLocaleString()} comments
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Earned Media Value (EMV)
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {formatINR(totalEMV)}
          </div>
          <div className="text-[11px] font-mono text-emerald-500/80">
            Commercial brand yield
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            #AD Compliance
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {complianceRate}%
          </div>
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ASCI Standard Compliant</span>
          </div>
        </div>
      </div>

      {/* 2. ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Live Social Content Monitoring</span>
          </h3>
          <p className="text-xs font-mono text-zinc-400">
            Auto-capture reels and videos, sync view velocity, and monitor legal #ad disclosures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncMetrics}
            disabled={isSyncing || posts.length === 0}
            className="font-mono text-xs border-white/[0.08] hover:border-emerald-500/30 text-zinc-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Feeds...' : 'Sync Live Metrics'}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Track Post URL</span>
          </Button>
        </div>
      </div>

      {/* 3. POSTS GRID / CARDS */}
      {isLoading ? (
        <div className="p-8 text-center text-xs font-mono text-zinc-500">
          Loading tracked content assets...
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white">No Content Assets Tracked Yet</div>
          <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
            Once creators publish campaign Reels, Shorts, or YouTube integrations, paste their live post URLs to track live views, CPM, and #ad compliance.
          </p>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="font-mono text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Track First Post</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => {
            const creator = post.creator || {};
            return (
              <div
                key={post.id}
                className="rounded-2xl bg-[#0C0E12] border border-white/[0.08] p-4 flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {creator.avatarUrl ? (
                      <img
                        src={creator.avatarUrl}
                        alt={creator.fullName || creator.handle}
                        className="w-9 h-9 rounded-full object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs font-mono">
                        {(creator.fullName || creator.handle || 'C')[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {creator.fullName || creator.handle}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        @{creator.handle} · {post.platform}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      post.hasAdDisclosure
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {post.hasAdDisclosure ? '#AD COMPLIANT' : 'NO DISCLOSURE'}
                  </span>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 bg-[#08090B] p-2.5 rounded-xl border border-white/[0.05]">
                  <div>
                    <div className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>Views</span>
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      {formatFollowers(post.liveViews)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-400" />
                      <span>Likes</span>
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      {formatFollowers(post.liveLikes)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-cyan-400" />
                      <span>CPM</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">
                      ₹{post.actualCpmINR}
                    </div>
                  </div>
                </div>

                {/* EMV and Details */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1 border-t border-white/[0.05]">
                  <div>
                    <span>Earned Media Value: </span>
                    <strong className="text-emerald-400 font-bold">
                      {formatINR(post.estimatedEmvINR)}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-zinc-400 hover:text-white transition-colors"
                      title="Open Original Post"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. TRACK NEW POST MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Track Live Campaign Content Asset"
      >
        <form onSubmit={handleTrackPost} className="space-y-4">
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
                  {c.fullName || c.handle} (@{c.handle}) - {c.platform}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">
              Live Post URL *
            </label>
            <Input
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/C... or https://youtube.com/watch?v=..."
              required
              className="font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Media Format
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full bg-[#08090B] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="REEL">Instagram Reel</option>
                <option value="STORY">Instagram Story</option>
                <option value="VIDEO">YouTube Video</option>
                <option value="SHORT">YouTube Short</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Agreed Fee (₹ INR)
              </label>
              <Input
                type="number"
                value={agreedFeeINR}
                onChange={(e) => setAgreedFeeINR(e.target.value)}
                placeholder="15000"
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>CreatorBase will extract view velocity and verify legal #ad disclosure.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
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
              {isSubmitting ? 'Tracking...' : 'Start Tracking Post'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
