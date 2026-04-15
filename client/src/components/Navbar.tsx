/**
 * Navbar Component — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * - Sticky with transparent-to-solid scroll behavior
 * - Active link highlighted in luminous green
 * - Mobile hamburger menu with smooth slide-down
 * - Luminous green CTA button
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/jobs", label: "Jobs" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0D1B2A]/95 backdrop-blur-md border-b border-white/8 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav
        className="container mx-auto flex items-center justify-between h-16 md:h-20"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" aria-label="Localhost Limited — Home">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/LL1-logo-2_8137895a.png"
            alt="Localhost Limited Logo"
            className="h-10 md:h-12 w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? location === "/"
                : location.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link href={link.href}>
                  <span
                    className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 block ${
                      isActive
                        ? "text-[#22C55E]"
                        : "text-white/70 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#22C55E] rounded-full shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact">
            <span className="btn-green text-sm px-5 py-2.5">
              Get Started
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white/80 hover:text-white p-2 rounded-md transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#0D1B2A]/98 backdrop-blur-md border-b border-white/8`}
        aria-hidden={!mobileOpen}
      >
        <ul className="container mx-auto py-4 flex flex-col gap-1" role="list">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? location === "/"
                : location.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link href={link.href}>
                  <span
                    className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-[#22C55E] bg-[#22C55E]/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mr-3 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                    )}
                    {link.label}
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="pt-2">
            <Link href="/contact">
              <span className="btn-green w-full justify-center text-sm py-3">
                Get Started
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
