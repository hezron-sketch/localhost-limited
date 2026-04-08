/**
 * Contact Page — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * Sections:
 *   1. Hero — page header
 *   2. Split-screen: Contact Form (left) + Contact Info (right)
 *   3. FAQ Section
 */

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import ContactForm from "@/components/ContactForm";
import AnimatedSection from "@/components/AnimatedSection";

const CONTACT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/contact-bg-XawDw7fYMHSDGpKqpQA6RE.webp";

const contactDetails = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@localhostlimited.com",
    href: "mailto:hello@localhostlimited.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+254 700 000 000",
    href: "tel:+254700000000",
    sub: "Mon–Fri, 8am–6pm EAT",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Nairobi, Kenya",
    href: "https://maps.google.com/?q=Nairobi,Kenya",
    sub: "Westlands Business District",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon–Fri: 8am – 6pm",
    href: null,
    sub: "EAT (UTC+3)",
  },
];

const socialLinks = [
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin, handle: "@LocalhostLimited" },
  { href: "https://twitter.com", label: "Twitter / X", icon: Twitter, handle: "@LocalhostLtd" },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram, handle: "@localhostlimited" },
  { href: "https://facebook.com", label: "Facebook", icon: Facebook, handle: "Localhost Limited" },
];

const faqs = [
  {
    q: "How quickly can you start on a new project?",
    a: "For most engagements, we can begin within 1–2 weeks of signing the agreement. For urgent projects, we can often fast-track onboarding within 5 business days.",
  },
  {
    q: "Do you work with businesses outside of Kenya?",
    a: "Yes. While we are headquartered in Nairobi, we serve clients across East Africa and have worked with organizations in Uganda, Tanzania, Rwanda, and internationally.",
  },
  {
    q: "What is the minimum engagement period?",
    a: "Our standard engagements are 3 months minimum for marketing services. HR sourcing is project-based with no minimum term. Partnership agreements are typically 12 months.",
  },
  {
    q: "Do you offer custom packages?",
    a: "Absolutely. We understand that every business is unique, and we tailor our service packages to match your specific goals, budget, and timeline.",
  },
  {
    q: "How do you measure and report on results?",
    a: "We provide detailed monthly reports with KPIs agreed upon at the start of each engagement. Clients also have access to a real-time dashboard for key metrics.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/8 last:border-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="text-white/80 text-sm font-medium group-hover:text-white transition-colors duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#22C55E] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 pb-5" : "max-h-0"}`}
      >
        <p className="text-white/55 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with Localhost Limited. Reach us by email, phone, or visit our office in Nairobi, Kenya. We respond within 24 hours."
    >
      {/* ─── Hero ─── */}
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        aria-label="Contact page hero"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: `url(${CONTACT_BG})` }}
          role="img"
          aria-label="Abstract city map background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/60 via-[#0D1B2A]/80 to-[#0D1B2A]" />
        <div className="container mx-auto relative z-10">
          <AnimatedSection>
            <p className="section-label mb-3">Get In Touch</p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 max-w-3xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Let&apos;s Start a{" "}
              <span className="gradient-text">Conversation</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              Whether you have a project in mind, a question about our services, or want to explore a partnership — we&apos;d love to hear from you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Contact Split ─── */}
      <section className="py-16 bg-[#060E1A]" aria-label="Contact form and information">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact Form — left (wider) */}
            <AnimatedSection className="lg:col-span-3">
              <div className="p-8 rounded-2xl bg-[#0F2035] border border-white/8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#22C55E]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2
                      className="text-white font-bold text-lg"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Send Us a Message
                    </h2>
                    <p className="text-white/45 text-xs">We&apos;ll get back to you within 24 hours</p>
                  </div>
                </div>
                <ContactForm />
              </div>
            </AnimatedSection>

            {/* Contact Info — right */}
            <AnimatedSection className="lg:col-span-2" delay={150}>
              <div className="space-y-5">
                {/* Contact Details */}
                {contactDetails.map((detail, i) => {
                  const Icon = detail.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center shrink-0 group-hover:bg-[#22C55E]/15 transition-all duration-300">
                        <Icon className="w-5 h-5 text-[#22C55E]" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-white/45 text-xs mb-0.5">{detail.label}</p>
                        <p
                          className="text-white text-sm font-medium group-hover:text-[#22C55E] transition-colors duration-200"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {detail.value}
                        </p>
                        <p className="text-white/35 text-xs mt-0.5">{detail.sub}</p>
                      </div>
                    </div>
                  );

                  return detail.href ? (
                    <a
                      key={i}
                      href={detail.href}
                      target={detail.href.startsWith("http") ? "_blank" : undefined}
                      rel={detail.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={`${detail.label}: ${detail.value}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={i}>{content}</div>
                  );
                })}

                {/* Social Links */}
                <div className="p-5 rounded-xl bg-[#0F2035] border border-white/8">
                  <p
                    className="text-white/45 text-xs mb-4"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Follow Us
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Follow us on ${social.label}`}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/8 hover:border-[#22C55E]/30 hover:bg-[#22C55E]/8 transition-all duration-200 group"
                        >
                          <Icon className="w-4 h-4 text-white/50 group-hover:text-[#22C55E] transition-colors duration-200" aria-hidden="true" />
                          <div>
                            <p className="text-white/70 text-xs font-medium group-hover:text-white transition-colors duration-200">
                              {social.label}
                            </p>
                            <p className="text-white/35 text-[10px]">{social.handle}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-20" aria-labelledby="faq-heading">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <p className="section-label mb-3">FAQ</p>
                <h2
                  id="faq-heading"
                  className="text-3xl md:text-4xl font-extrabold text-white mb-4"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Frequently Asked Questions
                </h2>
                <p className="text-white/55">
                  Quick answers to common questions about working with Localhost Limited.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="rounded-2xl bg-[#0F2035] border border-white/8 px-6 divide-y divide-white/8">
                {faqs.map((faq, i) => (
                  <FAQItem key={i} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
