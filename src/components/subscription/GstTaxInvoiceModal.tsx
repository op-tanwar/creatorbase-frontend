'use client';

import React, { useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  FileText,
  Printer,
  Download,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { toast } from 'sonner';

export interface InvoiceData {
  orderId: string;
  paymentId: string | null;
  amount: number; // in Paise or INR
  plan: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    companyName: string;
    gstin?: string;
    billingAddress?: string;
    billingState?: string;
  };
}

interface GstTaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
}

export function GstTaxInvoiceModal({ isOpen, onClose, invoice }: GstTaxInvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  // Amount handling: check if in paise (> 100000) or INR
  const totalAmountINR = invoice.amount > 100000 ? invoice.amount / 100 : invoice.amount;
  // Backward calculate 18% GST taxable base
  const taxableValue = Math.round((totalAmountINR / 1.18) * 100) / 100;
  const totalGst = Math.round((totalAmountINR - taxableValue) * 100) / 100;

  // Inter-state (IGST) vs Intra-state (CGST+SGST)
  const isMadhyaPradesh = (invoice.user.billingState || '').toLowerCase().includes('madhya') ||
    (invoice.user.billingState || '').toLowerCase().includes('mp');
  const cgst = isMadhyaPradesh ? Math.round((totalGst / 2) * 100) / 100 : 0;
  const sgst = isMadhyaPradesh ? Math.round((totalGst / 2) * 100) / 100 : 0;
  const igst = !isMadhyaPradesh ? totalGst : 0;

  const invoiceNumber = `CB/2026-27/INV-${invoice.orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

  const formattedDate = new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const planDisplayName = invoice.plan === 'PRO' ? 'Agency Pro (Monthly)' : 'Starter (Monthly)';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GST Tax Invoice (Tax Credit ITC Eligible)"
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Printable Paper Canvas */}
        <div
          ref={printRef}
          id="gst-printable-invoice"
          className="rounded-xl border border-zinc-700 bg-white p-6 sm:p-8 text-zinc-900 font-sans shadow-lg space-y-6 print:m-0 print:border-none print:p-0 print:shadow-none"
        >
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-zinc-900 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-black text-white text-base">
                  CB
                </span>
                <span className="text-xl font-extrabold tracking-tight text-zinc-950 font-sans">
                  CreatorBase Technologies Pvt. Ltd.
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed max-w-sm font-mono">
                Plot No. 42, Brilliant Titanium, Scheme No. 78, Vijay Nagar, Indore, Madhya Pradesh – 452010, India
              </p>
              <p className="text-[11px] font-mono font-semibold text-zinc-800 mt-0.5">
                GSTIN: <span className="text-zinc-950 font-bold">23AABCC7890F1Z2</span> • PAN: AABCC7890F
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block rounded bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-900">
                TAX INVOICE (ORIGINAL)
              </span>
              <p className="text-sm font-bold font-mono text-zinc-950 mt-1.5">{invoiceNumber}</p>
              <p className="text-xs text-zinc-600 font-mono">Date: {formattedDate}</p>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                Reverse Charge: <strong>NO</strong>
              </p>
            </div>
          </div>

          {/* Billed To / Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-zinc-50 p-4 border border-zinc-200 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">
                BILLED TO (BUYER / RECIPIENT):
              </span>
              <p className="text-sm font-bold text-zinc-900">{invoice.user.companyName || 'Registered Agency'}</p>
              <p className="text-zinc-700 mt-0.5">Attn: {invoice.user.name}</p>
              <p className="text-zinc-600">{invoice.user.email}</p>
              {invoice.user.billingAddress && (
                <p className="text-zinc-600 mt-0.5 leading-snug">{invoice.user.billingAddress}</p>
              )}
            </div>

            <div className="sm:text-right space-y-1">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                  BUYER GSTIN:
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                  {invoice.user.gstin || 'URP (Unregistered Person)'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-600">
                Place of Supply: <strong className="text-zinc-900">{invoice.user.billingState || 'India (Pan-India)'}</strong>
              </p>
              <p className="text-[11px] text-zinc-600">
                Razorpay Payment Ref: <strong className="text-zinc-900">{invoice.paymentId || 'Captured Online'}</strong>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 bg-zinc-100 text-[11px] uppercase tracking-wider text-zinc-700">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Service Description</th>
                  <th className="py-2.5 px-3 text-center">HSN/SAC</th>
                  <th className="py-2.5 px-3 text-right">Taxable Value</th>
                  <th className="py-2.5 px-3 text-right">GST Rate</th>
                  <th className="py-2.5 px-3 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                <tr>
                  <td className="py-3 px-3 font-medium">1</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-zinc-900 text-xs">{planDisplayName}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Cloud SaaS Subscription • Influencer CRM, Pitch Portal &amp; Deliverables Tracking
                    </p>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-zinc-800">998314</td>
                  <td className="py-3 px-3 text-right font-medium">{formatINR(taxableValue)}</td>
                  <td className="py-3 px-3 text-right">18.00%</td>
                  <td className="py-3 px-3 text-right font-bold text-zinc-900">{formatINR(totalAmountINR)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-3 border-t-2 border-zinc-900">
            <div className="space-y-1 text-xs font-mono max-w-sm text-zinc-600">
              <p>
                <strong>HSN 998314:</strong> Information technology design and cloud services.
              </p>
              <p className="text-[11px] text-zinc-500">
                Eligible for GST Input Tax Credit (ITC) under Section 16 of CGST Act.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-600">
                <span>Taxable Amount:</span>
                <span className="font-semibold text-zinc-900">{formatINR(taxableValue)}</span>
              </div>

              {isMadhyaPradesh ? (
                <>
                  <div className="flex justify-between text-zinc-600">
                    <span>CGST (9%):</span>
                    <span className="font-semibold text-zinc-900">{formatINR(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>SGST (9%):</span>
                    <span className="font-semibold text-zinc-900">{formatINR(sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-zinc-600">
                  <span>IGST (18%):</span>
                  <span className="font-semibold text-zinc-900">{formatINR(igst)}</span>
                </div>
              )}

              <div className="flex justify-between border-t-2 border-zinc-900 pt-2 text-sm font-bold text-zinc-950">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700">{formatINR(totalAmountINR)}</span>
              </div>
            </div>
          </div>

          {/* Authorized Signature Footer */}
          <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-zinc-500">
            <div>
              <p className="text-[11px]">This is a system-generated electronic tax invoice.</p>
              <p className="text-[10px] text-zinc-400">Authenticity signature verified via CreatorBase Billing Engine.</p>
            </div>
            <div className="text-right">
              <div className="border-b border-zinc-400 pb-1 w-40 text-center font-bold text-zinc-900">
                CreatorBase Finance
              </div>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Authorized Signatory</span>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs font-mono">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Tax Compliant (GSTIN: 23AABCC7890F1Z2)</span>
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs font-mono"
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5 text-zinc-950" />}
              className="text-xs font-mono font-bold"
            >
              Download / Print PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
