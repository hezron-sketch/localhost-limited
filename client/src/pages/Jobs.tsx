import { trpc } from "@/lib/trpc";
import { Loader2, MapPin, Briefcase, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedSection from "@/components/AnimatedSection";

const JOBS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/hero-bg-hMAJanvygtVwYcoE3qDYBQ.webp";

export default function Jobs() {
  const { data: jobsData, isLoading } = trpc.cms.jobs.list.useQuery({ limit: 100, offset: 0 });
  const jobs = jobsData?.jobs || [];

  return (
    <PageLayout
      title="Job Openings"
      description="Explore career opportunities at Localhost Limited. Join our team and make an impact in marketing and talent solutions."
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
          aria-label="Abstract digital background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/70 via-[#0D1B2A]/85 to-[#0D1B2A]" />
        <div className="container mx-auto relative z-10">
          <AnimatedSection>
            <p className="section-label mb-3">Careers</p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-5 max-w-3xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Join Our <span className="gradient-text">Growing Team</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
              Be part of a dynamic organization transforming businesses through smart marketing and talent solutions. We're hiring talented professionals who are ready to make an impact.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Job Listings ─── */}
      <section className="py-20 bg-[#060E1A]" aria-labelledby="jobs-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="mb-12">
              <h2
                id="jobs-heading"
                className="text-4xl md:text-5xl font-black text-white mb-3"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Available Positions
              </h2>
              <p className="text-white/60 text-lg">
                {jobs.length === 0 ? "No positions available at the moment. Check back soon!" : `${jobs.length} position${jobs.length !== 1 ? "s" : ""} open`}
              </p>
            </div>
          </AnimatedSection>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#22C55E]" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <ScrollReveal key={job.id} delay={index * 100}>
                  <div className="bg-gradient-to-r from-[#0A1628] to-[#0F2035] border-2 border-white/10 rounded-xl p-8 hover:border-[#22C55E]/50 transition-all hover:shadow-lg hover:shadow-[#22C55E]/20 group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-white text-2xl font-black mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                          {job.title}
                        </h3>
                        <p className="text-[#22C55E] text-base font-bold">{job.department}</p>
                      </div>
                      <span className="bg-[#22C55E] text-black px-4 py-2 rounded-lg text-sm font-black capitalize">
                        {job.jobType}
                      </span>
                    </div>

                    <p className="text-white/80 text-base leading-relaxed mb-6">{job.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-6 border-y-2 border-white/10">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                        <span className="text-white/70 font-semibold">{job.location}</span>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                          <span className="text-white/70 font-semibold">{job.salaryRange}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                        <span className="text-white/70 font-semibold">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {job.requirements && (
                      <div className="mb-6">
                        <h4 className="text-white text-base font-black mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Requirements</h4>
                        <p className="text-white/70 leading-relaxed">{job.requirements}</p>
                      </div>
                    )}

                    {job.benefits && (
                      <div className="mb-6">
                        <h4 className="text-white text-base font-black mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Benefits</h4>
                        <p className="text-white/70 leading-relaxed">{job.benefits}</p>
                      </div>
                    )}

                    <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-black w-full font-black text-base py-6 group-hover:shadow-lg group-hover:shadow-[#22C55E]/30 transition-all">
                      Apply Now
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="bg-[#0A1628] border-2 border-white/10 rounded-xl p-12 text-center">
              <p className="text-white/60 text-lg">No job openings available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 bg-[#0D1B2A]" aria-labelledby="cta-heading">
        <div className="container mx-auto">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <h2
                id="cta-heading"
                className="text-4xl md:text-5xl font-black text-white mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Don't See Your Role?
              </h2>
              <p className="text-white/70 text-lg mb-8">
                We're always looking for talented professionals. Send us your resume and let's explore opportunities together.
              </p>
              <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-black font-black text-base px-8 py-6">
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
}
