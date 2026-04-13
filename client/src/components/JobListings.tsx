import { trpc } from "@/lib/trpc";
import { Loader2, MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "./ScrollReveal";

export default function JobListings() {
  const { data: jobsData, isLoading } = trpc.cms.jobs.list.useQuery({ limit: 50, offset: 0 });
  const jobs = jobsData?.jobs || [];

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
        <p className="text-white/60">No job openings available at the moment. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <ScrollReveal key={job.id} delay={index * 100}>
          <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6 hover:border-[#22C55E]/50 transition-all hover:shadow-lg hover:shadow-[#22C55E]/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white text-xl font-bold">{job.title}</h3>
                <p className="text-[#22C55E] text-sm mt-1">{job.department}</p>
              </div>
              <span className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full text-xs font-semibold capitalize">
                {job.jobType}
              </span>
            </div>

            <p className="text-white/70 mb-4">{job.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-white/10">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#22C55E]" />
                <span className="text-white/60 text-sm">{job.location}</span>
              </div>
              {job.salaryRange && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-white/60 text-sm">{job.salaryRange}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#22C55E]" />
                <span className="text-white/60 text-sm">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {job.requirements && (
              <div className="mb-4">
                <h4 className="text-white text-sm font-semibold mb-2">Requirements</h4>
                <p className="text-white/60 text-sm line-clamp-2">{job.requirements}</p>
              </div>
            )}

            {job.benefits && (
              <div className="mb-4">
                <h4 className="text-white text-sm font-semibold mb-2">Benefits</h4>
                <p className="text-white/60 text-sm line-clamp-2">{job.benefits}</p>
              </div>
            )}

            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-black w-full mt-4">
              Apply Now
            </Button>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
