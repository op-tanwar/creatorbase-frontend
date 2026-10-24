import { HeroSection } from '@/components/home/HeroSection';
import { InteractiveMockTerminal } from '@/components/home/InteractiveMockTerminal';
import { SocialProofMarquee } from '@/components/home/SocialProofMarquee';
import { BentoFeatures } from '@/components/home/BentoFeatures';
import { LiveDemoWidget } from '@/components/home/LiveDemoWidget';
import { ComparisonTable } from '@/components/home/ComparisonTable';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQAccordion } from '@/components/home/FAQAccordion';
import { FinalCtaBanner } from '@/components/home/FinalCtaBanner';
import { FaqJsonLd } from '@/components/seo/JsonLd';

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden bg-[#08090B] text-zinc-100 min-h-screen">
      <FaqJsonLd />
      {/* Stripe Mesh & Radial Glow Engine */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_50%)]" />

      {/* Apify Dot Matrix / Grid Layer */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

      {/* Ambient Radial Color Accents */}
      <div className="pointer-events-none absolute top-[900px] -left-40 -z-10 h-[500px] w-[700px] rounded-full bg-emerald-950/20 blur-[140px]" />
      <div className="pointer-events-none absolute top-[1800px] -right-40 -z-10 h-[550px] w-[750px] rounded-full bg-indigo-950/20 blur-[150px]" />

      <HeroSection />
      <InteractiveMockTerminal />
      <SocialProofMarquee />
      <BentoFeatures />
      <LiveDemoWidget />
      <ComparisonTable />
      <TestimonialsSection />
      <FAQAccordion />
      <FinalCtaBanner />
    </div>
  );
}
