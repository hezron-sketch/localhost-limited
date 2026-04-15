/**
 * Services Page — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * Services organized into three main categories:
 *   1. Marketing Services (Brand Activation, BTL, Field Marketing, Printing & Branding, Video Production, Market Research)
 *   2. HR Sourcing Services
 *   3. Organizational Services (Partnerships, Events)
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
  Briefcase,
  Handshake,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ServiceCard from "@/components/ServiceCard";
import AnimatedSection from "@/components/AnimatedSection";
import Card3D from "@/components/Card3D";
import ScrollReveal, { ScrollRevealGroup } from "@/components/ScrollReveal";

const SERVICES_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/services-bg-8Q3voRTxHkWeXjcMVBCnue.webp";

// ═══════════════════════════════════════════════════════════════════════════════
// MARKETING SERVICES
// ═══════════════════════════════════════════════════════════════════════════════

const marketingServices = [
  {
    icon: Sparkles,
    title: "Brand Activation",
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
    icon: Zap,
    title: "BTL & Experiential Marketing",
    description: "Below-the-line campaigns that drive direct consumer engagement and build meaningful brand interactions.",
    benefits: [
      "Experiential event design",
      "Consumer engagement activities",
      "Brand promotion execution",
      "Corporate events management",
      "Sampling & demonstration campaigns",
    ],
  },
  {
    icon: MapPin,
    title: "Field Marketing & Route to Market",
    description: "Strategic field execution that brings your brand directly to consumers through retail campaigns and road shows.",
    benefits: [
      "Route-to-market strategy",
      "Retail activation campaigns",
      "Road shows & mobile tours",
      "Field team management",
      "Territory coverage optimization",
    ],
  },
  {
    icon: Palette,
    title: "Printing & Branding",
    description: "Complete branding solutions including graphic design, photography, printing, and billboard advertising.",
    benefits: [
      "Graphic design & creative",
      "Professional photography",
      "Print production & management",
      "Billboard & outdoor advertising",
      "Brand collateral design",
    ],
  },
  {
    icon: Film,
    title: "Video Production",
    description: "Professional video content creation for advertising, product promotion, and brand storytelling.",
    benefits: [
      "Script writing & conceptualization",
      "Professional filming & production",
      "Video editing & post-production",
      "Advertising content creation",
      "Social media video optimization",
    ],
  },
  {
    icon: BarChart2,
    title: "Market Research & Consulting",
    description: "Data-driven insights and strategic consulting to inform your marketing decisions and business growth.",
    benefits: [
      "Market data collection",
      "Consumer behavior analysis",
      "Competitor analysis",
      "Market trend identification",
      "Strategic recommendations",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HR SOURCING SERVICES
// ═══════════════════════════════════════════════════════════════════════════════

const hrServices = [
  {
    icon: Users,
    title: "Talent Acquisition",
    description: "End-to-end recruitment solutions to find and hire the right talent for your organization.",
    benefits: [
      "Job posting & advertising",
      "Candidate screening & shortlisting",
      "Interview coordination",
      "Background verification",
      "Onboarding support",
    ],
  },
  {
    icon: Briefcase,
    title: "Recruitment Outsourcing",
    description: "Full recruitment management services to handle your hiring needs efficiently and cost-effectively.",
    benefits: [
      "Complete recruitment management",
      "Dedicated recruitment team",
      "Candidate database access",
      "Recruitment analytics",
      "Time-to-hire optimization",
    ],
  },
  {
    icon: TrendingUp,
    title: "Workforce Solutions",
    description: "Strategic workforce planning and staffing solutions to scale your business effectively.",
    benefits: [
      "Workforce planning",
      "Temporary staffing",
      "Contract staffing",
      "Skills assessment",
      "Employee retention strategies",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ORGANIZATIONAL SERVICES
// ═══════════════════════════════════════════════════════════════════════════════

const organizationalServices = [
  {
    icon: Handshake,
    title: "Strategic Partnerships",
    description: "Facilitate meaningful partnerships between corporates, startups, and agencies to drive mutual growth.",
    benefits: [
      "Partnership identification",
      "Relationship facilitation",
      "Deal structuring",
      "Collaboration management",
      "Partnership optimization",
    ],
  },
  {
    icon: Target,
    title: "Event Organization",
    description: "End-to-end event management for conferences, seminars, workshops, and corporate gatherings.",
    benefits: [
      "Event planning & coordination",
      "Venue management",
      "Vendor coordination",
      "Attendee management",
      "Post-event reporting",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STRATEGY STEPS
// ═══════════════════════════════════════════════════════════════════════════════

const strategySteps = [
  {
    number: "01",
    title: "Market Insight",
    description: "We begin by understanding your market, competitors, and target audience through comprehensive research and analysis.",
  },
  {
    number: "02",
    title: "Strategic Planning",
    description: "We develop a tailored strategy that aligns with your business goals and market opportunities.",
  },
  {
    number: "03",
    title: "Field Execution",
    description: "Our experienced teams execute campaigns with precision and excellence across all touchpoints.",
  },
  {
    number: "04",
    title: "Performance Monitoring",
    description: "We continuously track results and optimize campaigns to ensure maximum ROI and impact.",
  },
];

export default function Services() {
  return (
    <PageLayout
      title="Services"
      description="Comprehensive marketing, HR sourcing, and organizational services designed to drive growth and excellence."
    >
      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden" aria-label="Services page hero">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: `url(${SERVICES_BG})` }}
          role="img"
          aria-label="Abstract background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/70 via-[#0D1B2A]/85 to-[#0D1B2A]" />
        <div className="container mx-auto relative z-10">
          <AnimatedSection>
            <p className="section-label mb-3">What We Offer</p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 max-w-3xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Comprehensive Solutions for <span className="gradient-text">Business Growth</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              From brand activation to talent acquisition, we provide end-to-end solutions across marketing, HR, and organizational services.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* MARKETING SERVICES */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="marketing-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="mb-16">
              <p className="section-label mb-3">Marketing Excellence</p>
              <h2
                id="marketing-heading"
                className="text-4xl md:text-5xl font-extrabold text-white mb-5 max-w-3xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Marketing Services
              </h2>
              <p className="text-white/60 text-lg max-w-2xl">
                Drive brand awareness, engagement, and growth through our comprehensive marketing solutions.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketingServices.map((service, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <ServiceCard {...service} />
                </ScrollReveal>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* HR SOURCING SERVICES */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#0D1B2A]" aria-labelledby="hr-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="mb-16">
              <p className="section-label mb-3">Talent Solutions</p>
              <h2
                id="hr-heading"
                className="text-4xl md:text-5xl font-extrabold text-white mb-5 max-w-3xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                HR Sourcing Services
              </h2>
              <p className="text-white/60 text-lg max-w-2xl">
                Find and develop the right talent to build a strong, capable team.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hrServices.map((service, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <ServiceCard {...service} />
                </ScrollReveal>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* ORGANIZATIONAL SERVICES */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="org-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="mb-16">
              <p className="section-label mb-3">Strategic Initiatives</p>
              <h2
                id="org-heading"
                className="text-4xl md:text-5xl font-extrabold text-white mb-5 max-w-3xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Organizational Services
              </h2>
              <p className="text-white/60 text-lg max-w-2xl">
                Build strategic partnerships and organize impactful events that drive business success.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {organizationalServices.map((service, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <ServiceCard {...service} />
                </ScrollReveal>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── Our Strategy ─── */}
      <section className="py-20 bg-[#0D1B2A]" aria-labelledby="strategy-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="section-label mb-3">Our Approach</p>
              <h2
                id="strategy-heading"
                className="text-4xl md:text-5xl font-extrabold text-white mb-5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Our Proven Strategy
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                A systematic approach to deliver results at every stage of your project.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strategySteps.map((step, index) => (
              <ScrollReveal key={index} delay={index * 0.15}>
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#22C55E]/50 transition-all duration-300">
                  <div className="text-4xl font-extrabold text-[#22C55E] mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="cta-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center">
              <h2
                id="cta-heading"
                className="text-4xl md:text-5xl font-extrabold text-white mb-6"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Ready to Work With Us?
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
                Let's discuss how our services can help drive your business growth and success.
              </p>
              <Link href="/contact">
                <span className="btn-green inline-flex items-center gap-2">
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
