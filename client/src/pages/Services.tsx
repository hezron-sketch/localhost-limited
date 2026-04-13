/**
 * Services Page — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * Sections:
 *   1. Hero — page header
 *   2. Marketing Services — 3 service cards with details
 *   3. HR Sourcing Services — 3 service cards with details
 *   4. Process Section — how we work
 *   5. CTA
 */

import { Link } from "wouter";
import {
  Share2,
  Search,
  FileText,
  UserCheck,
  Building2,
  Briefcase,
  ArrowRight,
  CheckCircle,
  BarChart2,
  Megaphone,
  PenTool,
  Users,
  Network,
  ClipboardList,
  Check,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ServiceCard from "@/components/ServiceCard";
import AnimatedSection from "@/components/AnimatedSection";
import Card3D from "@/components/Card3D";
import ScrollReveal, { ScrollRevealGroup } from "@/components/ScrollReveal";

const SERVICES_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/services-bg-8Q3voRTxHkWeXjcMVBCnue.webp";

const marketingServices = [
  {
    icon: Share2,
    title: "Social Media Management",
    description: "Comprehensive social media strategy and management across all major platforms. We create, schedule, and optimize content that builds community and drives engagement.",
    benefits: [
      "Platform-specific content strategies",
      "Community management & engagement",
      "Paid social advertising campaigns",
      "Monthly performance analytics",
      "Competitor benchmarking",
    ],
  },
  {
    icon: Search,
    title: "SEO & Digital Campaigns",
    description: "Data-driven SEO and digital advertising campaigns that increase your visibility, drive qualified traffic, and convert visitors into customers.",
    benefits: [
      "Technical SEO audits & optimization",
      "Google & Meta Ads management",
      "Keyword research & content strategy",
      "Conversion rate optimization",
      "Monthly ranking & traffic reports",
    ],
  },
  {
    icon: FileText,
    title: "Content Marketing",
    description: "Strategic content creation that positions your brand as an industry authority, nurtures leads, and supports every stage of the customer journey.",
    benefits: [
      "Blog articles & thought leadership",
      "Video scripts & production briefs",
      "Email marketing campaigns",
      "Infographics & visual content",
      "Content calendar management",
    ],
  },
];

const hrServices = [
  {
    icon: UserCheck,
    title: "Talent Acquisition",
    description: "End-to-end recruitment services that identify, attract, and secure top-tier candidates who align with your company culture and technical requirements.",
    benefits: [
      "Executive & senior-level search",
      "Technical talent sourcing",
      "Candidate screening & assessment",
      "Interview coordination & support",
      "Offer negotiation assistance",
    ],
  },
  {
    icon: Building2,
    title: "Recruitment Outsourcing",
    description: "Full-scale recruitment process outsourcing (RPO) that embeds our team within your organization to manage all hiring activities at scale.",
    benefits: [
      "Dedicated recruitment team",
      "ATS setup & management",
      "Employer branding support",
      "Bulk hiring campaigns",
      "SLA-driven delivery model",
    ],
  },
  {
    icon: Briefcase,
    title: "Workforce Solutions",
    description: "Flexible workforce management solutions including contract staffing, temporary placements, and workforce planning to meet your evolving business needs.",
    benefits: [
      "Contract & temporary staffing",
      "Workforce planning & forecasting",
      "Payroll & compliance management",
      "Staff augmentation services",
      "Onboarding & integration support",
    ],
  },
];

const processSteps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Discovery & Strategy",
    desc: "We start by deeply understanding your business goals, target audience, and competitive landscape to craft a tailored strategy.",
  },
  {
    step: "02",
    icon: PenTool,
    title: "Planning & Design",
    desc: "Our team develops a detailed execution plan with clear milestones, KPIs, and resource allocation.",
  },
  {
    step: "03",
    icon: Megaphone,
    title: "Execution & Launch",
    desc: "We implement the strategy with precision, ensuring every element is optimized for maximum impact.",
  },
  {
    step: "04",
    icon: BarChart2,
    title: "Measure & Optimize",
    desc: "Continuous monitoring, reporting, and optimization ensure we consistently improve results over time.",
  },
];

const marketingBenefits = [
  "Average 3x increase in organic traffic within 6 months",
  "Dedicated account manager and creative team",
  "Weekly check-ins and monthly strategy reviews",
  "Access to premium tools and analytics platforms",
];

const hrBenefits = [
  "Average time-to-hire reduced by 40%",
  "Access to a pre-vetted talent database of 10,000+ candidates",
  "90-day placement guarantee on all hires",
  "Compliance with local labor laws and regulations",
];

export default function Services() {
  return (
    <PageLayout
      title="Services"
      description="Explore Localhost Limited's full range of services: social media management, SEO, content marketing, talent acquisition, recruitment outsourcing, and workforce solutions."
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
              <span className="gradient-text">Measurable Growth</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              From digital marketing that amplifies your brand to talent solutions that build your team — our integrated services cover every dimension of business growth.
            </p>
          </AnimatedSection>

          {/* Quick Nav */}
          <AnimatedSection delay={150} className="mt-8">
            <div className="flex flex-wrap gap-3">
              <a
                href="#marketing"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-sm font-medium hover:bg-[#22C55E]/15 transition-all duration-200"
                aria-label="Jump to Marketing Services"
              >
                <Megaphone className="w-4 h-4" aria-hidden="true" />
                Marketing Services
              </a>
              <a
                href="#hr"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white/70 text-sm font-medium hover:bg-white/8 hover:text-white transition-all duration-200"
                aria-label="Jump to HR Sourcing"
              >
                <Users className="w-4 h-4" aria-hidden="true" />
                HR Sourcing
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Marketing Services ─── */}
      <section id="marketing" className="py-20 bg-[#060E1A]" aria-labelledby="marketing-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/25 flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-[#22C55E]" aria-hidden="true" />
                  </div>
                  <p className="section-label">Marketing Services</p>
                </div>
                <h2
                  id="marketing-heading"
                  className="text-3xl md:text-4xl font-extrabold text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Amplify Your Brand &amp; Drive Revenue
                </h2>
              </div>
              <p className="text-white/55 text-sm max-w-sm leading-relaxed">
                Data-driven strategies that turn your digital presence into a growth engine.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {marketingServices.map((service, i) => {
              const Icon = service.icon;
              return (
                <AnimatedSection key={service.title} delay={i * 100}>
                  <Card3D
                    title={service.title}
                    description={service.description}
                    icon={<Icon className="w-8 h-8" />}
                    gradient="from-purple-500/20 to-purple-500/5"
                  >
                    <ul className="space-y-2 mt-4">
                      {service.benefits.slice(0, 2).map((benefit: string) => (
                        <li key={benefit} className="flex items-start gap-2 text-xs text-white/60">
                          <CheckCircle className="w-3 h-3 text-[#22C55E] mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </Card3D>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Marketing Benefits */}
          <ScrollReveal>
            <div className="p-6 rounded-xl bg-[#0F2035] border border-[#22C55E]/20 flex flex-col md:flex-row md:items-center gap-6">
              <div className="shrink-0">
                <p className="text-[#22C55E] text-sm font-semibold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Marketing Package Includes
                </p>
                <p className="text-white/45 text-xs">All plans come with these guarantees</p>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {marketingBenefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-white/65">
                    <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" aria-hidden="true" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── HR Sourcing ─── */}
      <section id="hr" className="py-20" aria-labelledby="hr-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/25 flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#22C55E]" aria-hidden="true" />
                  </div>
                  <p className="section-label">HR Sourcing</p>
                </div>
                <h2
                  id="hr-heading"
                  className="text-3xl md:text-4xl font-extrabold text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Build the Team That Builds Your Business
                </h2>
              </div>
              <p className="text-white/55 text-sm max-w-sm leading-relaxed">
                Expert talent acquisition that connects you with professionals who drive results.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {hrServices.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 100}>
                <ServiceCard {...service} className="h-full" />
              </AnimatedSection>
            ))}
          </div>

          {/* HR Benefits */}
          <AnimatedSection delay={300}>
            <div className="p-6 rounded-xl bg-[#0F2035] border border-[#22C55E]/20 flex flex-col md:flex-row md:items-center gap-6">
              <div className="shrink-0">
                <p className="text-[#22C55E] text-sm font-semibold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                  HR Package Includes
                </p>
                <p className="text-white/45 text-xs">All plans come with these guarantees</p>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hrBenefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-white/65">
                    <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" aria-hidden="true" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Our Process ─── */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="process-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">How We Work</p>
              <h2
                id="process-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Our Proven Process
              </h2>
              <p className="text-white/55 max-w-xl mx-auto">
                A structured, transparent approach that delivers consistent results across every engagement.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={step.step} delay={i * 100}>
                  <div className="relative p-6 rounded-xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 transition-all duration-300 group">
                    {/* Step number */}
                    <p
                      className="text-5xl font-extrabold text-white/5 absolute top-4 right-5 select-none"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                      aria-hidden="true"
                    >
                      {step.step}
                    </p>
                    <div className="w-11 h-11 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/15 transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#22C55E]" aria-hidden="true" />
                    </div>
                    <p className="text-[#22C55E] text-xs font-semibold mb-1">{step.step}</p>
                    <h3
                      className="text-white font-semibold mb-2"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                    {/* Connector line */}
                    {i < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-2.5 w-5 h-px bg-[#22C55E]/30" aria-hidden="true" />
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20" aria-label="Services call to action">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="relative rounded-2xl overflow-hidden p-10 md:p-14 text-center border border-[#22C55E]/20 bg-gradient-to-br from-[#0F2035] to-[#0D1B2A] shadow-[0_0_50px_rgba(34,197,94,0.07)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#22C55E] to-transparent" aria-hidden="true" />
              <div className="flex items-center justify-center gap-3 mb-5">
                <Network className="w-5 h-5 text-[#22C55E]" aria-hidden="true" />
                <p className="section-label">Get Started</p>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Not Sure Which Service You Need?
              </h2>
              <p className="text-white/55 text-lg max-w-xl mx-auto mb-8">
                Book a free 30-minute consultation and let our experts recommend the right solution for your business.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact">
                  <span className="btn-green text-base px-8 py-3.5">
                    Book Free Consultation
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
                <Link href="/partnerships">
                  <span className="btn-outline-green text-base px-8 py-3.5">
                    Explore Partnerships
                  </span>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
