/**
 * Footer Component — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * - Dark navy background (#0A1628)
 * - White text with green accents
 * - Social media links, navigation, contact info
 */

import { Link } from "wouter";
import { Zap, MapPin, Phone, Mail, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import { COMPANY_INFO } from "@shared/company";

const footerLinks = {
  company: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/partnerships", label: "Partnerships" },
    { href: "/contact", label: "Contact" },
  ],
  services: [
    { href: "/services#marketing", label: "Social Media Management" },
    { href: "/services#marketing", label: "SEO & Digital Campaigns" },
    { href: "/services#marketing", label: "Content Marketing" },
    { href: "/services#hr", label: "Talent Acquisition" },
    { href: "/services#hr", label: "Recruitment Outsourcing" },
  ],
};

const socialLinks = [
  { href: COMPANY_INFO.social.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: COMPANY_INFO.social.twitter, label: "Twitter / X", icon: Twitter },
  { href: COMPANY_INFO.social.instagram, label: "Instagram", icon: Instagram },
  { href: COMPANY_INFO.social.facebook, label: "Facebook", icon: Facebook },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[#060E1A] border-t border-white/8"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Main Footer Content */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" aria-label="Localhost Limited — Home">
              <div className="flex items-center gap-2 mb-5 group w-fit">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#22C55E] to-[#4ADE80] flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.4)] group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all duration-300">
                  <Zap className="w-4 h-4 text-[#0A1628]" strokeWidth={2.5} />
                </div>
                <span
                  className="font-bold text-lg text-white tracking-tight"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Localhost<span className="text-[#22C55E]">.</span>
                </span>
              </div>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-6">
              Empowering businesses through smart marketing strategies, expert HR sourcing, and strategic partnerships.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3" role="list" aria-label="Social media links">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-md border border-white/10 flex items-center justify-center text-white/50 hover:text-[#22C55E] hover:border-[#22C55E]/50 hover:bg-[#22C55E]/10 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3
              className="text-white font-semibold text-sm uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Company
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-white/55 text-sm hover:text-[#22C55E] transition-colors duration-200 block">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3
              className="text-white font-semibold text-sm uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Services
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.services.map((link, i) => (
                <li key={i}>
                  <Link href={link.href}>
                    <span className="text-white/55 text-sm hover:text-[#22C55E] transition-colors duration-200 block">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className="text-white font-semibold text-sm uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Contact
            </h3>
            <ul className="space-y-4" role="list">
              <li>
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="flex items-start gap-3 text-white/55 text-sm hover:text-[#22C55E] transition-colors duration-200 group"
                  aria-label="Email us"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-[#22C55E]" />
                  {COMPANY_INFO.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY_INFO.contact.phone}`}
                  className="flex items-start gap-3 text-white/55 text-sm hover:text-[#22C55E] transition-colors duration-200 group"
                  aria-label="Call us"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-[#22C55E]" />
                  {COMPANY_INFO.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/55 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#22C55E]" />
                  <span>{COMPANY_INFO.office.fullAddress}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="container mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs">
            &copy; {year} Localhost Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-white/35 text-xs hover:text-white/60 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-white/35 text-xs hover:text-white/60 transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
