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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0B0C0E] bg-grid-pattern">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

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
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-lg shadow-emerald-950/80">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            CreatorBase India
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto font-sans">
            Influencer discovery, creator shortlisting &amp; campaign management for Indian brands and agencies.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl bg-[#121316] border border-[#24272E] p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
          <div className="border-b border-[#20232A] pb-3.5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Sign In to Workspace</h2>
              <p className="text-xs text-slate-400">Access your saved rosters and campaigns</p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 rounded-lg px-2.5 py-1 flex items-center gap-1 transition-colors"
              title="Click to fill test@agency.com / password123"
            >
              <KeyRound className="w-3 h-3" />
              Demo Login
            </button>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-rose-950/50 border border-rose-800/60 p-3 text-xs text-rose-300 flex items-center gap-2">
              <span className="font-semibold">Error:</span> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="e.g. aditi@brand.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 text-xs"
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
                className="w-full border border-amber-500/30 bg-amber-950/20 text-amber-400 hover:bg-amber-950/40 hover:text-amber-300 text-xs"
                onClick={handleFillAdmin}
                isLoading={isLoading}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
              >
                👑 Master Admin
              </Button>
            </div>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80">
            Don't have an agency account yet?{' '}
            <Link
              href="/register"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Enterprise-grade JWT token authentication</span>
        </div>
      </div>
    </div>
  );
}
