'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, User, Building2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || !companyName || !password) {
      setErrorMessage('Please fill out all fields');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        companyName: companyName.trim(),
        password,
      });

      if (res.data.success && res.data.data) {
        const { user, token } = res.data.data;
        dispatch(setCredentials({ user, token }));
        toast.success(`Account created! Welcome to CreatorBase, ${user.name}`);
        router.push('/discover');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Registration failed. Please check your details.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
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
            Start Free Agency Trial
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto font-sans leading-relaxed">
            Discover audited Indian creators and share 1-click client decks.
          </p>
        </div>

        {/* Obsidian Glass Form Card */}
        <div className="rounded-2xl bg-[#0C0E12]/90 border border-white/[0.08] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl space-y-5">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-sm font-bold text-white font-sans">Register Workspace</h2>
            <p className="text-[11px] font-mono text-zinc-400">Get instant access to Indian creator telemetry</p>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-rose-950/40 border border-rose-500/30 p-3 text-xs font-mono text-rose-300 flex items-center gap-2">
              <span className="font-semibold">Error:</span> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Vikram Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-emerald-400" />}
              autoComplete="name"
              required
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="e.g. vikram@agency.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-emerald-400" />}
              autoComplete="email"
              required
            />

            <Input
              label="Company / Agency Name"
              type="text"
              placeholder="e.g. Horizon Media Mumbai"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4 text-emerald-400" />}
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-emerald-400" />}
              autoComplete="new-password"
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
              Start 7-Day Free Trial
            </Button>
          </form>

          <div className="pt-3 text-center text-xs text-zinc-400 font-mono border-t border-white/[0.06]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign In →
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Credit Card Required • Instant Sandbox Access</span>
        </div>
      </div>
    </div>
  );
}
