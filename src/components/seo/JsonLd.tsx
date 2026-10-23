import React from 'react';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CreatorBase Technologies',
    alternateName: 'CreatorBase',
    url: 'https://creatorbase.in',
    logo: 'https://creatorbase.in/logo.png',
    email: 'support@creatorbase.in',
    description:
      'India’s premier influencer discovery and campaign intelligence platform indexing 1,000+ verified creators across Tier 1 and Tier 2 cities.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Scheme 54, Vijay Nagar',
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      postalCode: '452010',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-731-4050600',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    ],
    sameAs: [
      'https://twitter.com/creatorbase_in',
      'https://www.linkedin.com/company/creatorbase-in',
      'https://www.instagram.com/creatorbase.in',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareAppJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CreatorBase Influencer Discovery Engine',
    operatingSystem: 'All Modern Web Browsers',
    applicationCategory: 'BusinessApplication',
    description:
      'Enterprise creator intelligence engine featuring authentic audience analytics, engagement auditing, commercial rate card calculators, and verified contact unmasks.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '214',
      bestRating: '5',
      worstRating: '1',
    },
    offers: [
      {
        '@type': 'Offer',
        price: '2999',
        priceCurrency: 'INR',
        name: 'Starter Plan',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        description: 'Ideal for early-stage D2C brands and boutique creator agencies.',
      },
      {
        '@type': 'Offer',
        price: '7999',
        priceCurrency: 'INR',
        name: 'Growth Agency Plan',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        description: 'Unlimited creator search, client pitch portals, team collaboration, and CSV exports.',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does CreatorBase verify Indian influencer data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CreatorBase connects directly to Instagram and YouTube live data streams via Apify actors. Every profile undergoes our multi-step Audience Authenticity Gatekeeper, enforcing hard floors of 5,000+ followers, genuine 1.0%-20.0% engagement rates, minimum 15 posts, and bot-free viewer ratios.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are creator business emails verified and active?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All business emails on CreatorBase are sanitized with strict RFC-compliant regex filters. Generic or placeholder domains are purged, retaining only valid, deliverable collaboration inboxes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which Indian cities and creator niches are covered?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We index over 1,000 verified creators across Indore, Mumbai, Delhi NCR, Bengaluru, Pune, Jaipur, Hyderabad, Ahmedabad, Surat, Bhopal, and Chandigarh spanning Food, Tech, Fashion, Travel, Fitness, Finance, and Lifestyle.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I share creator shortlists with clients without requiring them to log in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! CreatorBase generates password-free, shareable Public Client Pitch Links (/pitch/:shareToken) where clients can review profiles, see commercial fee quotes, and approve or reject creators with 1 click.',
        },
      },
      {
        '@type': 'Question',
        name: 'What payment methods are supported for subscriptions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We accept all major Indian payment methods through Razorpay, including UPI (Google Pay, PhonePe, Paytm), Indian Debit/Credit Cards, Net Banking across 50+ banks, and Corporate Cards with instant GST invoicing.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; item: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
