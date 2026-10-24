import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/providers/StoreProvider';
import { AppShell } from '@/components/layout/AppShell';
import { OrganizationJsonLd, SoftwareAppJsonLd } from '@/components/seo/JsonLd';

export const viewport: Viewport = {
  themeColor: '#08090B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://creatorbase.in'),
  title: {
    default: 'CreatorBase 🇮🇳 — Verified Indian Influencer Search Engine',
    template: '%s | CreatorBase 🇮🇳 — Verified Indian Influencer Search Engine',
  },
  description:
    'Search, filter, and contact 1,000+ verified Indian Instagram and YouTube creators across Indore, Mumbai, Delhi, Bengaluru, and 10+ niches with real engagement rates, audience locations, and rate cards.',
  keywords: [
    'Indian influencer marketing',
    'Instagram creators India',
    'Indore influencers',
    'Mumbai food bloggers',
    'Delhi tech creators',
    'Bengaluru lifestyle influencers',
    'YouTube creators India',
    'influencer discovery tool',
    'creator rate card calculator',
    'verified influencer business emails',
    'micro influencers India',
  ],
  authors: [{ name: 'CreatorBase Technologies', url: 'https://creatorbase.in' }],
  creator: 'CreatorBase Technologies',
  publisher: 'CreatorBase Technologies',
  applicationName: 'CreatorBase',
  category: 'Business Software',
  alternates: {
    canonical: 'https://creatorbase.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://creatorbase.in',
    siteName: 'CreatorBase',
    title: 'CreatorBase 🇮🇳 — Verified Indian Influencer Search Engine & Discovery Platform',
    description:
      'Discover 1,000+ authentic Indian Instagram & YouTube creators with verified engagement, city breakdowns, and direct collaboration contact.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'CreatorBase - India Influencer Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreatorBase 🇮🇳 — Verified Indian Influencer Search Engine',
    description:
      'Discover 1,000+ authentic Indian Instagram & YouTube creators with verified engagement, city breakdowns, and direct collaboration contact.',
    creator: '@creatorbase_in',
    images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <OrganizationJsonLd />
        <SoftwareAppJsonLd />
      </head>
      <body
        className="min-h-screen bg-[#0B0C0E] text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-white overflow-x-hidden"
        suppressHydrationWarning
      >
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
