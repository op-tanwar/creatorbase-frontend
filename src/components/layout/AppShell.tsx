'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CreatorDetailModal } from '../creators/CreatorDetailModal';
import { AddToShortlistModal } from '../creators/AddToShortlistModal';

import { PublicNavbar } from '../marketing/PublicNavbar';
import { PublicFooter } from '../marketing/PublicFooter';

// Whitelist of public marketing routes that render with PublicNavbar & PublicFooter
const PUBLIC_MARKETING_ROUTES = [
  '/',
  '/pricing',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/refund-policy',
  '/shipping-policy',
  '/shipping-delivery',
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Normalize pathname to remove any trailing slash
  const normalizedPath = pathname.replace(/\/$/, '') || '/';

  const isPublicMarketingPage =
    PUBLIC_MARKETING_ROUTES.includes(normalizedPath) ||
    normalizedPath.startsWith('/creators');

  if (isPublicMarketingPage) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-white">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    );
  }

  const isAuthPage = normalizedPath === '/login' || normalizedPath === '/register';

  if (isAuthPage) {
    return <main className="min-h-screen bg-zinc-950 text-zinc-100">{children}</main>;
  }

  if (pathname.startsWith('/pitch')) {
    return (
      <main className="min-h-screen bg-[#08090B] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-white">
        {children}
      </main>
    );
  }

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  const getPageInfo = () => {
    if (pathname.startsWith('/discover')) {
      return {
        title: 'Influencer Discovery Hub',
        subtitle: 'Search, filter, and analyze verified Indian creators across niches and cities',
      };
    }
    if (pathname.startsWith('/shortlists')) {
      return {
        title: 'Campaign Shortlists',
        subtitle: 'Review cohorts, assign commercial fees, and export data in clean CSV format',
      };
    }
    if (pathname.startsWith('/enrich')) {
      return {
        title: 'Bulk CSV & Handle Enrichment',
        subtitle: 'Upload raw creator handles, audit with live Apify metrics, and export client-ready CSVs',
      };
    }
    if (pathname.startsWith('/campaigns')) {
      return {
        title: 'Campaign Management',
        subtitle: 'Allocate budgets, track projected reach, and coordinate influencer deliverables',
      };
    }
    if (pathname.startsWith('/profile')) {
      return {
        title: 'Organization & Profile Settings',
        subtitle: 'Manage your credentials, active subscription, and billing history',
      };
    }
    return {
      title: 'CreatorBase Dashboard',
      subtitle: 'Indian Influencer Discovery & Campaign Management SaaS',
    };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Desktop Persistent Sidebar (>= 1024px) */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile & Tablet Drawer Sidebar (< 1024px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-64 flex-1 flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0 overflow-x-hidden">
        <Navbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main className="flex-1 w-full  mx-auto px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10 bg-[#0B0C0E] overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Global Modals for Creator detail analytics & shortlisting */}
      <CreatorDetailModal />
      <AddToShortlistModal />
    </div>
  );
}
