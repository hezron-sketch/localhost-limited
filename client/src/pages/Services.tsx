/**
 * Services Page — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * Sections:
 *   1. Hero — page header
 *   2. Brand Activation Services
 *   3. BTL & Experiential Services
 *   4. Field Marketing Services
 *   5. Printing & Branding Services
 *   6. Video Production Services
 *   7. Market Research & Consulting Services
 *   8. Our Strategy Section
 *   9. CTA
 */

import { Link } from "wouter";
import {
  Sparkles,
  Zap,
  MapPin,
  Palette,
  Film,
  ArrowRight,
  CheckCircle,
  BarChart2,
  Target,
  Users,
  TrendingUp,
  Check,
  Lightbulb,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ServiceCard from "@/components/ServiceCard";
import AnimatedSection from "@/components/AnimatedSection";
import Card3D from "@/components/Card3D";
import ScrollReveal, { ScrollRevealGroup } from "@/components/ScrollReveal";

const SERVICES_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/services-bg-8Q3voRTxHkWeXjcMVBCnue.webp";

const brandActivationServices = [
  {
    icon: Sparkles,
    title: "Promotional Events",
    description: "Immersive brand experiences that captivate audiences and create lasting connections. From product launches to brand activations.",
    benefits: [
      "Event strategy & planning",
      "Audience engagement activities",
      "Brand experience design",
      "On-site execution & management",
      "Post-event analytics",
    ],
  },
  {
    icon: Users,
    title: "Mass Awareness Campaigns",
    description: "Large-scale brand mobilization campaigns that expand market reach and increase visibility across key demographics.",
    benefits: [
      "Campaign conceptualization",
      "Multi-channel execution",
      "Audience sampling & engagement",
      "Brand message amplification",
      "Campaign performance tracking",
    ],
  },
  {
    icon: Target,
    title: "Brand Activation Strategy",
    description: "Strategic planning and execution of brand activation initiatives that drive consumer engagement and brand loyalty.",
    benefits: [
      "Market research & insights",
      "Activation strategy development",
      "Creative concept development",
      "Execution coordination",
      "ROI measurement",
    ],
  },
];

const btlServices = [
  {
    icon: Zap,
    title: "Retail Campaigns",
    description: "Strategic retail activations that drive product visibility, consumer engagement, and point-of-sale conversion.",
    benefits: [
      "Retail strategy development",
      "In-store promotions & displays",
      "Shelf management optimization",
      "Consumer sampling programs",
      "Sales performance tracking",
    ],
  },
  {
    icon: MapPin,
    title: "Route to Market",
    description: "Comprehensive field marketing solutions that connect products with consumers through strategic retail partnerships and distribution.",
    benefits: [
      "Distributor & retailer engagement",
      "Product placement optimization",
      "Field team coordination",
      "Market penetration strategies",
      "Distribution performance monitoring",
    ],
  },
  {
    icon: TrendingUp,
    title: "Consumer Promotion",
    description: "Targeted consumer promotion programs that drive trial, repeat purchase, and brand advocacy.",
    benefits: [
      "Promotion design & mechanics",
      "Consumer incentive programs",
      "Loyalty building initiatives",
      "Promotional campaign execution",
      "Consumer feedback collection",
    ],
  },
];

const fieldMarketingServices = [
  {
    icon: Users,
    title: "Field Team Execution",
    description: "Experienced field teams that execute promotions, activations, and campaigns with precision and market insight.",
    benefits: [
      "Trained field personnel",
      "On-ground execution",
      "Real-time performance monitoring",
      "Consumer interaction management",
      "Field reporting & analytics",
    ],
  },
  {
    icon: Target,
    title: "Road Shows & Activations",
    description: "Mobile brand experiences that bring your products and services directly to target consumers in key markets.",
    benefits: [
      "Route planning & logistics",
      "Activation setup & execution",
      "Consumer engagement activities",
      "Product demonstration",
      "Lead capture & follow-up",
    ],
  },
  {
    icon: BarChart2,
    title: "Performance Monitoring",
    description: "Real-time tracking and optimization of field marketing activities to ensure maximum impact and ROI.",
    benefits: [
      "Campaign performance tracking",
      "Consumer behavior analysis",
      "Market feedback collection",
      "Strategy optimization",
      "Detailed performance reporting",
    ],
  },
];

const printingBrandingServices = [
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Creative graphic design services that bring your brand vision to life across all marketing materials.",
    benefits: [
      "Brand identity design",
      "Marketing collateral design",
      "Digital & print assets",
      "Brand guideline development",
      "Design revisions & refinement",
    ],
  },
  {
    icon: Sparkles,
    title: "Printing Services",
    description: "High-quality printing solutions for billboards, banners, brochures, and promotional materials.",
    benefits: [
      "Billboard design & printing",
      "Promotional material printing",
      "Packaging design & printing",
      "Large format printing",
      "Quality assurance & delivery",
    ],
  },
  {
    icon: Users,
    title: "Photography Services",
    description: "Professional photography for product shots, events, and brand content that captures your story.",
    benefits: [
      "Product photography",
      "Event documentation",
      "Brand photography sessions",
      "Photo editing & retouching",
      "Digital asset delivery",
    ],
  },
];

const videoProductionServices = [
  {
    icon: Film,
    title: "Video Production",
    description: "Professional video production services from concept to final delivery for advertising and promotional content.",
    benefits: [
      "Concept development & scripting",
      "Professional filming",
      "Post-production editing",
      "Motion graphics & animation",
      "Multi-format delivery",
    ],
  },
  {
    icon: Sparkles,
    title: "Advertising Content",
    description: "Compelling advertising videos designed to capture attention and drive consumer action.",
    benefits: [
      "Ad concept development",
      "Storyboarding & scripting",
      "Professional production",
      "Color grading & effects",
      "Platform-optimized formats",
    ],
  },
  {
    icon: Target,
    title: "Scriptwriting",
    description: "Professional scriptwriting that crafts compelling narratives for your brand and campaigns.",
    benefits: [
      "Commercial script development",
      "Brand storytelling",
      "Dialogue & narration writing",
      "Script revisions & refinement",
      "Production-ready scripts",
    ],
  },
];

const marketResearchServices = [
  {
    icon: Lightbulb,
    title: "Market Research",
    description: "Deep market research and consumer insights that inform strategic decision-making and campaign development.",
    benefits: [
      "Consumer behavior analysis",
      "Market trend identification",
      "Competitor activity tracking",
      "Pricing & positioning analysis",
      "Research reports & insights",
    ],
  },
  {
    icon: BarChart2,
    title: "Retail Insights",
    description: "On-the-ground retail intelligence that helps optimize product placement, pricing, and promotional strategies.",
    benefits: [
      "Retail environment analysis",
      "Shelf space optimization",
      "Competitor benchmarking",
      "Consumer purchase behavior",
      "Actionable recommendations",
    ],
  },
  {
    icon: Target,
    title: "Strategic Consulting",
    description: "Expert consulting services that help brands develop winning marketing and go-to-market strategies.",
    benefits: [
      "Strategy development",
      "Market entry planning",
      "Campaign strategy consulting",
      "Performance optimization",
      "Executive presentations",
    ],
  },
];

const strategySteps = [
  {
    step: "01",
    icon: Target,
    title: "Market Insight",
    desc: "We conduct deep market research to understand consumer behavior, retail trends, and competitive activity.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "Strategic Planning",
    desc: "We develop targeted marketing and activation strategies aligned with your business goals.",
  },
  {
    step: "03",
    icon: Users,
    title: "Field Execution",
    desc: "Our experienced teams execute campaigns with precision, delivering results on the ground.",
  },
  {
    step: "04",
    icon: BarChart2,
    title: "Performance Monitoring",
    desc: "We track campaign performance and market feedback to optimize strategies and drive measurable results.",
  },
];

const serviceBenefits = [
  "Award-winning creative and execution expertise",
  "Experienced field teams across East Africa",
  "Data-driven strategy and optimization",
  "Comprehensive service offerings under one roof",
  "Transparent reporting and measurable ROI",
  "Dedicated account management",
];

export default function Services() {
  return (
    <PageLayout
      title="Services"
      description="Explore Localhost Limited's comprehensive marketing services: Brand Activation, BTL, Field Marketing, Printing & Branding, and Video Production."
    >
      {/* ─── Hero ─── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        aria-label="Services page hero"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: `url(${SERVICES_BG})` }}
          role="img"
          aria-label="Abstract digital circuit board background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/70 via-[#0D1B2A]/85 to-[#0D1B2A]" />
        <div className="container mx-auto relative z-10">
          <AnimatedSection>
            <p className="section-label mb-3">What We Offer</p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 max-w-3xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Services Built for{" "}
              <span className="gradient-text">Brand Impact</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              From brand activation and BTL marketing to field execution and creative production — our integrated services deliver measurable results across all channels.
            </p>
          </AnimatedSection>

          {/* Quick Nav */}
          <AnimatedSection delay={150} className="mt-8">
            <div className="flex flex-wrap gap-3">
              <a
                href="#activation"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-sm font-medium hover:bg-[#22C55E]/15 transition-all duration-200"
                aria-label="Jump to Brand Activation"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Brand Activation
              </a>
              <a
                href="#btl"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-sm font-medium hover:bg-[#22C55E]/15 transition-all duration-200"
                aria-label="Jump to BTL & Experiential"
              >
                <Zap className="w-4 h-4" aria-hidden="true" />
                BTL & Experiential
              </a>
              <a
                href="#field"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-sm font-medium hover:bg-[#22C55E]/15 transition-all duration-200"
                aria-label="Jump to Field Marketing"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Field Marketing
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Brand Activation Services ─── */}
      <section className="py-20 md:py-28" id="activation" aria-labelledby="activation-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Core Service</p>
              <h2
                id="activation-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Brand Activation
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mx-auto">
                Immersive brand experiences that captivate audiences and create lasting connections with your target market.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brandActivationServices.map((service, i) => (
              <div key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── BTL & Experiential Services ─── */}
      <section className="py-20 md:py-28 bg-[#060E1A]" id="btl" aria-labelledby="btl-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Core Service</p>
              <h2
                id="btl-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                BTL & Experiential Marketing
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mx-auto">
                Below-the-line marketing that drives consumer engagement, retail activation, and conversion at point of sale.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {btlServices.map((service, i) => (
              <div key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── Field Marketing Services ─── */}
      <section className="py-20 md:py-28" id="field" aria-labelledby="field-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Core Service</p>
              <h2
                id="field-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Field Marketing & Execution
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mx-auto">
                Experienced field teams executing promotions, activations, and campaigns with precision and market insight.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fieldMarketingServices.map((service, i) => (
              <div key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── Printing & Branding Services ─── */}
      <section className="py-20 md:py-28 bg-[#060E1A]" aria-labelledby="printing-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Creative Services</p>
              <h2
                id="printing-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Printing & Branding
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mx-auto">
                Professional design, printing, and photography services that bring your brand vision to life.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {printingBrandingServices.map((service, i) => (
              <div key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── Video Production Services ─── */}
      <section className="py-20 md:py-28" aria-labelledby="video-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Creative Services</p>
              <h2
                id="video-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Video Production
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mx-auto">
                Professional video production from concept to delivery for advertising and promotional content.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoProductionServices.map((service, i) => (
              <div key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── Market Research & Consulting Services ─── */}
      <section className="py-20 md:py-28" aria-labelledby="research-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Strategic Services</p>
              <h2
                id="research-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Market Research & Consulting
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mx-auto">
                Deep market insights and strategic consulting that inform winning campaigns and business decisions.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketResearchServices.map((service, i) => (
              <div key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── Our Strategy ─── */}
      <section className="py-20 md:py-28 bg-[#060E1A]" aria-labelledby="strategy-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">How We Work</p>
              <h2
                id="strategy-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Our Strategy & Process
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mx-auto">
                A proven approach that combines market insights, strategic planning, expert execution, and continuous optimization.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strategySteps.map((item, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#22C55E]/30 transition-all duration-300"
              >
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16a34a] flex items-center justify-center font-extrabold text-[#0D1B2A] text-lg">
                  {item.step}
                </div>
                <div className="pt-6">
                  <item.icon className="w-8 h-8 text-[#22C55E] mb-3" aria-hidden="true" />
                  <h3 className="text-lg font-extrabold text-white mb-2">{item.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-20 md:py-28" aria-labelledby="benefits-heading">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection>
              <p className="section-label mb-3">Why Localhost Limited</p>
              <h2
                id="benefits-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Comprehensive Solutions, Proven Results
              </h2>
              <p className="text-white/55 leading-relaxed mb-8">
                We bring together all the services you need under one roof — from strategic planning to creative execution to field implementation. This integrated approach ensures consistency, efficiency, and measurable results.
              </p>
              <Link href="/contact">
                <span className="btn-green inline-flex items-center gap-2 px-6 py-3">
                  Get Started
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            </AnimatedSection>

            <ScrollRevealGroup staggerDelay={0.1} className="space-y-4">
              {serviceBenefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-white/70">{benefit}</p>
                </div>
              ))}
            </ScrollRevealGroup>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#22C55E]/20 via-[#22C55E]/10 to-transparent border-t border-b border-[#22C55E]/20" aria-labelledby="cta-heading">
        <div className="container mx-auto">
          <AnimatedSection className="text-center">
            <h2
              id="cta-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Ready to Transform Your Brand?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how our integrated marketing services can drive growth and deliver measurable results for your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <span className="btn-green inline-flex items-center gap-2 px-7 py-3">
                  Start a Conversation
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
              <Link href="/about">
                <span className="btn-outline-green inline-flex items-center gap-2 px-7 py-3">
                  Learn More About Us
                </span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
