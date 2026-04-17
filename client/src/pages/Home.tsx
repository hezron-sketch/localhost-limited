/**
 * Home Page — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * Sections:
 *   1. Hero — full-bleed with headline, CTA, and hero background image
 *   2. Stats — animated counters
 *   3. Services Preview — 3 service cards
 *   4. Why Us — differentiators
 *   5. Testimonials — 3 testimonial cards
 *   6. CTA Banner — final call to action
 */

import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  CheckCircle,
  BarChart3,
  Rocket,
  Globe,
  Award,
  ChevronRight,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import AnimatedSection from "@/components/AnimatedSection";
import Slider3D from "@/components/Slider3D";
import Card3D from "@/components/Card3D";
import ScrollReveal, { ScrollRevealGroup } from "@/components/ScrollReveal";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/hero-bg-hMAJanvygtVwYcoE3qDYBQ.webp";

const stats = [
  { value: "200+", label: "Clients Served" },
  { value: "95%", label: "Client Retention" },
  { value: "50+", label: "Team Members" },
  { value: "8+", label: "Years Experience" },
];

const servicesPreview = [
  {
    icon: Sparkles,
    title: "Brand Activation",
    description: "Immersive brand experiences that captivate audiences and create lasting connections. From promotional events to mass awareness campaigns.",
    benefits: ["Event organization", "Mass mobilization campaigns", "Brand experiences"],
  },
  {
    icon: Zap,
    title: "BTL & Experiential",
    description: "Below-the-line marketing that drives consumer engagement and conversion. Strategic retail activations and field marketing excellence.",
    benefits: ["Retail campaigns", "Consumer promotion", "Route to market"],
  },
  {
    icon: Target,
    title: "Field Execution",
    description: "Experienced field teams that execute promotions, activations, and campaigns with precision. Market insights driving every decision.",
    benefits: ["Strategic planning", "Performance monitoring", "Conversion optimization"],
  },
];

const testimonials = [
  {
    quote: "Their brand activation campaign increased our product visibility by 300% in 8 weeks. Field teams executed flawlessly with measurable results.",
    name: "Sarah Kamau",
    role: "Marketing Director",
    company: "Unilever East Africa",
    rating: 5,
  },
  {
    quote: "The BTL campaign in our retail network drove 45% increase in consumer engagement. Professional execution and measurable ROI.",
    name: "David Ochieng",
    role: "Retail Manager",
    company: "Nakumatt Holdings",
    rating: 5,
  },
  {
    quote: "Their integrated brand activation approach transformed how we connect with consumers. Outstanding strategy and execution.",
    name: "Amina Hassan",
    role: "Brand Manager",
    company: "Nestlé Tanzania",
    rating: 5,
  },
];

const whyUs = [
  { icon: Rocket, title: "Field Expertise", desc: "Experienced teams executing activations with precision and market insight." },
  { icon: Globe, title: "Market Insights", desc: "Deep understanding of consumer behavior and retail trends across East Africa." },
  { icon: Award, title: "Award-Winning", desc: "Best Marketing Agency (DigiSoko 2020) & Best e-Commerce Agency Tanzania (2019)." },
  { icon: BarChart3, title: "Conversion-Focused", desc: "Every campaign tracked and optimized for measurable business results." },
];

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <PageLayout
      title="Home"
      description="Localhost Limited delivers innovative brand activation, BTL marketing, and field execution services. Award-winning marketing agency based in Nairobi, Kenya."
    >
      {/* ─── Hero Section ─── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        aria-label="Hero section"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          role="img"
          aria-label="Abstract dark tech background with luminous green orb"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A]/95 via-[#0D1B2A]/80 to-[#0D1B2A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-transparent to-transparent" />

        {/* Content */}
        <div className="container mx-auto relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.8)]" aria-hidden="true" />
              <span className="section-label text-xs">Dar es Salaam, Tanzania — Est. 2017</span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 animate-fade-in-up"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Empowering Business Growth
            </h1>

            {/* Subtext */}
            <p className="text-white/65 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl animate-fade-in-up delay-100">
              Localhost Limited is your strategic partner for innovative brand activation, market-driven field marketing, and strategic retail campaigns across East Africa and beyond.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 animate-fade-in-up delay-200">
              <Link href="/services">
                <span className="btn-green text-base px-7 py-3.5">
                  Get Started
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
              <Link href="/contact">
                <span className="btn-outline-green text-base px-7 py-3.5">
                  Contact Us
                </span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 mt-10 animate-fade-in-up delay-300">
              {["ISO Certified", "200+ Clients", "Pan-African"].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-white/50 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#22C55E]" aria-hidden="true" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-500" aria-hidden="true">
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="py-16 bg-[#060E1A] border-y border-white/5" aria-label="Company statistics">
        <div className="container mx-auto">
          <ScrollRevealGroup staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p
                  className="text-3xl md:text-4xl font-extrabold gradient-text mb-1"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                  aria-label={`${stat.value} ${stat.label}`}
                >
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─── Services Preview ─── */}
      <section className="py-20 md:py-28" aria-labelledby="services-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">What We Do</p>
              <h2
                id="services-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Our Core Services
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mx-auto">
                Three pillars of expertise designed to accelerate your business growth and build lasting competitive advantage.
              </p>
            </div>
          </AnimatedSection>

          <ScrollRevealGroup staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesPreview.map((service, i) => (
              <div key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </ScrollRevealGroup>

          <AnimatedSection className="text-center mt-10" delay={300}>
            <Link href="/services">
              <span className="btn-outline-green inline-flex items-center gap-2 px-7 py-3">
                View All Services
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="why-us-heading">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left: Text */}
            <AnimatedSection>
              <p className="section-label mb-3">Why Localhost Limited</p>
              <h2
                id="why-us-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Built for Brands That Demand Impact
              </h2>
              <p className="text-white/55 leading-relaxed mb-8">
                We combine market insights, creative campaigns, and on-the-ground execution to deliver brand experiences that connect with audiences and drive conversion. Our field teams work as an extension of your brand, not just a vendor.
              </p>
              <Link href="/about">
                <span className="btn-green inline-flex items-center gap-2 px-6 py-3">
                  Learn About Us
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            </AnimatedSection>

            {/* Right: Feature Grid */}
            <ScrollRevealGroup staggerDelay={0.15} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyUs.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-5 rounded-xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/15 transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#22C55E]" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </ScrollRevealGroup>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 md:py-28" aria-labelledby="testimonials-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="section-label mb-3">Client Stories</p>
              <h2
                id="testimonials-heading"
                className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                What Our Clients Say
              </h2>
              <p className="text-white/55 text-lg max-w-xl mx-auto">
                Real results from real businesses across Africa.
              </p>
            </div>
          </AnimatedSection>

          <div className="h-96 mb-12">
            <Slider3D
              items={testimonials.map((t) => ({
                id: t.name,
                title: t.name,
                description: t.quote,
              }))}
              autoPlay={true}
              autoPlayInterval={6000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 100}>
                <Card3D
                  title={t.name}
                  description={t.quote}
                  gradient="from-blue-500/30 to-blue-500/20"
                >
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-white/70 text-xs font-medium">{t.role}</p>
                      <p className="text-white/50 text-xs">{t.company}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_: unknown, i: number) => (
                        <span key={i} className="text-[#22C55E] text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </Card3D>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 bg-[#060E1A]" aria-label="Call to action">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="relative rounded-2xl overflow-hidden p-10 md:p-16 text-center border border-[#22C55E]/20 bg-gradient-to-br from-[#0F2035] to-[#0D1B2A] shadow-[0_0_60px_rgba(34,197,94,0.08)]">
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent" aria-hidden="true" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

              <p className="section-label mb-4">Ready to Grow?</p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Let&apos;s Build Something{" "}
                <span className="gradient-text">Remarkable</span> Together
              </h2>
              <p className="text-white/55 text-lg max-w-xl mx-auto mb-8">
                Whether you need marketing firepower, top talent, or strategic partnerships — we&apos;re ready to help you scale.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact">
                  <span className="btn-green text-base px-8 py-3.5">
                    Get Started Today
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
                <Link href="/services">
                  <span className="btn-outline-green text-base px-8 py-3.5">
                    Explore Services
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
