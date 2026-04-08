/**
 * PageLayout Component — Localhost Limited
 * Wraps all pages with Navbar and Footer
 * Handles page-level SEO title updates
 */

import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  useEffect(() => {
    if (title) {
      document.title = `${title} — Localhost Limited`;
    }
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      }
    }
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [title, description]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0D1B2A]">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[#22C55E] focus:text-[#0A1628] focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
