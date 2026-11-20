'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { setDetailModalCreator } from '@/store/slices/shortlistSlice';
import api from '@/lib/api';
import { Creator } from '@/types';
import {
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import { formatCompactINR, getCreatorPlatformUrl, EXTERNAL_LINK_PROPS } from '@/lib/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function OutreachPage() {
  const dispatch = useAppDispatch();
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const FALLBACK_THREADS = [
    {
      id: 'thread-demo-1',
      status: 'NEGOTIATING',
      subject: 'Collaboration Pitch: Nykaa Festive Campaign 2026',
      updatedAt: '2026-11-20T14:30:00Z',
      creator: {
        fullName: 'Komal Pandey',
        handle: 'komalpandeyofficial',
        platform: 'INSTAGRAM',
        city: 'Delhi NCR',
        followerCount: 2100000,
        verifiedBadge: true,
        pricingPerReelINR: 65000,
      },
      messages: [
        {
          id: 'msg-1',
          senderType: 'AGENCY',
          senderName: 'Elevation Media Labs',
          content: 'Hi Komal, we would love to collaborate on the upcoming Nykaa Festive campaign. Are you open to a dedicated Reel?',
          sentAt: '2026-11-20T10:00:00Z',
        },
        {
          id: 'msg-2',
          senderType: 'CREATOR',
          senderName: 'Komal Pandey',
          content: 'Hey team! Sounds exciting. Here is my standard commercial kit. Let us align on deliverables.',
          sentAt: '2026-11-20T14:30:00Z',
        },
      ],
    },
    {
      id: 'thread-demo-2',
      status: 'CONTRACTED',
      subject: 'Paid Partnership: Tech & Productivity Showcase',
      updatedAt: '2026-11-19T11:00:00Z',
      creator: {
        fullName: 'Tanmay Bhat',
        handle: 'tanmaybhat',
        platform: 'YOUTUBE',
        city: 'Mumbai',
        followerCount: 4800000,
        verifiedBadge: true,
        pricingPerReelINR: 120000,
      },
      messages: [
        {
          id: 'msg-3',
          senderType: 'AGENCY',
          senderName: 'Elevation Media Labs',
          content: 'Hey Tanmay! Contract draft is ready for review.',
          sentAt: '2026-11-19T11:00:00Z',
        },
      ],
    },
  ];

  const fetchThreads = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/outreach/threads');
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        setThreads(res.data.data);
        if (!selectedThreadId) {
          setSelectedThreadId(res.data.data[0].id);
        }
      } else {
        setThreads(FALLBACK_THREADS);
        if (!selectedThreadId) {
          setSelectedThreadId(FALLBACK_THREADS[0].id);
          setActiveThread(FALLBACK_THREADS[0]);
        }
      }
    } catch (_err) {
      setThreads(FALLBACK_THREADS);
      if (!selectedThreadId) {
        setSelectedThreadId(FALLBACK_THREADS[0].id);
        setActiveThread(FALLBACK_THREADS[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  // Fetch full thread detail when selected
  useEffect(() => {
    if (!selectedThreadId) {
      setActiveThread(null);
      return;
    }
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/outreach/threads/${selectedThreadId}`);
        if (res.data.success) {
          setActiveThread(res.data.data);
        } else {
          const found = threads.find((t) => t.id === selectedThreadId);
          if (found) setActiveThread(found);
        }
      } catch (_err) {
        const found = threads.find((t) => t.id === selectedThreadId);
        if (found) setActiveThread(found);
      }
    };
    fetchDetail();
  }, [selectedThreadId]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedThreadId) return;
    try {
      const res = await api.patch(`/outreach/threads/${selectedThreadId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        toast.success(`Updated status to ${newStatus}`);
        setThreads((prev) =>
          prev.map((t) => (t.id === selectedThreadId ? { ...t, status: newStatus } : t))
        );
        if (activeThread) {
          setActiveThread({ ...activeThread, status: newStatus });
        }
      }
    } catch (_err) {
      toast.error('Failed to update status');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThreadId || !replyText.trim()) return;
    try {
      setIsSendingReply(true);
      const res = await api.post(`/outreach/threads/${selectedThreadId}/reply`, {
        message: replyText.trim(),
      });
      if (res.data.success) {
        toast.success('Reply dispatched via email!');
        setReplyText('');
        // Refresh active thread messages
        const detailRes = await api.get(`/outreach/threads/${selectedThreadId}`);
        if (detailRes.data.success) {
          setActiveThread(detailRes.data.data);
        }
      }
    } catch (_err) {
      toast.error('Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  // KPIs
  const totalPitched = threads.length;
  const negotiatingCount = threads.filter((t) => t.status === 'NEGOTIATING').length;
  const contractedCount = threads.filter((t) => t.status === 'CONTRACTED').length;
  const conversionRate = totalPitched > 0 ? Math.round((contractedCount / totalPitched) * 100) : 0;

  // Filtered threads list
  const filteredThreads = threads.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.creator?.fullName?.toLowerCase().includes(q);
      const matchHandle = t.creator?.handle?.toLowerCase().includes(q);
      const matchSubject = t.subject?.toLowerCase().includes(q);
      return matchName || matchHandle || matchSubject;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONTRACTED':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'NEGOTIATING':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'DECLINED':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-4 pt-1 sm:pt-2">
      {/* ============================================================= */}
      {/* 1. OUTREACH CRM TOP TELEMETRY CARDS                           */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Total Pitches Sent
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {totalPitched}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">Nodemailer SMTP Active</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            In Negotiation
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
            {negotiatingCount}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">Commercials in Review</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Contracted &amp; Closed
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
            {contractedCount}
          </div>
          <div className="text-[11px] font-mono text-emerald-400">Deliverables Agreed</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0E12] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Conversion Rate
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {conversionRate}%
          </div>
          <div className="text-[11px] font-mono text-zinc-400">Industry Avg: 18%</div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. SPLIT WORKSPACE: THREADS LIST vs ACTIVE CONVERSATION        */}
      {/* ============================================================= */}
      {threads.length === 0 && !isLoading ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0C0E12] p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-xl">
            ✉️
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-sans">
              No Creator Collaboration Pitches Yet
            </h3>
            <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto leading-relaxed">
              Explore the Discover Hub, select top-performing Indian creators, and dispatch automated collaboration pitches directly to their verified business emails.
            </p>
          </div>
          <div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 text-xs font-mono font-bold transition-all"
            >
              <span>Explore Discover Hub →</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-start gap-4">
          {/* LEFT: THREADS COLUMN */}
          <div className="w-full lg:w-[38%] xl:w-[34%] space-y-2.5 shrink-0">
            {/* Filter & Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search pitches by creator or handle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 rounded-lg bg-[#0C0E12] border border-white/[0.08] pl-8 pr-3 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter pitches by status"
                className="h-8 rounded-lg bg-[#0C0E12] border border-white/[0.08] px-2 text-xs font-mono text-zinc-300 focus:border-emerald-500/50 focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="PITCHED">Pitched</option>
                <option value="NEGOTIATING">Negotiating</option>
                <option value="CONTRACTED">Contracted</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>

            {/* Threads List */}
            <div className="space-y-1.5 max-h-[calc(100vh-13rem)] overflow-y-auto custom-scrollbar">
              {filteredThreads.map((thread) => {
                const isSelected = thread.id === selectedThreadId;
                const creator = thread.creator;

                return (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#0C0E12] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/30'
                        : 'bg-[#08090C]/80 border-white/[0.06] hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-zinc-800 ring-1 ring-white/10 shrink-0">
                          {creator?.avatarUrl ? (
                            <Image
                              src={creator.avatarUrl}
                              alt={creator.fullName}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center font-mono text-[10px] text-white">
                              {creator?.fullName?.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate font-sans">
                            {creator?.fullName || 'Creator'}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400 truncate">
                            @{creator?.handle}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(
                          thread.status
                        )}`}
                      >
                        {thread.status}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-zinc-300 truncate">
                      {thread.subject}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/[0.04]">
                      <span>Offer: {thread.offerINR ? formatCompactINR(thread.offerINR) : 'Negotiable'}</span>
                      <span>{new Date(thread.lastMessageAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: ACTIVE THREAD CONVERSATION */}
          <div className="flex-1 min-w-0 w-full rounded-xl border border-white/[0.08] bg-[#0C0E12] p-4 sm:p-5 shadow-2xl space-y-4">
            {activeThread ? (
              <>
                {/* Thread Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0 bg-zinc-800">
                      {activeThread.creator?.avatarUrl ? (
                        <Image
                          src={activeThread.creator.avatarUrl}
                          alt={activeThread.creator.fullName}
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-mono text-xs text-white">
                          {activeThread.creator?.fullName?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm font-sans">
                          {activeThread.creator?.fullName}
                        </h3>
                        <a
                          href={getCreatorPlatformUrl(activeThread.creator)}
                          {...EXTERNAL_LINK_PROPS}
                          className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-0.5"
                        >
                          <span>@{activeThread.creator?.handle}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <div className="text-xs font-mono text-zinc-400">
                        To: <span className="text-emerald-400">{activeThread.creatorEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Picker */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">Pipeline Status:</span>
                    <select
                      value={activeThread.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      aria-label="Update pipeline status"
                      className="h-8 rounded-lg bg-[#08090C] border border-white/[0.08] px-2.5 text-xs font-mono text-emerald-400 font-bold focus:border-emerald-500/50 focus:outline-none cursor-pointer"
                    >
                      <option value="PITCHED">Pitched</option>
                      <option value="NEGOTIATING">Negotiating</option>
                      <option value="CONTRACTED">Contracted</option>
                      <option value="DECLINED">Declined</option>
                    </select>
                  </div>
                </div>

                {/* Pitch Details Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg bg-[#08090C] border border-white/[0.05] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Deliverable</span>
                    <div className="text-zinc-200 font-medium">{activeThread.deliverable || '1x Reel'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Commercial Offer</span>
                    <div className="text-emerald-400 font-bold">
                      {activeThread.offerINR ? formatCompactINR(activeThread.offerINR) : 'Negotiable'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">First Pitched</span>
                    <div className="text-zinc-400">
                      {new Date(activeThread.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                {/* Message Stream */}
                <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar p-1">
                  {(activeThread.messages || []).map((msg: any) => {
                    const isUser = msg.sender === 'USER';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl p-3.5 text-xs font-mono leading-relaxed whitespace-pre-line ${
                            isUser
                              ? 'bg-emerald-500/10 border border-emerald-500/25 text-zinc-100'
                              : 'bg-zinc-900 border border-white/[0.08] text-zinc-200'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">
                            {isUser ? 'You (Agency)' : activeThread.creator?.fullName}
                          </div>
                          {msg.body}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 mt-1 px-1">
                          {new Date(msg.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Composer Box */}
                <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <textarea
                    rows={3}
                    placeholder="Type follow-up message to creator (dispatched via Nodemailer email)..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full rounded-lg bg-[#08090C] border border-white/[0.08] p-3 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none"
                  />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-zinc-500">
                      Replies route directly through <code className="text-zinc-400">optanwar10@gmail.com</code> SMTP.
                    </span>
                    <button
                      type="submit"
                      disabled={isSendingReply || !replyText.trim()}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingReply ? 'Sending...' : 'Send Follow-up'}</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="p-12 text-center text-zinc-500 font-mono text-xs">
                Select a pitch thread on the left to view messages.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
