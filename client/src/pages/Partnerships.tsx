/**
 * Partnerships Page — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * Sections:
 *   1. Hero — page header with partnerships background
 *   2. Partnership Opportunities
 *   3. Partner Types — corporates, startups, agencies
 *   4. Benefits of Partnering
 *   5. Partner Logo Grid (placeholders)
 *   6. CTA — Become a Partner
 */

import { Link } from "wouter";
import {
  Building2,
  Rocket,
  Network,
  ArrowRight,
  CheckCircle,
  Globe,
  TrendingUp,
  Users,
  Handshake,
  Star,
  Zap,
  BarChart3,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PartnerLogoGrid from "@/components/PartnerLogoGrid";
import AnimatedSection from "@/components/AnimatedSection";

const PARTNERSHIPS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/partnerships-bg-kUB5k3Fk7foCge3PAfYbB2.webp";

const partnerTypes = [
  {
    icon: Building2,
    title: "Corporate Partners",
    description: "Large enterprises and established companies looking to expand their market reach, access specialized talent, or co-create marketing initiatives.",
    features: [
      "Co-branded marketing campaigns",
      "Shared talent pools & referrals",
      "Joint go-to-market strategies",
      "Executive networking events",
    ],
    badge: "Enterprise",
  },
  {
    icon: Rocket,
    title: "Startup Partners",
    description: "High-growth startups seeking strategic support, market access, and the resources needed to scale rapidly across African markets.",
    features: [
      "Growth marketing support",
      "Talent acquisition priority access",
      "Investor network introductions",
      "Mentorship & advisory sessions",
    ],
    badge: "Growth",
    featured: true,
  },
  {
    icon: Network,
    title: "Agency Partners",
    description: "Marketing, PR, and consulting agencies that want to expand their service offerings and collaborate on client projects.",
    features: [
      "White-label service agreements",
      "Revenue sharing programs",
      "Joint client pitches",
      "Resource & knowledge sharing",
    ],
    badge: "Agency",
  },
];

const partnerBenefits = [
  {
    icon: Globe,
    title: "Market Access",
    desc: "Tap into our established network of 200+ businesses across East Africa and beyond.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Growth",
    desc: "Unlock new revenue streams through referrals, co-selling, and joint service offerings.",
  },
  {
    icon: Users,
    title: "Talent Network",
    desc: "Access our pre-vetted talent database and recruitment expertise for your hiring needs.",
  },
  {
    icon: Star,
    title: "Brand Visibility",
    desc: "Co-marketing opportunities that amplify your brand to our entire client and partner ecosystem.",
  },
  {
    icon: Zap,
    title: "Fast Onboarding",
    desc: "Streamlined partnership onboarding process — from agreement to active collaboration in 2 weeks.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    desc: "Dedicated partner portal with real-time analytics on referrals, revenue, and joint activities.",
  },
];

const partnerLogos = [
  { name: "TechVentures", initials: "TV", category: "Corporate" },
  { name: "Fintech Hub", initials: "FH", category: "Startup" },
  { name: "MediaGroup", initials: "MG", category: "Agency" },
  { name: "GreenGrow", initials: "GG", category: "Startup" },
  { name: "AfriTech", initials: "AT", category: "Corporate" },
  { name: "CreativeX", initials: "CX", category: "Agency" },
  { name: "DataFlow", initials: "DF", category: "Corporate" },
  { name: "BuildRight", initials: "BR", category: "Startup" },
  { name: "NexusLabs", initials: "NL", category: "Corporate" },
  { name: "PulseMedia", initials: "PM", category: "Agency" },
  { name: "ScaleUp", initials: "SU", category: "Startup" },
  { name: "ConnectPro", initials: "CP", category: "Agency" },
];

const partnershipProcess = [
  { step: "01", title: "Apply", desc: "Submit your partnership application through our contact form." },
  { step: "02", title: "Review", desc: "Our team reviews your application within 48 hours." },
  { step: "03", title: "Align", desc: "We schedule a call to align on goals and partnership structure." },
  { step: "04", title: "Launch", desc: "Sign the agreement and start collaborating within 2 weeks." },
];

export default function Partnerships() {
  return (
    <PageLayout
      title="Partnerships"
      description="Partner with Localhost Limited to unlock new markets, revenue streams, and collaborative opportunities. We work with corporates, startups, and agencies across Africa."
    >
      {/* ─── Hero ─── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        aria-label="Partnerships page hero"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${PARTNERSHIPS_BG})` }}
          role="img"
          aria-label="Abstract network nodes background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/70 via-[#0D1B2A]/80 to-[#0D1B2A]" />
        <div className="container mx-auto relative z-10">
          <AnimatedSection>
            <p className="section-label mb-3">Partnership Program</p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 max-w-3xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Grow Together Through{" "}
              <span className="gradient-text">Strategic Alliances</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed mb-8">
              Join our growing ecosystem of corporate partners, innovative startups, and specialized agencies. Together, we create opportunities that neither of us could achieve alone.
            </p>
            <a href="#become-partner">
              <span className="btn-green text-base px-7 py-3.5 inline-flex items-center gap-2">
                Become a Partner
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Partnership Opportunities ─── */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="opportunities-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Partnership Opportunities</p>
              <h2
                id="opportunities-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Find Your Partnership Model
              </h2>
              <p className="text-white/55 max-w-xl mx-auto">
                We offer tailored partnership structures for different types of organizations, each designed to create maximum mutual value.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerTypes.map((type, i) => {
              const Icon = type.icon;
              return (
                <AnimatedSection key={type.title} delay={i * 100}>
                  <div
                    className={`relative group p-7 rounded-2xl transition-all duration-300 h-full
                      ${type.featured
                        ? "bg-gradient-to-br from-[#0F2035] to-[#0D1B2A] border border-[#22C55E]/30 shadow-[0_0_40px_rgba(34,197,94,0.1)] ring-1 ring-[#22C55E]/20"
                        : "bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 hover:shadow-[0_8px_30px_rgba(34,197,94,0.08)]"
                      }`}
                    aria-label={`${type.title} partnership type`}
                  >
                    {type.featured && (
                      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#22C55E] to-transparent rounded-t-2xl" aria-hidden="true" />
                    )}

                    {/* Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center group-hover:bg-[#22C55E]/15 transition-all duration-300">
                        <Icon className="w-5 h-5 text-[#22C55E]" aria-hidden="true" />
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          type.featured
                            ? "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30"
                            : "bg-white/8 text-white/50 border border-white/10"
                        }`}
                      >
                        {type.badge}
                      </span>
                    </div>

                    <h3
                      className="text-white text-xl font-bold mb-3"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {type.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed mb-5">
                      {type.description}
                    </p>

                    <ul className="space-y-2.5" role="list">
                      {type.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-white/65">
                          <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="py-20" aria-labelledby="benefits-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Why Partner With Us</p>
              <h2
                id="benefits-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Benefits of Partnering With Localhost Limited
              </h2>
              <p className="text-white/55 max-w-xl mx-auto">
                Our partners gain access to resources, networks, and opportunities that accelerate their growth.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partnerBenefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <AnimatedSection key={benefit.title} delay={i * 80}>
                  <div className="p-6 rounded-xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 hover:shadow-[0_4px_20px_rgba(34,197,94,0.08)] transition-all duration-300 group">
                    <div className="w-11 h-11 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/15 transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#22C55E]" aria-hidden="true" />
                    </div>
                    <h3
                      className="text-white font-semibold mb-2"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {benefit.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Partner Logos ─── */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="partners-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="section-label mb-3">Our Partners</p>
              <h2
                id="partners-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Trusted by Leading Organizations
              </h2>
              <p className="text-white/55 max-w-lg mx-auto">
                A growing ecosystem of partners across corporates, startups, and agencies.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <PartnerLogoGrid partners={partnerLogos} />
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Partnership Process ─── */}
      <section className="py-20" aria-labelledby="process-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">How It Works</p>
              <h2
                id="process-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Partnership Onboarding in 4 Steps
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {partnershipProcess.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 100}>
                <div className="relative text-center p-6 rounded-xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 flex items-center justify-center mx-auto mb-4">
                    <span
                      className="text-[#22C55E] text-sm font-bold"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3
                    className="text-white font-semibold mb-2"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  {i < partnershipProcess.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2.5 w-5 h-px bg-[#22C55E]/25" aria-hidden="true" />
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Become a Partner CTA ─── */}
      <section id="become-partner" className="py-20 bg-[#060E1A]" aria-label="Become a partner call to action">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="relative rounded-2xl overflow-hidden p-10 md:p-16 border border-[#22C55E]/25 bg-gradient-to-br from-[#0F2035] to-[#0A1628] shadow-[0_0_60px_rgba(34,197,94,0.1)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#22C55E] to-transparent" aria-hidden="true" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <Handshake className="w-6 h-6 text-[#22C55E]" aria-hidden="true" />
                    <p className="section-label">Ready to Partner?</p>
                  </div>
                  <h2
                    className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Become a{" "}
                    <span className="gradient-text">Localhost Limited</span>{" "}
                    Partner
                  </h2>
                  <p className="text-white/55 text-lg max-w-xl">
                    Join our ecosystem and unlock access to markets, talent, and opportunities that will accelerate your growth trajectory.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <Link href="/contact?subject=partnerships">
                    <span className="btn-green text-base px-8 py-3.5 whitespace-nowrap inline-flex items-center gap-2">
                      Apply Now
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </Link>
                  <Link href="/services">
                    <span className="btn-outline-green text-base px-8 py-3.5 whitespace-nowrap">
                      View Services First
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
