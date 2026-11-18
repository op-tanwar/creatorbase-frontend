import { HeroSection } from '@/components/home/HeroSection';
import { SocialProofMarquee } from '@/components/home/SocialProofMarquee';
import { BentoFeatures } from '@/components/home/BentoFeatures';
import { WorkflowStepper } from '@/components/home/WorkflowStepper';
import { ComparisonTable } from '@/components/home/ComparisonTable';
import { PricingSection } from '@/components/home/PricingSection';
import { FinalCtaBanner } from '@/components/home/FinalCtaBanner';
import { FaqJsonLd } from '@/components/seo/JsonLd';

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden bg-[#060709] text-zinc-100 min-h-screen">
      <FaqJsonLd />

      {/* Bliex-Grade Canvas Spotlight Architecture */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.14),transparent)]" />

      {/* Hairline Structural Dot Grid */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      {/* Ambient Radial Color Accents */}
      <div className="pointer-events-none absolute top-[800px] -left-48 -z-10 h-[500px] w-[700px] rounded-full bg-emerald-950/15 blur-[160px]" />
      <div className="pointer-events-none absolute top-[2000px] -right-48 -z-10 h-[600px] w-[800px] rounded-full bg-teal-950/15 blur-[160px]" />

      {/* 1. Hero Section + Interactive Stage */}
      <HeroSection />

      {/* 2. Infinite Dual-Direction Marquee Strip */}
      <SocialProofMarquee />

      {/* 3. Asymmetric Bento Grid */}
      <BentoFeatures />

      {/* 4. 3-Step Interactive Workflow Stepper */}
      <WorkflowStepper />

      {/* 5. Architectural Comparison Matrix */}
      <ComparisonTable />

      {/* 6. Transparent 3-Tier INR Pricing */}
      <PricingSection />

      {/* 7. Bottom Spotlight Final CTA */}
      <FinalCtaBanner />
    </div>
  );
}
