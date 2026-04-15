/**
 * Jobs Page — Localhost Limited
 * Display all active job openings with search and filter capabilities
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, MapPin, Briefcase, Calendar, ArrowRight, DollarSign } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import ScrollReveal from "@/components/ScrollReveal";
import { trpc } from "@/lib/trpc";

const JOBS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/services-bg-8Q3voRTxHkWeXjcMVBCnue.webp";

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch all active jobs
  const { data: jobsData, isLoading, error } = trpc.cms.jobs.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const jobs = jobsData?.jobs || [];

  // Filter and search
  const filteredJobs = useMemo(() => {
    return jobs.filter((job: any) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJobType = !selectedJobType || job.jobType === selectedJobType;
      const matchesDepartment = !selectedDepartment || job.department === selectedDepartment;
      return matchesSearch && matchesJobType && matchesDepartment;
    });
  }, [jobs, searchTerm, selectedJobType, selectedDepartment]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique job types and departments for filters
  const jobTypes = Array.from(new Set(jobs.map((j: any) => j.jobType)));
  const departments = Array.from(new Set(jobs.map((j: any) => j.department)));

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
              Join Our{" "}
              <span className="gradient-text">Award-Winning Team</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
              Help us drive brand activation, field marketing excellence, and business growth across East Africa. We're looking for talented professionals to join our growing team.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Search & Filter ─── */}
      <section className="py-12 bg-[#060E1A]" aria-labelledby="search-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <h2 id="search-heading" className="sr-only">
              Search and filter jobs
            </h2>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search by job title or keywords..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all duration-200"
                  aria-label="Search jobs"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Job Type
                </label>
                <select
                  value={selectedJobType || ""}
                  onChange={(e) => {
                    setSelectedJobType(e.target.value || null);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all duration-200 appearance-none cursor-pointer"
                  aria-label="Filter by job type"
                >
                  <option value="">All Job Types</option>
                  {jobTypes.map((type: any) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment || ""}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value || null);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all duration-200 appearance-none cursor-pointer"
                  aria-label="Filter by department"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept: any) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 text-white/60 text-sm">
              Showing {paginatedJobs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of{" "}
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
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
          ) : paginatedJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" aria-hidden="true" />
              <p className="text-white/60 text-lg">No jobs found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedJobs.map((job: any, index: number) => (
                <ScrollReveal key={job.id} delay={index * 100}>
                  <Link href={`/jobs/${job.id}`}>
                    <div className="group h-full p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#22C55E]/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#22C55E]/10">
                      {/* Job Title */}
                      <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-[#22C55E] transition-colors">
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
                      <div className="flex items-center gap-2 text-[#22C55E] font-medium text-sm group-hover:gap-3 transition-all">
                        View Details
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#22C55E]/30 transition-all"
                aria-label="Previous page"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    currentPage === page
                      ? "bg-[#22C55E] text-[#0D1B2A] font-medium"
                      : "bg-white/5 border border-white/10 text-white hover:border-[#22C55E]/30"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#22C55E]/30 transition-all"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#22C55E]/20 via-[#22C55E]/10 to-transparent border-t border-b border-[#22C55E]/20">
        <div className="container mx-auto">
          <AnimatedSection className="text-center">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Don't See Your Perfect Fit?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              We're always looking for talented professionals. Send us your CV and let's explore opportunities together.
            </p>
            <Link href="/contact">
              <span className="btn-green inline-flex items-center gap-2 px-7 py-3">
                Get in Touch
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
