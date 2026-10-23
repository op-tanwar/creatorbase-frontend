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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0B0C0E] bg-grid-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

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
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-lg shadow-emerald-950/80">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Start Free Agency Trial
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Discover 50,000+ verified Indian influencers and manage campaigns with precision.
          </p>
        </div>

        <div className="rounded-xl bg-[#121316] border border-[#24272E] p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
          <div className="border-b border-[#20232A] pb-3">
            <h2 className="text-base font-bold text-white">Register Workspace</h2>
            <p className="text-xs text-zinc-400">Get instant access to influencer intelligence</p>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-rose-950/50 border border-rose-800/60 p-3 text-xs text-rose-300 flex items-center gap-2">
              <span className="font-semibold">Error:</span> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Aditi Rao"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Company / Agency Name"
              type="text"
              placeholder="e.g. Elevation Media"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4" />}
              required
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="e.g. aditi@elevationmedia.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
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
              Create Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>No credit card required. Free trial tier enabled.</span>
        </div>
      </div>
    </div>
  );
}
