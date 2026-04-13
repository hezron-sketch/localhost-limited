import { trpc } from "@/lib/trpc";
import { Loader2, MapPin, Briefcase, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "./ScrollReveal";
import { Link } from "wouter";

export default function JobListings() {
  const { data: jobsData, isLoading } = trpc.cms.jobs.list.useQuery({ limit: 3, offset: 0 });
  const jobs = jobsData?.jobs || [];
  const totalJobs = jobsData?.total || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#22C55E]" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">No job openings available at the moment. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job, index) => (
        <ScrollReveal key={job.id} delay={index * 100}>
          <div className="bg-gradient-to-r from-[#0A1628] to-[#0F2035] border-2 border-white/10 rounded-lg p-6 hover:border-[#22C55E]/50 transition-all hover:shadow-lg hover:shadow-[#22C55E]/20 group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white text-xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {job.title}
                </h3>
                <p className="text-[#22C55E] text-sm font-bold mt-1">{job.department}</p>
              </div>
              <span className="bg-[#22C55E] text-black px-3 py-1 rounded-full text-xs font-black capitalize">
                {job.jobType}
              </span>
            </div>

            <p className="text-white/70 mb-4 line-clamp-2">{job.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-white/10">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#22C55E]" />
                <span className="text-white/60 text-sm font-semibold">{job.location}</span>
              </div>
              {job.salaryRange && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-white/60 text-sm font-semibold">{job.salaryRange}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#22C55E]" />
                <span className="text-white/60 text-sm font-semibold">{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {job.requirements && (
              <div className="mb-4">
                <h4 className="text-white text-sm font-black mb-2">Requirements</h4>
                <p className="text-white/60 text-sm line-clamp-2">{job.requirements}</p>
              </div>
            )}

            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-black w-full font-black group-hover:shadow-lg group-hover:shadow-[#22C55E]/30 transition-all">
              View Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </ScrollReveal>
      ))}

      {totalJobs > 3 && (
        <ScrollReveal delay={300}>
          <Link href="/jobs">
            <Button className="w-full bg-white/10 hover:bg-white/15 text-white border-2 border-white/20 font-black py-6 text-base">
              View All {totalJobs} Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </ScrollReveal>
      )}
    </div>
  );
}
