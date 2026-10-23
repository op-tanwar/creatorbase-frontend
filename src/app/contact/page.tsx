'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
  Send,
  Building,
  CheckCircle2,
  ExternalLink,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '₹1L - ₹5L',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/contact/inbound', {
        fullName: formData.name.trim(),
        workEmail: formData.email.trim(),
        companyName: formData.company.trim(),
        budget: formData.budget,
        notes: formData.message.trim() || undefined,
      });

      if (res.data.success) {
        setSubmitted(true);
        toast.success('Consultation request received! Our campaign specialist will contact you within 2 hours.');
      } else {
        toast.error(res.data.message || 'Failed to submit consultation request');
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to send consultation request. Please email support@creatorbase.in directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-zinc-950 py-16 sm:py-24 text-zinc-100">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-indigo-600/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Connect with Us</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            Talk to an Indian Creator Campaign Specialist.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Need a custom enterprise plan, regional Tier-2 creator scraping, or a 1-on-1 walkthrough for your agency? We respond in under 2 hours.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left Details Panel (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Direct Channels</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Reach our leadership and support team directly.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">General Support &amp; Billing</span>
                  <div className="space-y-0.5">
                    <a
                      href="mailto:support@creatorbase.in"
                      className="font-medium text-white hover:text-emerald-400 transition-colors block text-xs font-mono"
                    >
                      support@creatorbase.in
                    </a>
                    <a
                      href="mailto:billing@creatorbase.in"
                      className="font-medium text-zinc-300 hover:text-emerald-400 transition-colors block text-xs font-mono"
                    >
                      billing@creatorbase.in
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">WhatsApp for Business</span>
                  <a
                    href="https://wa.me/919826000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-emerald-400 hover:underline"
                  >
                    <span>+91 98260 00000</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Registered Operational Address</span>
                  <p className="font-medium text-white leading-snug text-xs">
                    CreatorBase Technologies<br />
                    Scheme 54, Vijay Nagar, Indore, Madhya Pradesh 452010 (India)
                  </p>
                </div>
              </div>

              {/* Grievance Officer Notice (Indian IT Act 2000 & Consumer Protection Rules) */}
              <div id="grievance" className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 font-mono text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Designated Grievance Officer</span>
                </div>
                <p className="text-zinc-200">Mr. Rohan Sharma</p>
                <p className="text-zinc-400">Head of Compliance &amp; Regulatory Redressal</p>
                <p className="text-zinc-400">Email: <a href="mailto:grievance@creatorbase.in" className="text-emerald-400 underline">grievance@creatorbase.in</a></p>
                <p className="text-zinc-500 text-[10px] pt-1">
                  Acknowledgement SLA: 48 hours | Resolution: 30 days under Rule 3(2) of IT Rules 2021
                </p>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Operating Hours</span>
                  <p className="font-medium text-white text-xs">
                    Monday – Saturday (9:30 AM – 7:30 PM IST)
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800/80 pt-5 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>NDA signed prior to campaign data sharing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>GST Tax Invoicing available for all plans</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Direct bank transfer &amp; UPI supported</span>
              </div>
            </div>
          </div>

          {/* Right Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-md">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Received!</h3>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our campaign strategist will reach out to <span className="text-emerald-400">{formData.email}</span> with a customized creator breakdown.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', company: '', budget: '₹1L - ₹5L', message: '' });
                    }}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white">Send Consultation Request</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Rao"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="aditi@agency.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Company / Agency Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elevation Media"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Monthly Influencer Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="< ₹1 Lakh">&lt; ₹1 Lakh</option>
                      <option value="₹1L - ₹5L">₹1L - ₹5L</option>
                      <option value="₹5L - ₹20L">₹5L - ₹20L</option>
                      <option value="₹20L+">₹20L+ (Enterprise Scale)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    What cities or niches are you targeting?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your brand category, target cities (e.g. Indore, Bhopal), or custom scraping requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-zinc-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Submitting...' : 'Request Campaign Consultation'}</span>
                </button>

                <p className="text-[11px] text-zinc-500 text-center">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
