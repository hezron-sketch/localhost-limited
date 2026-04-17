/**
 * About Page — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * Sections:
 *   1. Hero — page header with about-hero background
 *   2. Company Overview
 *   3. Mission & Vision
 *   4. Core Values
 *   5. Why Choose Us
 *   6. Team Section (placeholder profiles)
 */

import { Link } from "wouter";
import {
  Eye,
  Target,
  Heart,
  Lightbulb,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import ScrollReveal, { ScrollRevealGroup } from "@/components/ScrollReveal";

const ABOUT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/about-hero-nZdUeLwgtJJp9RsXggBYUs.webp";

const coreValues = [
  {
    icon: Heart,
    title: "Market-Driven",
    description: "Every strategy is grounded in deep market insights and consumer behavior research. We understand the East African market inside and out.",
  },
  {
    icon: Lightbulb,
    title: "Creative Excellence",
    description: "We bring innovative ideas to life through immersive brand experiences that captivate audiences and drive engagement.",
  },
  {
    icon: Shield,
    title: "Field Execution",
    description: "Our experienced teams execute activations with precision. We don't just plan—we deliver results on the ground.",
  },
  {
    icon: Target,
    title: "Conversion-Focused",
    description: "Every campaign is measured and optimized for business results. We track performance and drive measurable conversion.",
  },
  {
    icon: Users,
    title: "Strategic Partnerships",
    description: "We collaborate closely with retailers, distributors, and brands to strengthen relationships and improve market presence.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "We provide clear reporting and honest communication. You always know how your campaigns are performing.",
  },
];

const teamMembers = [
  { name: "James Mwangi", role: "Chief Executive Officer", initials: "JM", dept: "Leadership" },
  { name: "Grace Njeri", role: "Head of Brand Activation", initials: "GN", dept: "Marketing" },
  { name: "Kevin Otieno", role: "Head of Field Execution", initials: "KO", dept: "Operations" },
  { name: "Fatuma Ali", role: "Partnerships & Retail Director", initials: "FA", dept: "Partnerships" },
  { name: "Brian Kamau", role: "BTL & Experiential Lead", initials: "BK", dept: "Marketing" },
  { name: "Lydia Wanjiku", role: "Senior Campaign Manager", initials: "LW", dept: "Operations" },
];

const whyChooseUs = [
  "Award-winning agency: Best Marketing Agency (DigiSoko 2020), Best e-Commerce Agency Tanzania (2019)",
  "Deep market insights across East Africa and beyond",
  "Experienced field teams executing activations with precision",
  "Comprehensive services: Brand Activation, BTL, Field Marketing, Printing & Branding, Video Production",
  "Transparent reporting and measurable campaign performance",
  "Proven track record across 200+ successful engagements",
];

export default function About() {
  return (
    <PageLayout
      title="About Us"
      description="Learn about Localhost Limited — award-winning brand activation and field marketing agency based in Nairobi, Kenya. Discover our mission, values, and the team behind Africa's leading marketing solutions company."
    >
      {/* ─── Hero ─── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        aria-label="About page hero"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${ABOUT_BG})` }}
          role="img"
          aria-label="Abstract network connection background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/60 via-[#0D1B2A]/80 to-[#0D1B2A]" />
        <div className="container mx-auto relative z-10">
          <AnimatedSection>
            <p className="section-label mb-3">About Localhost Limited</p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 max-w-3xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Driving growth by connecting brands to the right people
            </h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              Founded in 2017, Localhost Limited was established with a clear vision: to drive business growth and strengthen brand presence in a competitive marketplace. We deliver innovative brand activation, BTL marketing, and field execution solutions that expand market reach, increase visibility, and connect brands with the right customers.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Company Overview ─── */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="overview-heading">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection>
              <p className="section-label mb-3">Our Journey</p>
              <h2
                id="overview-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Award-Winning Brand Activation & Field Marketing
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                By combining market insights, creative campaigns, and on-the-ground execution, our experienced field teams work closely with clients to develop tailored strategies that accelerate growth and deliver measurable results. At Localhost Limited, brand activation goes beyond promotion—it focuses on building strong connections between brands and their target audiences through immersive experiences.
              </p>
              <p className="text-white/60 leading-relaxed mb-6">
                We believe that strategic brand activation, combined with powerful BTL marketing and meaningful partnerships, creates the foundation for sustainable business growth. Our integrated approach ensures every campaign—from retail activations to mass awareness—works in harmony to achieve your goals and drive conversion.
              </p>
              <Link href="/contact">
                <span className="btn-green inline-flex items-center gap-2 px-6 py-3">
                  Work With Us
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            </AnimatedSection>

            {/* Stats panel */}
            <ScrollRevealGroup staggerDelay={0.15} className="grid grid-cols-2 gap-4">
              {[
                { value: "2016", label: "Founded" },
                { value: "200+", label: "Clients Served" },
                { value: "15+", label: "Industries" },
                { value: "50+", label: "Team Members" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 transition-all duration-300"
                >
                  <p
                    className="text-3xl font-extrabold gradient-text mb-1"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </div>
              ))}
            </ScrollRevealGroup>
          </div>
        </div>
      </section>

      {/* ─── Mission & Vision ─── */}
      <section className="py-20" aria-labelledby="mission-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Our Purpose</p>
              <h2
                id="mission-heading"
                className="text-3xl md:text-4xl font-extrabold text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Mission &amp; Vision
              </h2>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="relative p-8 rounded-2xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 transition-all duration-300 overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#22C55E] to-transparent rounded-l-2xl" aria-hidden="true" />
              <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-[#22C55E]" aria-hidden="true" />
              </div>
              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Our Mission
              </h3>
              <p className="text-white/60 leading-relaxed">
                To empower African businesses with intelligent marketing strategies, exceptional talent solutions, and strategic partnerships that drive sustainable, measurable growth — making world-class business services accessible to every ambitious organization on the continent.
              </p>
            </div>

            {/* Vision */}
            <div className="relative p-8 rounded-2xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 transition-all duration-300 overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#4ADE80] to-transparent rounded-l-2xl" aria-hidden="true" />
              <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-[#22C55E]" aria-hidden="true" />
              </div>
              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Our Vision
              </h3>
              <p className="text-white/60 leading-relaxed">
                To be the leading integrated growth solutions provider in Africa — recognized for transforming how businesses attract customers, build teams, and forge partnerships. We envision a continent where every business has the tools and talent to compete globally.
              </p>
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── Core Values ─── */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="values-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">What Drives Us</p>
              <h2
                id="values-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Our Core Values
              </h2>
              <p className="text-white/55 max-w-xl mx-auto">
                These principles guide every decision, every interaction, and every deliverable we produce.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreValues.map((value, i) => {
              const Icon = value.icon;
              return (
                <AnimatedSection key={value.title} delay={i * 80}>
                  <div className="p-6 rounded-xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 hover:shadow-[0_4px_20px_rgba(34,197,94,0.08)] transition-all duration-300 group">
                    <div className="w-11 h-11 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/15 transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#22C55E]" aria-hidden="true" />
                    </div>
                    <h3
                      className="text-white font-semibold mb-2"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {value.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-20" aria-labelledby="why-choose-heading">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection>
              <p className="section-label mb-3">The Localhost Advantage</p>
              <h2
                id="why-choose-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Why Businesses Choose Us Over the Competition
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                We&apos;re not just another agency. We&apos;re a strategic partner that embeds itself in your business, understands your goals, and delivers solutions that create lasting impact.
              </p>
              <ul className="space-y-3" role="list">
                {whyChooseUs.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/65 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#0F2035] to-[#0D1B2A] border border-[#22C55E]/20 shadow-[0_0_40px_rgba(34,197,94,0.06)]">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/50 to-transparent rounded-t-2xl" aria-hidden="true" />
                <p className="text-[#22C55E] text-sm font-semibold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Client Satisfaction
                </p>
                <p className="text-5xl font-extrabold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                  95%
                </p>
                <p className="text-white/50 text-sm mb-6">Average client retention rate</p>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-[#22C55E] to-[#4ADE80] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
                <div className="mt-6 pt-6 border-t border-white/8 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>4.9/5</p>
                    <p className="text-white/45 text-xs">Average rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>48h</p>
                    <p className="text-white/45 text-xs">Avg. response time</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── Team Section ─── */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="team-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">The People</p>
              <h2
                id="team-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Meet Our Leadership Team
              </h2>
              <p className="text-white/55 max-w-xl mx-auto">
                A diverse team of strategists, creatives, and specialists united by a passion for driving business growth.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {teamMembers.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 60}>
                <div className="group text-center p-5 rounded-xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 hover:shadow-[0_4px_20px_rgba(34,197,94,0.08)] transition-all duration-300">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#22C55E]/25 to-[#4ADE80]/15 border border-[#22C55E]/25 flex items-center justify-center mx-auto mb-3 group-hover:shadow-[0_0_16px_rgba(34,197,94,0.2)] transition-all duration-300">
                    <span
                      className="text-[#22C55E] font-bold text-sm"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                      aria-hidden="true"
                    >
                      {member.initials}
                    </span>
                  </div>
                  <p
                    className="text-white text-sm font-semibold mb-0.5"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {member.name}
                  </p>
                  <p className="text-white/45 text-xs leading-snug mb-1.5">{member.role}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[10px]">
                    {member.dept}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20" aria-label="About page call to action">
        <div className="container mx-auto text-center">
          <AnimatedSection>
            <p className="section-label mb-3">Join Our Journey</p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Ready to Partner With Us?
            </h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto mb-8">
              Let&apos;s discuss how Localhost Limited can help your business achieve its growth objectives.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <span className="btn-green text-base px-8 py-3.5">
                  Start a Conversation
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
              <Link href="/services">
                <span className="btn-outline-green text-base px-8 py-3.5">
                  Our Services
                </span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
