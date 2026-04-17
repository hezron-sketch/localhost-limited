/**
 * Jobs Page — Localhost Limited
 * Optimized for performance with server-side pagination
 */

import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { Search, MapPin, Briefcase, Calendar, ArrowRight, DollarSign } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import ScrollReveal from "@/components/ScrollReveal";
import { trpc } from "@/lib/trpc";

const JOBS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/services-bg-8Q3voRTxHkWeXjcMVBCnue.webp";

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Increased from 6 for better performance

  // Fetch only the current page of jobs (optimized)
  const { data: jobsData, isLoading, error } = trpc.cms.jobs.list.useQuery({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  const jobs = jobsData?.jobs || [];
  const totalJobs = jobsData?.total || 0;
  const totalPages = Math.ceil(totalJobs / itemsPerPage);

  // Client-side search filtering (only on current page data)
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return jobs;
    
    const term = searchTerm.toLowerCase();
    return jobs.filter((job: any) =>
      job.title.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term) ||
      job.department.toLowerCase().includes(term)
    );
  }, [jobs, searchTerm]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <PageLayout
      title="Jobs"
      description="Explore career opportunities at Localhost Limited. Join our award-winning team and help drive brand activation and field marketing excellence across East Africa."
    >
      {/* ─── Hero ─── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        aria-label="Jobs page hero"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: `url(${JOBS_BG})` }}
          role="img"
          aria-label="Abstract background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/70 via-[#0D1B2A]/85 to-[#0D1B2A]" />
        <div className="container mx-auto relative z-10">
          <AnimatedSection>
            <p className="section-label mb-3">Career Opportunities</p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 max-w-3xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Join Top Companies{" "}
              <span className="gradient-text">Across Industries</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              Explore diverse career opportunities with leading organizations across East Africa and beyond. From marketing and tech to operations and finance, we connect talented professionals with roles that drive impact, innovation, and growth.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Search ─── */}
      <section className="py-12 bg-[#060E1A]" aria-labelledby="search-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 id="search-heading" className="sr-only">
              Search jobs
            </h2>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search by job title, department, or keywords..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all duration-200"
                  aria-label="Search jobs"
                />
              </div>
            </div>

            {/* Results Info */}
            <div className="text-white/60 text-sm">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Showing {filteredJobs.length > 0 ? 1 : 0} to{" "}
                  {Math.min(filteredJobs.length, itemsPerPage)} of{" "}
                  {totalJobs} job{totalJobs !== 1 ? "s" : ""}
                </>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Jobs List ─── */}
      <section className="py-20 md:py-28" aria-labelledby="jobs-heading">
        <div className="container mx-auto">
          <h2 id="jobs-heading" className="sr-only">
            Available Jobs
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#22C55E]" />
              <p className="text-white/60 mt-4">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">Failed to load jobs. Please try again later.</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" aria-hidden="true" />
              <p className="text-white/60 text-lg">
                {searchTerm ? "No jobs found matching your search." : "No jobs available at the moment."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredJobs.map((job: any, index: number) => (
                  <ScrollReveal key={job.id} delay={index * 50}>
                    <Link href={`/jobs/${job.id}`}>
                      <div className="group h-full p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#22C55E]/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#22C55E]/10">
                        {/* Job Title */}
                        <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-[#22C55E] transition-colors line-clamp-2">
                          {job.title}
                        </h3>

                        {/* Meta Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Briefcase className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>{formatDate(job.createdAt)}</span>
                          </div>
                          {job.salaryRange && (
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                              <DollarSign className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                              <span>{job.salaryRange}</span>
                            </div>
                          )}
                        </div>

                        {/* Job Type Badge */}
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-medium">
                            {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                          </span>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-[#22C55E] text-sm font-medium group-hover:gap-3 transition-all">
                          View Details
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-[#22C55E]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-all ${
                            currentPage === pageNum
                              ? "bg-[#22C55E] text-[#0D1B2A] font-medium"
                              : "border border-white/10 text-white/70 hover:text-white hover:border-[#22C55E]/50"
                          }`}
                          aria-label={`Go to page ${pageNum}`}
                          aria-current={currentPage === pageNum ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-[#22C55E]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
