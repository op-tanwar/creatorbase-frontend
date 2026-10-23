import { MetadataRoute } from 'next';

export const revalidate = 86400; // Cache sitemap for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://creatorbase.in';
  const now = new Date();

  // Core static marketing and compliance pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-delivery`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Target high-intent Indian cities
  const cities = [
    'indore',
    'mumbai',
    'delhi',
    'bengaluru',
    'pune',
    'jaipur',
    'hyderabad',
    'ahmedabad',
    'surat',
    'bhopal',
    'chandigarh',
    'goa',
  ];

  // High-conversion creator niches
  const niches = [
    'food',
    'tech',
    'fashion',
    'travel',
    'fitness',
    'finance',
    'lifestyle',
    'gaming',
    'comedy',
    'beauty',
  ];

  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/creators/${city}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  const programmaticRoutes: MetadataRoute.Sitemap = [];
  for (const city of cities) {
    for (const niche of niches) {
      programmaticRoutes.push({
        url: `${baseUrl}/creators/${city}/${niche}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...cityRoutes, ...programmaticRoutes];
}
