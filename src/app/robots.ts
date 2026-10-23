import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/about',
          '/contact',
          '/terms',
          '/privacy',
          '/refund-policy',
          '/shipping-delivery',
          '/creators',
          '/creators/*',
          '/pitch/*',
        ],
        disallow: [
          '/discover',
          '/discover/*',
          '/shortlists',
          '/shortlists/*',
          '/campaigns',
          '/campaigns/*',
          '/profile',
          '/profile/*',
          '/admin',
          '/admin/*',
          '/api/',
          '/api/*',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/about', '/pricing', '/creators', '/creators/*'],
        disallow: ['/admin', '/api/*', '/discover', '/shortlists'],
      },
    ],
    sitemap: 'https://creatorbase.in/sitemap.xml',
    host: 'https://creatorbase.in',
  };
}
