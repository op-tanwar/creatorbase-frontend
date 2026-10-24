export interface CityInfo {
  name: string;
  state: string;
  hub: string;
  tier: 1 | 2 | 3;
}

export interface NicheInfo {
  label: string;
  icon: string;
  multiplier: number;
  description: string;
}

export const INDIAN_CITIES_LIST = [
  'All',
  // Tier 1 Metros
  'Mumbai',
  'Delhi NCR',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  // Tier 2 & 3 Commercial Hubs
  'Indore',
  'Bhopal',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Chandigarh',
  'Ludhiana',
  'Kanpur',
  'Nagpur',
  'Vadodara',
  'Kochi',
  'Coimbatore',
  'Patna',
  'Dehradun',
  'Raipur',
  'Ranchi',
  'Guwahati',
  'Bhubaneswar',
  'Varanasi',
  'Agra',
  'Amritsar',
  'Jodhpur',
  'Udaipur',
  'Meerut',
  'Rajkot',
  'Jabalpur',
  'Gwalior',
  'Visakhapatnam',
  'Mysore',
  'Nashik',
  'Goa',
] as const;

export const PAN_INDIA_CITY_MAP: Record<string, CityInfo> = {
  // Tier 1
  mumbai: { name: 'Mumbai', state: 'Maharashtra', hub: 'Financial & Entertainment Capital', tier: 1 },
  delhi: { name: 'Delhi NCR', state: 'National Capital Region', hub: 'Northern Media & Commerce Hub', tier: 1 },
  'delhi-ncr': { name: 'Delhi NCR', state: 'National Capital Region', hub: 'Northern Media & Commerce Hub', tier: 1 },
  bangalore: { name: 'Bangalore', state: 'Karnataka', hub: 'Silicon Valley & Startup Epicenter', tier: 1 },
  bengaluru: { name: 'Bengaluru', state: 'Karnataka', hub: 'Silicon Valley & Startup Epicenter', tier: 1 },
  hyderabad: { name: 'Hyderabad', state: 'Telangana', hub: 'HITEC City & South Indian Media', tier: 1 },
  chennai: { name: 'Chennai', state: 'Tamil Nadu', hub: 'Automobile & SaaS Capital', tier: 1 },
  kolkata: { name: 'Kolkata', state: 'West Bengal', hub: 'Eastern Cultural & Commercial Epicenter', tier: 1 },
  pune: { name: 'Pune', state: 'Maharashtra', hub: 'Automotive & Higher Education Hub', tier: 1 },
  ahmedabad: { name: 'Ahmedabad', state: 'Gujarat', hub: 'Commercial, Textile & D2C Powerhouse', tier: 1 },

  // Tier 2 & Tier 3
  indore: { name: 'Indore', state: 'Madhya Pradesh', hub: 'Central India Tier-2 Commercial & Culinary Capital', tier: 2 },
  bhopal: { name: 'Bhopal', state: 'Madhya Pradesh', hub: 'City of Lakes, Heritage & Administrative Center', tier: 2 },
  jaipur: { name: 'Jaipur', state: 'Rajasthan', hub: 'Heritage, Craft & Pink City Tourism Hub', tier: 2 },
  surat: { name: 'Surat', state: 'Gujarat', hub: 'Diamond, Textile & High-Velocity D2C Center', tier: 2 },
  lucknow: { name: 'Lucknow', state: 'Uttar Pradesh', hub: 'Northern Cultural & Awadhi Heritage Hub', tier: 2 },
  chandigarh: { name: 'Chandigarh', state: 'Punjab & Haryana', hub: 'North Indian Lifestyle & Fashion Epicenter', tier: 2 },
  ludhiana: { name: 'Ludhiana', state: 'Punjab', hub: 'Industrial & Apparel Manufacturing Capital', tier: 2 },
  kanpur: { name: 'Kanpur', state: 'Uttar Pradesh', hub: 'Central UP Commercial Hub', tier: 2 },
  nagpur: { name: 'Nagpur', state: 'Maharashtra', hub: 'Zero Mile Logistics & Citrus Capital', tier: 2 },
  vadodara: { name: 'Vadodara', state: 'Gujarat', hub: 'Cultural & Petrochemical Center', tier: 2 },
  kochi: { name: 'Kochi', state: 'Kerala', hub: 'Spice Coast, FinTech & Coastal Creative Hub', tier: 2 },
  coimbatore: { name: 'Coimbatore', state: 'Tamil Nadu', hub: 'Manchester of South India & Textile Hub', tier: 2 },
  patna: { name: 'Patna', state: 'Bihar', hub: 'Eastern Educational & EdTech Creator Center', tier: 2 },
  dehradun: { name: 'Dehradun', state: 'Uttarakhand', hub: 'Himalayan Foothills & Outdoor Adventure Hub', tier: 2 },
  raipur: { name: 'Raipur', state: 'Chhattisgarh', hub: 'Central Mineral & Industrial Center', tier: 2 },
  ranchi: { name: 'Ranchi', state: 'Jharkhand', hub: 'Sports, Metal & Eastern Regional Hub', tier: 2 },
  guwahati: { name: 'Guwahati', state: 'Assam', hub: 'Gateway to Northeast India Media Hub', tier: 2 },
  bhubaneswar: { name: 'Bhubaneswar', state: 'Odisha', hub: 'Temple City & Eastern IT Corridor', tier: 2 },
  varanasi: { name: 'Varanasi', state: 'Uttar Pradesh', hub: 'Spiritual, Silk & Ancient Heritage Capital', tier: 3 },
  agra: { name: 'Agra', state: 'Uttar Pradesh', hub: 'Taj Heritage, Tourism & Leather Center', tier: 3 },
  amritsar: { name: 'Amritsar', state: 'Punjab', hub: 'Golden Temple Heritage & Culinary Center', tier: 3 },
  jodhpur: { name: 'Jodhpur', state: 'Rajasthan', hub: 'Sun City of Handicrafts & Heritage Tourism', tier: 3 },
  udaipur: { name: 'Udaipur', state: 'Rajasthan', hub: 'Lake City Luxury Wedding & Tourism Hub', tier: 3 },
  meerut: { name: 'Meerut', state: 'Uttar Pradesh', hub: 'Sports Goods & NCR Extension Corridor', tier: 3 },
  rajkot: { name: 'Rajkot', state: 'Gujarat', hub: 'Saurashtra Industrial & Auto Component Hub', tier: 3 },
  jabalpur: { name: 'Jabalpur', state: 'Madhya Pradesh', hub: 'Marble City & Mahakoshal Center', tier: 3 },
  gwalior: { name: 'Gwalior', state: 'Madhya Pradesh', hub: 'Chambal Fort & Heritage Center', tier: 3 },
  visakhapatnam: { name: 'Visakhapatnam', state: 'Andhra Pradesh', hub: 'Port City of Eastern Naval & IT Hub', tier: 2 },
  mysore: { name: 'Mysore', state: 'Karnataka', hub: 'Heritage Palace & Clean City Hub', tier: 3 },
  nashik: { name: 'Nashik', state: 'Maharashtra', hub: 'Wine Capital & Industrial Agriculture Corridor', tier: 2 },
  goa: { name: 'Goa', state: 'Goa', hub: 'Hospitality & Luxury Lifestyle Hub', tier: 2 },
};

export const FULL_SPECTRUM_NICHES = [
  'All',
  'Tech & Gadgets',
  'Finance & FinTech',
  'Fashion & Style',
  'Beauty & Skincare',
  'Food & Street Culinary',
  'Fitness & Bodybuilding',
  'Travel & Hospitality',
  'Gaming & Esports',
  'Comedy & Entertainment',
  'Parenting & Mom Bloggers',
  'Business & Startups',
  'Automobile & Moto',
  'Education & EdTech',
  'Lifestyle & Luxury',
] as const;

export const PAN_INDIA_NICHE_MAP: Record<string, NicheInfo> = {
  tech: {
    label: 'Tech & Gadgets',
    icon: '💻',
    multiplier: 2.2,
    description: 'Smartphone reviewers, AI prompt engineers, coding educators, and hardware specialists',
  },
  finance: {
    label: 'Finance & FinTech',
    icon: '📈',
    multiplier: 2.4,
    description: 'Stock market analysts, personal budgeting educators, mutual fund advisors, and tax strategists',
  },
  fashion: {
    label: 'Fashion & Style',
    icon: '👗',
    multiplier: 1.5,
    description: 'Ethnic wear curators, sustainable thrift stylists, luxury street-style models, and fashion editors',
  },
  beauty: {
    label: 'Beauty & Skincare',
    icon: '💄',
    multiplier: 1.55,
    description: 'Dermatologist-recommended skincare reviewers, clean makeup artists, and grooming influencers',
  },
  food: {
    label: 'Food & Street Culinary',
    icon: '🍽️',
    multiplier: 1.1,
    description: 'Street food reviewers, gourmet culinary creators, cafe scouts, and regional chef-led pages',
  },
  fitness: {
    label: 'Fitness & Bodybuilding',
    icon: '💪',
    multiplier: 1.35,
    description: 'Certified CrossFit trainers, yoga practitioners, nutrition consultants, and transformation athletes',
  },
  travel: {
    label: 'Travel & Hospitality',
    icon: '✈️',
    multiplier: 1.25,
    description: 'Backpacking vloggers, luxury resort reviewers, weekend getaway guides, and offbeat itinerary scouts',
  },
  gaming: {
    label: 'Gaming & Esports',
    icon: '🎮',
    multiplier: 1.3,
    description: 'Competitive BGMI streamers, PC build analysts, game commentary hosts, and interactive community leads',
  },
  comedy: {
    label: 'Comedy & Entertainment',
    icon: '🎭',
    multiplier: 1.0,
    description: 'Stand-up artists, relatable regional sketch creators, satire producers, and viral meme creators',
  },
  parenting: {
    label: 'Parenting & Mom Bloggers',
    icon: '🍼',
    multiplier: 1.3,
    description: 'Pediatric nutrition advocates, early education reviewers, and modern working mom creators',
  },
  business: {
    label: 'Business & Startups',
    icon: '🚀',
    multiplier: 2.1,
    description: 'Founder stories, venture capital insights, D2C brand breakdowns, and growth strategy breakdowns',
  },
  automobile: {
    label: 'Automobile & Moto',
    icon: '🏎️',
    multiplier: 1.7,
    description: 'EV test-drivers, supercar vloggers, motorcycle road-trippers, and modification specialists',
  },
  education: {
    label: 'Education & EdTech',
    icon: '📚',
    multiplier: 1.4,
    description: 'Competitive exam mentors (UPSC/JEE), language coaches, career counselors, and STEM educators',
  },
  lifestyle: {
    label: 'Lifestyle & Luxury',
    icon: '✨',
    multiplier: 1.25,
    description: 'City aesthetics, luxury home interiors, daily executive vlogs, and regional culture ambassadors',
  },
};
