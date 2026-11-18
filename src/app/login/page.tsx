'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const res = await api.post('/auth/login', {
        email: loginEmail.trim(),
        password: loginPass,
      });

      if (res.data.success && res.data.data) {
        const { user, token } = res.data.data;
        dispatch(setCredentials({ user, token }));
        toast.success(`Welcome back, ${user.name}!`);
        if (user.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/discover');
        }
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Login failed. Please verify credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = async () => {
    setEmail('test@agency.com');
    setPassword('password123');
    toast.info('Authenticating demo account (Elevation Media)...');
    await executeLogin('test@agency.com', 'password123');
  };

  const handleFillAdmin = async () => {
    setEmail('admin@creatorbase.in');
    setPassword('adminpassword123');
    toast.info('Authenticating Super Admin account...');
    await executeLogin('admin@creatorbase.in', 'adminpassword123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    await executeLogin(email, password);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#060709] relative overflow-hidden">
      {/* Background radial spotlight */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="relative w-full max-w-md space-y-5">
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <span>&larr; Back to CreatorBase Home</span>
          </Link>
        </div>

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <svg
              className="h-5 w-5 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Sign In to CreatorBase
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto font-sans leading-relaxed">
            Influencer discovery, client pitch decks &amp; campaign tracking for Indian growth teams.
          </p>
        </div>

        {/* Obsidian Glass Auth Card */}
        <div className="rounded-2xl bg-[#0C0E12]/90 border border-white/[0.08] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl space-y-5">
          <div className="border-b border-white/[0.06] pb-3.5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white font-sans">Workspace Login</h2>
              <p className="text-[11px] font-mono text-zinc-400">Access saved cohorts and pitch portals</p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] font-mono font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-colors"
            >
              <KeyRound className="w-3 h-3" />
              <span>1-Click Demo</span>
            </button>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-rose-950/40 border border-rose-500/30 p-3 text-xs font-mono text-rose-300 flex items-center gap-2">
              <span className="font-semibold">Error:</span> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="e.g. aditi@agency.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-emerald-400" />}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-emerald-400" />}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-mono font-bold text-xs"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Workspace
            </Button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full border-white/[0.08] bg-[#08090C] text-emerald-400 hover:bg-emerald-950/30 text-xs font-mono"
                onClick={handleFillDemo}
                isLoading={isLoading}
                leftIcon={<KeyRound className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Agency Demo
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full border-white/[0.08] bg-[#08090C] text-amber-400 hover:bg-amber-950/30 text-xs font-mono"
                onClick={handleFillAdmin}
                isLoading={isLoading}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
              >
                Super Admin
              </Button>
            </div>
          </form>

          <div className="pt-3 text-center text-xs text-zinc-400 font-mono border-t border-white/[0.06]">
            Don&apos;t have an agency account yet?{' '}
            <Link
              href="/register"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create Account →
            </Link>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Enterprise-grade JWT Authentication • 256-Bit SSL</span>
        </div>
      </div>
    </div>
  );
}
