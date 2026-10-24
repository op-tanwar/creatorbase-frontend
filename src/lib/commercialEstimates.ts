/**
 * Smart Commercial Estimate & Rate-Card Intelligence Engine for Indian Influencers
 *
 * Implements a dynamic tier, niche, and engagement multiplier model tailored to Indian agency buying benchmarks.
 *
 * Multipliers:
 * - Finance / Tech / FinTech / Business: 2.0x - 2.5x multiplier (high consumer LTV & sponsor willingness-to-pay)
 * - Beauty / Skincare / Fashion: 1.45x - 1.6x multiplier (high reel creative production demand & sponsor volume)
 * - Food / Travel / Fitness: 1.2x - 1.3x multiplier
 * - Comedy / Entertainment / Gaming / Lifestyle: 1.0x baseline
 */

export interface CommercialEstimate {
  tier: string;
  tierBadge: string;
  nicheMultiplier: number;
  nicheLabel: string;
  engagementMultiplier: number;
  reelMinINR: number;
  reelMaxINR: number;
  reelMedianINR: number;
  storyMinINR: number;
  storyMaxINR: number;
  storyMedianINR: number;
  disclaimer: string;
}

export function calculateCommercialEstimate(creator: {
  followerCount: number;
  avgReelViews?: number | null;
  engagementRate?: number | null;
  niche?: string | null;
}): CommercialEstimate {
  const followers = Math.max(5000, Number(creator.followerCount) || 5000);
  const views = creator.avgReelViews && creator.avgReelViews > 0
    ? Number(creator.avgReelViews)
    : Math.round(followers * 0.28);
  const er = creator.engagementRate && creator.engagementRate > 0
    ? Number(creator.engagementRate)
    : 2.8;
  const niche = (creator.niche || '').toLowerCase();

  // 1. Tier Identification & Base Cost per 1,000 Followers & Views
  let tier = 'Micro-Influencer';
  let tierBadge = '20k - 100k Followers';
  let baseReelCostPer1kFollowers = 180;
  let baseReelCostPer1kViews = 120;

  if (followers < 20000) {
    tier = 'Nano-Influencer';
    tierBadge = '5k - 20k Followers';
    baseReelCostPer1kFollowers = 210;
    baseReelCostPer1kViews = 140;
  } else if (followers < 100000) {
    tier = 'Micro-Influencer';
    tierBadge = '20k - 100k Followers';
    baseReelCostPer1kFollowers = 180;
    baseReelCostPer1kViews = 125;
  } else if (followers < 500000) {
    tier = 'Mid-Tier Creator';
    tierBadge = '100k - 500k Followers';
    baseReelCostPer1kFollowers = 155;
    baseReelCostPer1kViews = 115;
  } else if (followers < 1000000) {
    tier = 'Macro Creator';
    tierBadge = '500k - 1M Followers';
    baseReelCostPer1kFollowers = 135;
    baseReelCostPer1kViews = 105;
  } else {
    tier = 'Mega / Celebrity Creator';
    tierBadge = '1M+ Followers';
    baseReelCostPer1kFollowers = 115;
    baseReelCostPer1kViews = 95;
  }

  // 2. Smart Niche Multipliers
  let nicheMultiplier = 1.0;
  let nicheLabel = 'Standard Baseline (1.0x)';

  if (/finance|fintech|crypto|business|invest|stock|tax/i.test(niche)) {
    nicheMultiplier = 2.4;
    nicheLabel = 'Finance & Business (2.4x Multiplier)';
  } else if (/tech|gadget|ai|coding|software|hardware|developer/i.test(niche)) {
    nicheMultiplier = 2.1;
    nicheLabel = 'Tech & Gadgets (2.1x Multiplier)';
  } else if (/beauty|skincare|cosmetics|makeup|derma/i.test(niche)) {
    nicheMultiplier = 1.55;
    nicheLabel = 'Beauty & Skincare (1.55x High Reel Demand)';
  } else if (/fashion|streetwear|styling|luxury|apparel/i.test(niche)) {
    nicheMultiplier = 1.45;
    nicheLabel = 'Fashion & Streetwear (1.45x Multiplier)';
  } else if (/fitness|health|wellness|gym|nutrition/i.test(niche)) {
    nicheMultiplier = 1.25;
    nicheLabel = 'Fitness & Health (1.25x Multiplier)';
  } else if (/food|cafe|cooking|recipe|culinary/i.test(niche)) {
    nicheMultiplier = 1.2;
    nicheLabel = 'Food & Dining (1.2x Multiplier)';
  } else if (/travel|vlog|tourism|hotel/i.test(niche)) {
    nicheMultiplier = 1.2;
    nicheLabel = 'Travel & Stays (1.2x Multiplier)';
  } else {
    nicheMultiplier = 1.0;
    nicheLabel = 'Entertainment / Comedy (Standard Baseline)';
  }

  // 3. Engagement Rate Modifier
  let engagementMultiplier = 1.0;
  if (er >= 6.5) {
    engagementMultiplier = 1.35;
  } else if (er >= 4.0) {
    engagementMultiplier = 1.2;
  } else if (er < 1.8) {
    engagementMultiplier = 0.85;
  }

  // 4. Compute Median Estimated Rates
  const rawReelBase =
    (followers / 1000) * baseReelCostPer1kFollowers * 0.55 +
    (views / 1000) * baseReelCostPer1kViews * 0.45;

  const adjustedMedianReel = Math.max(
    3000,
    Math.round((rawReelBase * nicheMultiplier * engagementMultiplier) / 500) * 500
  );

  // Range calculation (±15% to ±20%)
  const reelMinINR = Math.max(2500, Math.round((adjustedMedianReel * 0.85) / 500) * 500);
  const reelMaxINR = Math.round((adjustedMedianReel * 1.20) / 500) * 500;

  // 1x Story + Link (30% to 40% of Reel rate)
  const adjustedMedianStory = Math.max(
    1000,
    Math.round((adjustedMedianReel * 0.35) / 100) * 100
  );
  const storyMinINR = Math.max(800, Math.round((adjustedMedianStory * 0.85) / 100) * 100);
  const storyMaxINR = Math.round((adjustedMedianStory * 1.20) / 100) * 100;

  return {
    tier,
    tierBadge,
    nicheMultiplier,
    nicheLabel,
    engagementMultiplier,
    reelMinINR,
    reelMaxINR,
    reelMedianINR: adjustedMedianReel,
    storyMinINR,
    storyMaxINR,
    storyMedianINR: adjustedMedianStory,
    disclaimer: 'Estimated industry benchmark based on tier & engagement.',
  };
}
