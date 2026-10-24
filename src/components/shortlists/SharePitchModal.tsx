'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Lock,
  Globe,
  Sparkles,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface SharePitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortlist: {
    id: string;
    name: string;
    shareToken?: string | null;
    campaign?: {
      title?: string;
    } | null;
  };
}

export function SharePitchModal({ isOpen, onClose, shortlist }: SharePitchModalProps) {
  const [copied, setCopied] = useState(false);
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [clientName, setClientName] = useState(shortlist.campaign?.title || 'Brand Partner');

  const shareToken = shortlist.shareToken || shortlist.id;
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://creatorbase.in';

  const shareUrl = `${baseUrl}/pitch/${shareToken}${
    isPasscodeEnabled && passcode ? `?code=${encodeURIComponent(passcode)}` : ''
  }`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Client Pitch Deck link copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Pitch Deck with Brand Client"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* White-Label Agency Header Preview */}
        <div className="rounded-xl bg-gradient-to-br from-[#121316] to-emerald-950/20 border border-emerald-500/30 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              White-Label Client Portal
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
              Zero Login Required
            </span>
          </div>
          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            Eliminate messy Google Sheets. Brand managers open a clean, interactive portal to review authentic metrics and click <strong className="text-emerald-400">Approve ✅</strong> or <strong className="text-rose-400">Decline ❌</strong> on each creator in real time.
          </p>
        </div>

        {/* Client Branding Configuration */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Client / Brand Name (Displays on Pitch Header)
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Mamaearth Brand Team"
              className="w-full rounded-xl bg-[#0B0C0E] border border-[#2E333D] px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Optional Password Protection Toggle */}
          <div className="rounded-xl bg-[#0B0C0E] border border-[#24272E] p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-medium text-zinc-200">
                  Optional Access Passcode
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPasscodeEnabled}
                  onChange={(e) => setIsPasscodeEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            {isPasscodeEnabled && (
              <div className="pt-1">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Set 4-8 character PIN (e.g. 2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-lg bg-[#121316] border border-zinc-700 px-3 py-1.5 text-xs font-mono text-emerald-400 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Generated Shareable URL */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-mono text-zinc-300 flex items-center justify-between">
            <span>Client Share Link</span>
            <span className="text-[10px] text-emerald-400 font-mono">Live Sync Active 🟢</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-xl bg-[#0B0C0E] border border-[#262930] px-3.5 py-2.5 text-xs font-mono text-emerald-400 select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-mono font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shrink-0 shadow-sm shadow-emerald-500/20 active:scale-[0.98]"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs font-mono">
          <span className="text-zinc-500">
            Roster: <strong className="text-zinc-300">{shortlist.name}</strong>
          </span>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            <span>Open Live Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Modal>
  );
}
