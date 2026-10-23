export type Platform = 'INSTAGRAM' | 'YOUTUBE';
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED';
export type Role = 'SUPER_ADMIN' | 'BRAND_ADMIN' | 'AGENCY_MEMBER';
export type PlanType = 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'INACTIVE' | 'ACTIVE' | 'EXPIRED';

export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: Role;
  planType: PlanType;
  subscriptionStatus?: SubscriptionStatus;
  planExpiresAt?: string | null;
  isSuspended?: boolean;
  suspensionReason?: string | null;
  createdAt: string;
  _count?: {
    shortlists: number;
    campaigns: number;
  };
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  plan: string;
  keyId: string;
  user: {
    name: string;
    email: string;
    companyName: string;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface Creator {
  id: string;
  handle: string;
  platform: Platform;
  fullName: string;
  avatarUrl: string;
  city: string;
  state: string;
  niche: string;
  followerCount: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  avgReelViews: number;
  businessEmail: string | null;
  isVerified: boolean;
  authenticityScore?: number;
  bio?: string | null;
  postsCount?: number | null;
  followingCount?: number | null;
  lastScrapedAt?: string | null;
  audienceTopCity: string;
  audienceFemalePercentage: number;
  audienceMalePercentage: number;
  createdAt: string;
  updatedAt: string;
  analytics?: {
    estimatedCostPerReelINR: number;
    estimatedCostPerStoryINR: number;
    tier: string;
    engagementHealthScore: string;
    authenticityScore?: number;
  };
}

export type DeliverableStage =
  | 'SHORTLISTED'
  | 'EMAIL_SENT'
  | 'COMMERCIALS_AGREED'
  | 'DRAFT_UNDER_REVIEW'
  | 'LIVE_AND_PAID';

export interface ShortlistItem {
  id: string;
  shortlistId: string;
  creatorId: string;
  notes: string | null;
  assignedFeeINR: number | null;
  agreedFeeINR?: number | null;
  stage?: DeliverableStage;
  liveUrl?: string | null;
  draftUrl?: string | null;
  deliverableNotes?: string | null;
  clientApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  clientNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
  creator: Creator;
}

export interface KanbanBoardData {
  shortlist: {
    id: string;
    name: string;
    shareToken?: string | null;
    campaign?: any;
    creatorCount: number;
  };
  telemetry: {
    totalAllocatedBudgetINR: number;
    livePostsCount: number;
    totalCreatorsCount: number;
  };
  stages: Record<DeliverableStage, ShortlistItem[]>;
}

export interface Shortlist {
  id: string;
  userId: string;
  campaignId: string | null;
  name: string;
  shareToken?: string | null;
  isPubliclyShared?: boolean;
  createdAt: string;
  updatedAt: string;
  creatorCount?: number;
  totalEstimatedCostINR?: number;
  totalFollowers?: number;
  avgEngagement?: number;
  campaign?: {
    id: string;
    title: string;
    budgetINR: number;
    status: CampaignStatus;
  } | null;
  items: ShortlistItem[];
}

export interface PitchCreator {
  shortlistItemId: string;
  creatorId: string;
  handle: string;
  fullName: string;
  avatarUrl: string;
  bio?: string | null;
  city: string;
  state: string;
  niche: string;
  platform: Platform;
  followerCount: number;
  engagementRate: number;
  avgReelViews: number;
  isVerified: boolean;
  commercialRateINR: number;
  assignedFeeINR: number;
  clientApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  clientNotes: string;
  agencyNotes: string;
  authenticityScore: number;
}

export interface PitchData {
  shareToken: string;
  shortlistName: string;
  agencyName: string;
  campaignTitle?: string | null;
  campaignTargetCity?: string | null;
  creatorCount: number;
  totalEstimatedCostINR: number;
  totalFollowers: number;
  approvedCount: number;
  approvedBudgetINR: number;
  creators: PitchCreator[];
}

export interface Campaign {
  id: string;
  userId: string;
  title: string;
  description: string;
  budgetINR: number;
  targetCity: string | null;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  shortlists: Shortlist[];
  analytics?: {
    allocatedBudgetINR: number;
    remainingBudgetINR: number;
    budgetUtilizationPercent: number;
    totalCreatorsCount: number;
    totalEstimatedReach: number;
    totalEstimatedReelViews?: number;
  };
}

export interface AdminMetrics {
  totalAgencies: number;
  activeSubscriptions: number;
  totalRevenueINR: number;
  totalTransactionsCount: number;
  totalCreators: number;
  totalShortlists: number;
  totalCampaigns: number;
}

export interface AdminActivity {
  id: string;
  type: 'SIGNUP' | 'PAYMENT' | 'CAMPAIGN';
  title: string;
  description: string;
  timestamp: string;
  meta?: any;
}

export interface AdminAgency {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: Role;
  planType: PlanType;
  subscriptionStatus: SubscriptionStatus;
  planExpiresAt: string | null;
  isSuspended: boolean;
  suspensionReason: string | null;
  createdAt: string;
  updatedAt: string;
  totalSpentINR: number;
  shortlistsCount: number;
  campaignsCount: number;
}

export interface AdminTransaction {
  id: string;
  orderId: string;
  paymentId: string | null;
  amountINR: number;
  amountPaise: number;
  currency: string;
  plan: string;
  status: 'CREATED' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    companyName: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  errors?: any;
}
