'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { formatFollowers, formatPercentage } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  FileSpreadsheet,
  UploadCloud,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Terminal,
  ShieldCheck,
  Search,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  FolderPlus,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

interface QuotaData {
  used: number;
  limit: number;
  remaining: number;
  resetAt: string;
  planType: string;
}

interface EnrichedCreator {
  handle: string;
  platform: 'INSTAGRAM' | 'YOUTUBE';
  fullName: string;
  avatarUrl: string;
  followerCount: number;
  engagementRate: number;
  avgReelViews: number;
  businessEmail: string | null;
  city: string;
  niche: string;
  authenticityScore: number;
  isCached: boolean;
  status: 'SUCCESS' | 'NOT_FOUND' | 'FAILED';
  error?: string;
}

interface JobData {
  id: string;
  fileName: string;
  totalRows: number;
  processedRows: number;
  percentage: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  logs: string[];
  results: EnrichedCreator[];
  errorMessage?: string;
}

export default function BulkEnrichmentPage() {
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(true);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Job processing state
  const [activeJob, setActiveJob] = useState<JobData | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Results search & copy state
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Save to Shortlist modal state
  const [shortlists, setShortlists] = useState<any[]>([]);
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);
  const [selectedShortlistId, setSelectedShortlistId] = useState('');
  const [newShortlistName, setNewShortlistName] = useState('');
  const [isSavingShortlist, setIsSavingShortlist] = useState(false);

  // 1. Fetch user enrichment quota
  const fetchQuota = async () => {
    try {
      setQuotaLoading(true);
      const res = await api.get('/enrichment/quota');
      if (res.data.success) {
        setQuota(res.data.data);
      }
    } catch (_err) {
      toast.error('Failed to load enrichment credits');
    } finally {
      setQuotaLoading(false);
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  // 2. Poll active job status
  useEffect(() => {
    if (!activeJob || activeJob.status === 'COMPLETED' || activeJob.status === 'FAILED') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/enrichment/job/${activeJob.id}`);
        if (res.data.success && res.data.data) {
          const updated = res.data.data as JobData;
          setActiveJob(updated);

          // Auto-scroll log console
          if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
          }

          if (updated.status === 'COMPLETED') {
            toast.success(`Enrichment complete! ${updated.totalRows} handles processed.`);
            fetchQuota();
          } else if (updated.status === 'FAILED') {
            toast.error(updated.errorMessage || 'Enrichment job failed');
          }
        }
      } catch (_err) {
        // Continue polling
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status]);

  // 3. Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a valid .csv file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a valid .csv file');
      }
    }
  };

  // 4. Download sample template CSV
  const handleDownloadTemplate = () => {
    const csvContent =
      'handle,notes\ntechnogamerz,Top gaming creator\nindori_foodie_rahul,Street food curator Indore\ndelhifoodguide,Delhi NCR foodie\nsantoshishetty,Fashion and wellness\nranveer.allahbadia,Podcaster and youth icon\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CreatorBase_Sample_Enrichment_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Sample template downloaded');
  };

  // 5. Submit CSV for enrichment
  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await api.post('/enrichment/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success && res.data.data) {
        toast.success(res.data.message || 'Enrichment job started!');
        setActiveJob({
          id: res.data.data.jobId,
          fileName: res.data.data.fileName,
          totalRows: res.data.data.totalRows,
          processedRows: 0,
          percentage: 0,
          status: 'PROCESSING',
          logs: [
            `[UPLOAD] Received ${res.data.data.fileName} with ${res.data.data.totalRows} handles.`,
            `[PIPELINE] Initializing Apify actor runner & Neon PostgreSQL cache engine...`,
          ],
          results: [],
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start enrichment');
    } finally {
      setIsUploading(false);
    }
  };

  // 6. Download Enriched CSV (RFC-4180 with UTF-8 BOM)
  const handleDownloadEnrichedCsv = async () => {
    if (!activeJob) return;

    try {
      toast.info('Preparing RFC-4180 enriched CSV stream...');
      const res = await api.get(`/enrichment/job/${activeJob.id}/export`, {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `CreatorBase_Enriched_${activeJob.fileName.replace(/\.csv$/i, '')}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Enriched CSV downloaded successfully!');
    } catch (_err) {
      toast.error('Failed to download enriched CSV');
    }
  };

  // 7. Copy email helper
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast.success('Email copied to clipboard');
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // 8. Save Enriched Creators to Shortlist
  const handleOpenShortlistModal = async () => {
    try {
      const res = await api.get('/shortlists');
      if (res.data.success) {
        setShortlists(res.data.data || []);
      }
      setIsShortlistModalOpen(true);
    } catch (_err) {
      toast.error('Failed to load shortlists');
    }
  };

  const handleSaveToShortlist = async () => {
    if (!activeJob) return;
    const validResults = activeJob.results.filter((r) => r.status === 'SUCCESS');
    if (validResults.length === 0) {
      toast.error('No verified creators to add.');
      return;
    }

    try {
      setIsSavingShortlist(true);
      let targetShortlistId = selectedShortlistId;

      // If user provided a new name, create shortlist first
      if (newShortlistName.trim()) {
        const createRes = await api.post('/shortlists', {
          name: newShortlistName.trim(),
        });
        if (createRes.data.success) {
          targetShortlistId = createRes.data.data.id;
        }
      }

      if (!targetShortlistId) {
        toast.error('Please select an existing shortlist or enter a new name');
        return;
      }

      // Add each creator to the shortlist
      let addedCount = 0;
      for (const creator of validResults) {
        // Look up creator id by handle
        try {
          // Sync or get creator
          const syncRes = await api.post('/creators/sync-live', {
            handle: creator.handle,
          });
          if (syncRes.data.success && syncRes.data.data) {
            await api.post(`/shortlists/${targetShortlistId}/creators`, {
              creatorId: syncRes.data.data.id,
            });
            addedCount++;
          }
        } catch (_e) {
          // continue
        }
      }

      toast.success(`Added ${addedCount} enriched creators to shortlist!`);
      setIsShortlistModalOpen(false);
      setNewShortlistName('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save creators to shortlist');
    } finally {
      setIsSavingShortlist(false);
    }
  };

  // Filter results for preview
  const filteredResults = activeJob?.results
    ? activeJob.results.filter(
        (r) =>
          r.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.businessEmail && r.businessEmail.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const cachedCount = activeJob?.results ? activeJob.results.filter((r) => r.isCached).length : 0;
  const liveCount = activeJob?.results
    ? activeJob.results.filter((r) => !r.isCached && r.status === 'SUCCESS').length
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Header & Telemetry Quota Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <span>Bulk CSV &amp; Handle Enrichment</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Upload raw creator lists from Excel/Notion. Our Apify engine verifies live reach, audits ER, and unmasks verified collaboration emails.
          </p>
        </div>

        {/* Quota Counter Pill */}
        {quota && (
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-3 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-zinc-100">
                  {quota.remaining} / {quota.limit} Credits Remaining
                </span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400 uppercase">
                  {quota.planType}
                </span>
              </div>
              <div className="mt-1 w-48 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    quota.remaining > 100
                      ? 'bg-emerald-500'
                      : quota.remaining > 20
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (quota.remaining / quota.limit) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STATE 1: UPLOAD ZONE (Show if no active job or if user wants to upload another) */}
      {!activeJob && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-10 backdrop-blur-md">
          <div className="max-w-2xl mx-auto text-center">
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-xl shadow-emerald-950/40'
                  : selectedFile
                  ? 'border-emerald-500/60 bg-zinc-950/80'
                  : 'border-zinc-700/80 hover:border-zinc-500 bg-zinc-950/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 group-hover:scale-105 transition-transform mb-4">
                <UploadCloud className="h-8 w-8" />
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Ready for Apify audit
                  </div>
                  <div className="text-[11px] text-zinc-500 pt-1">
                    Click to choose a different file
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-base font-bold text-zinc-100">
                    Drop your agency creator list here, or browse
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Auto-detects columns: <code className="text-emerald-400 font-mono">handle</code>,{' '}
                    <code className="text-emerald-400 font-mono">username</code>, or profile links. Up to 500 rows per batch.
                  </p>
                </div>
              )}
            </div>

            {/* Template Download & Submit Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Sample Template CSV</span>
              </button>

              <Button
                variant="primary"
                size="md"
                disabled={!selectedFile || isUploading}
                isLoading={isUploading}
                leftIcon={<Sparkles className="h-4 w-4" />}
                onClick={handleUploadSubmit}
                className="w-full sm:w-auto"
              >
                Start Bulk Enrichment Pipeline
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: PROCESSING CONSOLE OR COMPLETED RESULTS */}
      {activeJob && (
        <div className="space-y-6">
          {/* Progress Header Card */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-5 sm:p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      activeJob.status === 'COMPLETED'
                        ? 'bg-emerald-400'
                        : activeJob.status === 'FAILED'
                        ? 'bg-rose-500'
                        : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                  <h2 className="text-base font-bold text-white">
                    {activeJob.status === 'COMPLETED'
                      ? 'Enrichment Complete'
                      : activeJob.status === 'FAILED'
                      ? 'Enrichment Failed'
                      : 'Apify Live Enrichment Engine Running...'}
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  File: {activeJob.fileName} • Job ID: {activeJob.id.slice(0, 8)}
                </p>
              </div>

              {/* Progress Summary Pill */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
                  <span className="text-zinc-500">Processed: </span>
                  <span className="font-bold text-zinc-100">
                    {activeJob.processedRows} / {activeJob.totalRows}
                  </span>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-emerald-400 font-bold">
                  {activeJob.percentage}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mb-4">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeJob.status === 'COMPLETED'
                    ? 'bg-emerald-500'
                    : activeJob.status === 'FAILED'
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500'
                }`}
                style={{ width: `${activeJob.percentage}%` }}
              />
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/60 text-xs">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <span className="text-zinc-400">Cached Hits: </span>
                <span className="font-mono font-bold text-zinc-100">{cachedCount}</span>
                <span className="text-[10px] text-zinc-500">(0 credits)</span>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-zinc-400">Apify Scraped: </span>
                <span className="font-mono font-bold text-zinc-100">{liveCount}</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span className="text-zinc-400">Verified Rate: </span>
                <span className="font-mono font-bold text-zinc-100">
                  {activeJob.totalRows > 0
                    ? Math.round(
                        ((cachedCount + liveCount) / Math.max(1, activeJob.totalRows)) * 100
                      )
                    : 100}
                  %
                </span>
              </div>

              <div className="flex items-center justify-end">
                {activeJob.status === 'COMPLETED' && (
                  <button
                    onClick={() => {
                      setActiveJob(null);
                      setSelectedFile(null);
                    }}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    + Upload New File
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Monospace Terminal / Console */}
          {activeJob.status === 'PROCESSING' && (
            <div className="rounded-2xl border border-zinc-800 bg-[#000] p-4 font-mono shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span>Apify Distributed Live Console</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Streaming</span>
                </div>
              </div>

              <div
                ref={logContainerRef}
                className="h-48 overflow-y-auto space-y-1 text-xs text-zinc-300 scrollbar-thin font-mono leading-relaxed select-text"
              >
                {activeJob.logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-zinc-600 select-none">&gt;</span>
                    <span
                      className={
                        log.includes('[CACHE HIT]')
                          ? 'text-emerald-400'
                          : log.includes('[APIFY LIVE]')
                          ? 'text-sky-400'
                          : log.includes('[ERROR]') || log.includes('[FATAL')
                          ? 'text-rose-400'
                          : 'text-zinc-300'
                      }
                    >
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATE 3: RESULTS TABLE & EXPORT ACTIONS (Visible upon completion or as rows process) */}
          {activeJob.results.length > 0 && (
            <div className="space-y-4">
              {/* Actions & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by handle or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<FolderPlus className="h-4 w-4 text-emerald-400" />}
                    onClick={handleOpenShortlistModal}
                  >
                    Save to Shortlist
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={handleDownloadEnrichedCsv}
                  >
                    Download Enriched CSV
                  </Button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950/80 uppercase tracking-wider text-[10px] text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-3">Creator</th>
                      <th className="px-4 py-3">City &amp; Niche</th>
                      <th className="px-4 py-3">Followers</th>
                      <th className="px-4 py-3">Engagement</th>
                      <th className="px-4 py-3">Reel Views</th>
                      <th className="px-4 py-3">Verified Business Email</th>
                      <th className="px-4 py-3">Authenticity</th>
                      <th className="px-4 py-3 text-right">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredResults.map((r) => (
                      <tr key={r.handle} className="hover:bg-zinc-800/40 transition-colors">
                        {/* Creator */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
                              {r.avatarUrl ? (
                                <Image
                                  src={r.avatarUrl}
                                  alt={r.handle}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center font-bold text-zinc-500">
                                  {r.handle.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-zinc-100 truncate flex items-center gap-1">
                                <span>{r.fullName || r.handle}</span>
                              </div>
                              <div className="font-mono text-[11px] text-zinc-400">@{r.handle}</div>
                            </div>
                          </div>
                        </td>

                        {/* City & Niche */}
                        <td className="px-4 py-3">
                          <div className="text-zinc-200">{r.city}</div>
                          <div className="text-[10px] text-zinc-500">{r.niche}</div>
                        </td>

                        {/* Followers */}
                        <td className="px-4 py-3 font-mono font-bold text-zinc-200">
                          {r.followerCount > 0 ? formatFollowers(r.followerCount) : '—'}
                        </td>

                        {/* Engagement */}
                        <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                          {r.engagementRate > 0 ? formatPercentage(r.engagementRate) : '—'}
                        </td>

                        {/* Reel Views */}
                        <td className="px-4 py-3 font-mono text-zinc-300">
                          {r.avgReelViews > 0 ? formatFollowers(r.avgReelViews) : '—'}
                        </td>

                        {/* Verified Email */}
                        <td className="px-4 py-3">
                          {r.businessEmail ? (
                            <button
                              onClick={() => handleCopyEmail(r.businessEmail!)}
                              className="group flex items-center gap-1.5 font-mono text-xs text-zinc-200 hover:text-emerald-400 transition-colors"
                              title="Click to copy email"
                            >
                              <span className="truncate max-w-[160px]">{r.businessEmail}</span>
                              {copiedEmail === r.businessEmail ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          ) : (
                            <span className="text-zinc-500 italic text-[11px]">Unlisted</span>
                          )}
                        </td>

                        {/* Authenticity */}
                        <td className="px-4 py-3 font-mono">
                          {r.authenticityScore > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                              <ShieldCheck className="h-3 w-3" />
                              <span>{r.authenticityScore}/100</span>
                            </span>
                          ) : (
                            <span className="text-zinc-500">—</span>
                          )}
                        </td>

                        {/* Source Status */}
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold ${
                              r.isCached
                                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                : r.status === 'SUCCESS'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {r.isCached ? 'CACHED' : r.status === 'SUCCESS' ? 'APIFY LIVE' : 'FAILED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SAVE TO SHORTLIST MODAL */}
      {isShortlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-emerald-400" />
                <span>Save Enriched Creators to Shortlist</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Add all verified creators from this batch directly into a campaign cohort.
              </p>
            </div>

            <div className="space-y-3">
              {shortlists.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                    Choose Existing Shortlist
                  </label>
                  <select
                    value={selectedShortlistId}
                    onChange={(e) => {
                      setSelectedShortlistId(e.target.value);
                      setNewShortlistName('');
                    }}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">-- Or create a new shortlist below --</option>
                    {shortlists.map((sl) => (
                      <option key={sl.id} value={sl.id}>
                        {sl.name} ({sl.items?.length || sl.creatorCount || 0} creators)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                  Or Create New Shortlist Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enriched Brand Outreach Cohort"
                  value={newShortlistName}
                  onChange={(e) => {
                    setNewShortlistName(e.target.value);
                    setSelectedShortlistId('');
                  }}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShortlistModalOpen(false)}
                disabled={isSavingShortlist}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSavingShortlist}
                onClick={handleSaveToShortlist}
              >
                Save Creators
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
