export interface DemoCreator {
  id: string;
  name: string;
  handle: string;
  city: string;
  state: string;
  niche: string;
  platform: 'INSTAGRAM' | 'YOUTUBE';
  followers: string;
  engagement: string;
  avgLikes: string;
  avgViews: string;
  rate: string;
  genderSplit: string;
  avatar: string;
  verified: boolean;
  authenticReach: string;
  medianReelViews: string;
  commercialRate: string;
  cpmInr: number;
  credibilityScore: number;
  contactEmail: string;
  regionalHub: string;
  bio: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  stars: number;
  highlight?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ComparisonRow {
  capability: string;
  legacyGlobal: string;
  legacyStatus: 'bad' | 'neutral';
  creatorBase: string;
  creatorBaseStatus: 'good';
  description: string;
}

export const DEMO_CREATORS: DemoCreator[] = [
  {
    id: 'c1',
    name: 'Rahul Agrawal',
    handle: '@indori_foodie_rahul',
    city: 'Indore',
    state: 'Madhya Pradesh',
    niche: 'Food & Cafes',
    platform: 'INSTAGRAM',
    followers: '148K',
    engagement: '5.8%',
    avgLikes: '8.2K',
    avgViews: '220K',
    rate: '₹14,000',
    genderSplit: '54% F / 46% M',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    verified: true,
    authenticReach: '94.2%',
    medianReelViews: '184.2K',
    commercialRate: '₹14,000 / Reel',
    cpmInr: 180,
    credibilityScore: 96.4,
    contactEmail: 'collabs@indorifoodie.in',
    regionalHub: 'Madhya Pradesh (78%)',
    bio: 'Authentic Malwa street food and hidden cafe culture explorer in Indore.',
  },
  {
    id: 'c2',
    name: 'Aarav Mehta',
    handle: '@mumbai_tech_review',
    city: 'Mumbai',
    state: 'Maharashtra',
    niche: 'Tech & Gadgets',
    platform: 'YOUTUBE',
    followers: '385K',
    engagement: '4.2%',
    avgLikes: '15.4K',
    avgViews: '410K',
    rate: '₹35,000',
    genderSplit: '28% F / 72% M',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    verified: true,
    authenticReach: '95.8%',
    medianReelViews: '320.5K',
    commercialRate: '₹35,000 / Video',
    cpmInr: 210,
    credibilityScore: 97.2,
    contactEmail: 'aarav@mumbaitech.co',
    regionalHub: 'Maharashtra & NCR (64%)',
    bio: 'Smartphone teardowns, budget gadget benchmarks, and honest consumer reviews.',
  },
  {
    id: 'c3',
    name: 'Ananya Sharma',
    handle: '@delhi_street_style',
    city: 'Delhi',
    state: 'Delhi NCR',
    niche: 'Fashion & Streetwear',
    platform: 'INSTAGRAM',
    followers: '215K',
    engagement: '6.1%',
    avgLikes: '12.8K',
    avgViews: '350K',
    rate: '₹22,000',
    genderSplit: '78% F / 22% M',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    verified: true,
    authenticReach: '96.1%',
    medianReelViews: '240.0K',
    commercialRate: '₹22,000 / Reel',
    cpmInr: 195,
    credibilityScore: 98.0,
    contactEmail: 'collabs@delhitech.in',
    regionalHub: 'Delhi NCR & Punjab (72%)',
    bio: 'Sarojini thrift flips, Janpath styling, and modern Gen-Z Indian aesthetic.',
  },
  {
    id: 'c4',
    name: 'Vikram Rajput',
    handle: '@jaipur_vlogs_vikram',
    city: 'Jaipur',
    state: 'Rajasthan',
    niche: 'Travel & Vlogs',
    platform: 'YOUTUBE',
    followers: '190K',
    engagement: '5.2%',
    avgLikes: '9.8K',
    avgViews: '280K',
    rate: '₹18,500',
    genderSplit: '42% F / 58% M',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    verified: true,
    authenticReach: '93.7%',
    medianReelViews: '195.4K',
    commercialRate: '₹18,500 / Reel',
    cpmInr: 175,
    credibilityScore: 94.8,
    contactEmail: 'vikram@jaipurvlogs.com',
    regionalHub: 'Rajasthan & Gujarat (68%)',
    bio: 'Exploring Rajasthan royal palaces, heritage stays, and hidden desert trails.',
  },
  {
    id: 'c5',
    name: 'Sneha Malviya',
    handle: '@indore_fit_sneha',
    city: 'Indore',
    state: 'Madhya Pradesh',
    niche: 'Fitness & Lifestyle',
    platform: 'INSTAGRAM',
    followers: '52K',
    engagement: '7.8%',
    avgLikes: '3.9K',
    avgViews: '98K',
    rate: '₹7,500',
    genderSplit: '66% F / 34% M',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    verified: false,
    authenticReach: '97.2%',
    medianReelViews: '85.0K',
    commercialRate: '₹7,500 / Reel',
    cpmInr: 140,
    credibilityScore: 98.4,
    contactEmail: 'fitwithsneha@gmail.com',
    regionalHub: 'Madhya Pradesh & Mumbai (81%)',
    bio: 'Functional strength, vegetarian meal prep, and daily habit coaching.',
  },
  {
    id: 'c6',
    name: 'Tanmay Bhattacharya',
    handle: '@bengaluru_code_life',
    city: 'Bangalore',
    state: 'Karnataka',
    niche: 'Tech & Gadgets',
    platform: 'YOUTUBE',
    followers: '420K',
    engagement: '4.9%',
    avgLikes: '18.2K',
    avgViews: '520K',
    rate: '₹40,000',
    genderSplit: '21% F / 79% M',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    verified: true,
    authenticReach: '95.3%',
    medianReelViews: '380.0K',
    commercialRate: '₹40,000 / Video',
    cpmInr: 230,
    credibilityScore: 96.8,
    contactEmail: 'tanmay@bengalurucode.dev',
    regionalHub: 'Bangalore & Hyderabad (75%)',
    bio: 'Software engineering interviews, desk setup aesthetics, and AI tools.',
  },
];

export const REGIONAL_RADAR_HUBS = [
  { city: 'Indore', state: 'Madhya Pradesh', creators: 4820, avgEr: '6.4%', growth: '+34%' },
  { city: 'Bhopal', state: 'Madhya Pradesh', creators: 2940, avgEr: '5.9%', growth: '+28%' },
  { city: 'Jaipur', state: 'Rajasthan', creators: 6150, avgEr: '5.7%', growth: '+42%' },
  { city: 'Surat', state: 'Gujarat', creators: 5430, avgEr: '6.8%', growth: '+38%' },
  { city: 'Lucknow', state: 'Uttar Pradesh', creators: 4210, avgEr: '5.5%', growth: '+25%' },
  { city: 'Ahmedabad', state: 'Gujarat', creators: 7300, avgEr: '5.2%', growth: '+31%' },
];

export const COMPARISON_DATA: ComparisonRow[] = [
  {
    capability: 'Pricing & Currency',
    legacyGlobal: '$299 – $899 / mo (Mandatory USD Credit Card)',
    legacyStatus: 'bad',
    creatorBase: '₹2,999 – ₹7,999 / mo (Razorpay, UPI, GST Invoicing)',
    creatorBaseStatus: 'good',
    description: 'No forex charges, no sudden card declines, and 100% compliant Indian tax invoices.',
  },
  {
    capability: 'Tier-2 & Tier-3 City Index',
    legacyGlobal: 'Strictly Mumbai & Delhi English profiles (< 8% India reach)',
    legacyStatus: 'bad',
    creatorBase: '50,000+ Regional Vernacular (Indore, Surat, Jaipur, Bhopal, Lucknow)',
    creatorBaseStatus: 'good',
    description: 'Find authentic local voices driving real sales in Bharat, not just metro aesthetic creators.',
  },
  {
    capability: 'Direct WhatsApp & Email',
    legacyGlobal: 'Gated behind credits or non-responsive agency broker desks',
    legacyStatus: 'bad',
    creatorBase: 'Instant direct contact & business emails unmasked',
    creatorBaseStatus: 'good',
    description: 'Cut out middlemen agencies that slap 40% markups on simple influencer deliverables.',
  },
  {
    capability: 'Deliverables Budget Recalculator',
    legacyGlobal: 'Static US/Europe dollar CPM benchmarks',
    legacyStatus: 'bad',
    creatorBase: 'Dynamic INR Rates for 1x Reel, 2x Stories & Payout Estimator',
    creatorBaseStatus: 'good',
    description: 'Modeled after real Indian media buy contracts to prevent budget overruns.',
  },
  {
    capability: 'Indian Bot & Comment Pod Sieve',
    legacyGlobal: 'Generic Western spam filters (fails against Indian engagement pods)',
    legacyStatus: 'bad',
    creatorBase: 'Regional Engagement Velocity & Comment Pod Sieve',
    creatorBaseStatus: 'good',
    description: 'Identifies bought follower spikes, WhatsApp pod rings, and non-Indian ghost followers.',
  },
  {
    capability: 'Deterministic CSV Export',
    legacyGlobal: 'Generic CSV that garbles Indian Rupee (₹) symbols in Excel',
    legacyStatus: 'neutral',
    creatorBase: 'RFC-4180 Compliant UTF-8 BOM CSV / Excel Ready',
    creatorBaseStatus: 'good',
    description: 'Client-ready campaign spreadsheets that open cleanly in Google Sheets and Microsoft Excel.',
  },
];

export const CLIENT_TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Cut our influencer discovery time from 3 days to 15 minutes. The Tier-2 city data for Indore, Bhopal, and Jaipur is unbeatable. We found micro-creators that delivered a 4.2x ROAS for our skincare launch.',
    author: 'Priya Sharma',
    role: 'Head of Growth',
    company: 'D2C Organics India',
    initials: 'PS',
    stars: 5,
  },
  {
    quote: "CreatorBase paid for itself on our first campaign. We identified that 38% of a creator's audience was botted before wiring ₹2.5 Lakhs. That single audit saved our client's budget and our agency reputation.",
    author: 'Karan Singhal',
    role: 'Managing Partner',
    company: 'Elevation Media',
    initials: 'KS',
    stars: 5,
    highlight: true,
  },
  {
    quote: 'Finally a platform priced in Indian Rupees that actually understands the Indian creator economy. The instant RFC-4180 CSV export with pre-calculated rates is pure magic for agency client decks.',
    author: 'Rohan Nair',
    role: 'Founder',
    company: 'Bharat Threads Apparel',
    initials: 'RN',
    stars: 5,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How does CreatorBase detect fake followers and engagement bots?',
    a: 'We cross-reference creator engagement velocity against typical Indian platform benchmarks. Our algorithms flag unnatural spike patterns, non-regional follower hubs, high follower-to-following spam ratios, and generic repetitive comment strings. You get an authentic reach score for every indexed creator before you spend a rupee.',
  },
  {
    q: 'Which Tier-2 and Tier-3 Indian cities do you cover?',
    a: 'Unlike global platforms that only index Mumbai, Delhi, and Bengaluru, CreatorBase covers high-growth regional creator ecosystems including Indore, Bhopal, Jaipur, Surat, Ahmedabad, Lucknow, Chandigarh, Pune, Kochi, and Guwahati.',
  },
  {
    q: 'Can I export influencer shortlists directly to Excel or CSV?',
    a: 'Yes, absolutely. With a single click, you can download a full RFC-4180 compliant CSV file formatted with UTF-8 BOM, ensuring that Indian Rupee (₹) symbols and special characters open flawlessly in Microsoft Excel, Google Sheets, or Apple Numbers.',
  },
  {
    q: 'How does the 7-day free trial work?',
    a: 'You get full access to our Tier 1 and Tier 2 creator database, search filters, audience demographics, and shortlist builder for 7 days. Zero credit card is required to sign up. If you love the platform, you can upgrade to Starter or Agency Pro at transparent Indian Rupee (₹) pricing.',
  },
  {
    q: 'Can multiple agency team members collaborate on the same account?',
    a: 'Yes! Our Agency Pro and Enterprise plans include team seats with role-based permissions, allowing your campaign strategists, media buyers, and brand managers to collaborate on shared shortlists with synced budget recalculations.',
  },
];

export const BRAND_LOGOS = [
  'Elevation Media',
  'Bharat D2C Labs',
  'Zomato Feeding India',
  'D2C Organics',
  'Urban Culture Media',
  'Minimalist Collabs',
];
