'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import api from '@/lib/api';
import { loadRazorpayScript } from '@/lib/razorpay';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, Check, ShieldCheck, Zap, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  feature?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = 'Upgrade to Agency Pro',
  description = 'Upgrade to Agency Pro to export unlimited verified creator contacts & CSVs.',
  feature = 'CSV Export & Unlimited Contacts',
}: UpgradeModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    if (!isAuthenticated || !user) {
      toast.info('Please sign in to upgrade your subscription');
      router.push('/login?redirect=/pricing');
      return;
    }

    try {
      setIsProcessing(true);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Could not load payment gateway. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      // 1. Create order on backend
      const res = await api.post('/payments/create-order', {
        plan: 'PRO',
        billingCycle,
      });

      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || 'Failed to initialize payment');
      }

      const orderData = res.data.data;

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CreatorBase 🇮🇳',
        description: `Agency Pro ${billingCycle === 'annual' ? 'Annual' : 'Monthly'} Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#10b981',
          backdrop_color: 'rgba(11, 12, 14, 0.85)',
        },
        handler: async (response: any) => {
          try {
            // 3. Cryptographic signature verification
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success('Payment Successful! Welcome to Agency Pro 🚀');
              dispatch(setUser(verifyRes.data.data.user));
              onClose();
              router.push('/discover');
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (err: any) {
        toast.error(err.error?.description || 'Payment was unsuccessful');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Payment checkout failed');
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="space-y-6">
        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30" />
            <span>Pro Plan Required</span>
          </span>
          <span className="text-zinc-500 font-mono text-xs">• Instant Activation</span>
        </div>

        {/* Main Title & Context */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-sm text-zinc-400 font-mono leading-relaxed">
            {description}
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="rounded-xl bg-[#0B0C0E] border border-[#24272E] p-4 space-y-2.5">
          <div className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#1E222A]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unlocked with Agency Pro</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {[
              'Unlimited CSV Exports with INR (₹) rates',
              'Direct Business Email Contacts',
              'Tier 1, 2 & 3 City Filters (Indore, Surat)',
              'Audience Bot & Authenticity Scores',
              'Unlimited Campaign Shortlists',
              '3 Team Member Seats Included',
            ].map((f) => (
              <div key={f} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#16181D] border border-[#262930]">
          <div className="text-xs font-mono text-zinc-300 font-medium">
            <span>Billing Frequency</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0B0C0E] border border-[#24272E]">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly (₹7,999)
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-emerald-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Annual (₹6,399/mo)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1 rounded">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto text-xs font-mono"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="md"
            className="w-full sm:flex-1 text-xs font-mono font-bold py-2.5 shadow-lg shadow-emerald-950/50"
            onClick={handleUpgrade}
            disabled={isProcessing}
            leftIcon={
              isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-zinc-950" />
              )
            }
          >
            {isProcessing ? (
              <span>Connecting Secure Razorpay...</span>
            ) : (
              <span>
                Upgrade Now • {billingCycle === 'annual' ? '₹76,788 / year' : '₹7,999 / mo'}
              </span>
            )}
          </Button>
        </div>

        {/* Security Assurance */}
        <div className="text-center">
          <span className="text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            <span>100% Secure 256-Bit Encrypted Payments via Razorpay • GST Invoicing</span>
          </span>
        </div>
      </div>
    </Modal>
  );
}
