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
  ArrowRight,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    city: 'Mumbai',
    budget: '₹5,00,000 - ₹20,00,000',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name is required (min 2 characters)';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid business email';
    }
    if (!formData.company.trim() || formData.company.trim().length < 2) {
      errs.company = 'Company / Agency name is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please resolve the highlighted fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/contact/inbound', {
        fullName: formData.name.trim(),
        workEmail: formData.email.trim().toLowerCase(),
        companyName: formData.company.trim(),
        city: formData.city,
        budgetINR: formData.budget,
        notes: formData.notes.trim() || undefined,
      });

      if (res.data.success) {
        setSubmitted(true);
        toast.success('Consultation request received! Check your inbox for confirmation.');
      } else {
        toast.error(res.data.message || 'Failed to submit consultation request');
      }
    } catch (err: any) {
      console.error('Contact submission error:', err);
      toast.error(
        err.response?.data?.message ||
          'Failed to send consultation request. Please email optanwar10@gmail.com directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#08090B] py-16 sm:py-24 text-zinc-100">
      {/* Background cyber glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/10 via-indigo-500/10 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-0 -z-10 h-[400px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Enterprise Agency Consultation • Dedicated SLA &lt; 2 Hours</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white">
            Scale Your Influencer Campaigns With An Enterprise OS.
          </h1>
          <p className="mt-5 text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed font-sans">
            Whether you manage ₹5L or ₹2Cr+ in monthly creator disbursements, let our campaign architects configure custom white-label portals, localized talent scraping, and automated deliverable verification for your agency.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Details Panel (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#12141A]/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Executive Contact Desk</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Priority
                </span>
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Direct SLA-backed communication channels for brands and agencies.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Senior Enterprise Desk</span>
                  <a
                    href="mailto:optanwar10@gmail.com"
                    className="font-medium text-white hover:text-emerald-400 transition-colors block text-xs font-mono"
                  >
                    optanwar10@gmail.com
                  </a>
                  <a
                    href="mailto:sales@creatorbase.in"
                    className="font-medium text-zinc-400 hover:text-emerald-400 transition-colors block text-xs font-mono"
                  >
                    sales@creatorbase.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">WhatsApp VIP Desk</span>
                  <a
                    href="https://wa.me/919826000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-emerald-400 hover:underline text-xs"
                  >
                    <span>+91 98260 00000</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-[10px] text-zinc-500 block">Avg. response under 15 mins</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Operational Headquarters</span>
                  <p className="font-medium text-zinc-200 leading-snug text-xs">
                    CreatorBase Technologies Inc.<br />
                    Vijay Nagar Commercial IT Corridor, Indore, MP 452010<br />
                    <span className="text-zinc-500 text-[11px]">Presence: Mumbai • Bengaluru • Delhi NCR</span>
                  </p>
                </div>
              </div>

              {/* Grievance & Compliance Notice */}
              <div id="grievance" className="rounded-xl border border-white/[0.08] bg-black/40 p-4 font-mono text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>GST &amp; Compliance Certified</span>
                </div>
                <p className="text-zinc-300">HSN/SAC: 998314 (Information Technology SaaS)</p>
                <p className="text-zinc-400">18% ITC GST Tax Invoices generated automatically on all plans.</p>
                <p className="text-zinc-500 text-[10px] pt-1 border-t border-white/[0.05]">
                  Indian IT Rules 2021 Compliant • Grievance Officer: grievance@creatorbase.in
                </p>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300 border border-white/[0.05]">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block">Operating Hours &amp; SLA</span>
                  <p className="font-medium text-white text-xs">
                    Mon – Sat (9:30 AM – 8:00 PM IST)
                  </p>
                  <p className="text-[11px] text-emerald-400">Guaranteed same-day onboarding setup</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-5 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>NDA &amp; Master Service Agreement (MSA) pre-signed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Custom API access &amp; bulk creator exports available</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span>Zero platform commission on influencer commercial payouts</span>
              </div>
            </div>
          </div>

          {/* Right Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#12141A]/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {submitted ? (
              <div className="text-center py-12 sm:py-16 space-y-5 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="h-9 w-9 text-emerald-400" />
                </div>
                <div>
                  <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
                    Request Received
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Our Enterprise Lead Will Connect in Under 2 Hours
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. A confirmation email and calendar invite has been dispatched to <span className="text-emerald-400 font-mono font-medium">{formData.email}</span>.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/pitch/sample-demo"
                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
                  >
                    Explore Sample Client Pitch Portal →
                  </Link>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        company: '',
                        city: 'Mumbai',
                        budget: '₹5,00,000 - ₹20,00,000',
                        notes: '',
                      });
                    }}
                    className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08] transition-all"
                  >
                    Submit Another Brief
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-white/[0.08] pb-4 mb-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Request Enterprise Agency Consultation
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Receive a custom rate-card audit and personalized talent pitch deck for your client.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Your Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aditi Rao"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      className={`w-full rounded-xl border bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-all focus:outline-none focus:ring-1 ${
                        errors.name
                          ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                          : 'border-white/[0.1] focus:border-emerald-500 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Work Email <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="aditi@agency.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full rounded-xl border bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-all focus:outline-none focus:ring-1 ${
                        errors.email
                          ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                          : 'border-white/[0.1] focus:border-emerald-500 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Company / Agency Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Elevation Media / D2C Labs"
                      value={formData.company}
                      onChange={(e) => {
                        setFormData({ ...formData, company: e.target.value });
                        if (errors.company) setErrors({ ...errors, company: '' });
                      }}
                      className={`w-full rounded-xl border bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-all focus:outline-none focus:ring-1 ${
                        errors.company
                          ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                          : 'border-white/[0.1] focus:border-emerald-500 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.company && <p className="mt-1 text-[11px] text-red-400">{errors.company}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Target City / Hub
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-white/[0.1] bg-black/50 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Pan-India">Pan-India (All Metros &amp; Tier-2)</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Indore">Indore (Tier-2 Epicenter)</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Ahmedabad">Ahmedabad / Surat</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Kolkata">Kolkata</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Estimated Monthly Campaign Budget (INR)
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.1] bg-black/50 px-3.5 py-2.5 text-sm font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="₹1,00,000 - ₹5,00,000">₹1,00,000 – ₹5,00,000 (Growth Sprint)</option>
                    <option value="₹5,00,000 - ₹20,00,000">₹5,00,000 – ₹20,00,000 (Scale Agency)</option>
                    <option value="₹20,00,000 - ₹50,00,000">₹20,00,000 – ₹50,00,000 (Enterprise Tier)</option>
                    <option value="₹50,00,000+">₹50,00,000+ (High-Volume Pan-India)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Target Niches &amp; Campaign Objectives
                  </label>
                  <textarea
                    rows={4}
                    placeholder="E.g. We are pitching a Tier-1 Fintech brand targeting 40 creators across Mumbai & Indore with min. 3.5% ER..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.1] bg-black/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:bg-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span>{submitting ? 'Dispatching to Campaign Desk...' : 'Schedule Consultation & Receive Custom Roster →'}</span>
                </button>

                <p className="text-[11px] text-zinc-500 text-center font-mono">
                  🔒 Enterprise grade privacy. Non-Disclosure Agreement (NDA) automatically in effect.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
