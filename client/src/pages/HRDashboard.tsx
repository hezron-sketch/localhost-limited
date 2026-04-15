/**
 * HR Dashboard — Localhost Limited
 * Manage job postings and applications
 * Protected route - requires admin authentication
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Briefcase, Users, FileText, ChevronLeft, Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Tab = "overview" | "jobs" | "applications";

export default function HRDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [selectedJobForApps, setSelectedJobForApps] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    salaryRange: "",
    jobType: "full-time" as const,
    requirements: "",
    benefits: "",
  });

  // Fetch data
  const { data: jobsData, refetch: refetchJobs } = trpc.cms.jobs.list.useQuery({ limit: 100, offset: 0 });
  const jobs = jobsData?.jobs || [];

  // Fetch applications
  const { data: applicationsData } = trpc.cms.applications.list.useQuery({ limit: 1000, offset: 0 });
  const allApplications = applicationsData?.applications || [];

  // Create job mutation
  const createJobMutation = trpc.cms.jobs.create.useMutation({
    onSuccess: () => {
      refetchJobs();
      setShowNewJobModal(false);
      setFormData({
        title: "",
        description: "",
        department: "",
        location: "",
        salaryRange: "",
        jobType: "full-time",
        requirements: "",
        benefits: "",
      });
    },
  });

  // Delete job mutation
  const deleteJobMutation = trpc.cms.jobs.delete.useMutation({
    onSuccess: () => {
      refetchJobs();
    },
  });

  // Check authentication
  if (loading) {
    return (
      <PageLayout title="HR Dashboard" description="">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#22C55E]" />
            <p className="text-white/60 mt-4">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <PageLayout title="Access Denied" description="">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white mb-4">Access Denied</h1>
            <p className="text-white/60 mb-8">You need admin privileges to access this page.</p>
            <Link href="/">
              <span className="btn-green inline-flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </span>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Calculate stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j: any) => j.status === "active").length;
  const totalApplications = allApplications.length;
  const pendingApplications = allApplications.filter((a: any) => a.status === "pending").length;

  const handleCreateJob = async () => {
    try {
      await createJobMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        department: formData.department,
        location: formData.location,
        salaryRange: formData.salaryRange || undefined,
        jobType: formData.jobType,
        requirements: formData.requirements || undefined,
        benefits: formData.benefits || undefined,
      });
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      try {
        await deleteJobMutation.mutateAsync({ id: jobId });
      } catch (error) {
        console.error("Failed to delete job:", error);
      }
    }
  };

  return (
    <PageLayout title="HR Dashboard" description="Manage job postings and applications">
      <div className="pt-32 pb-20">
        <div className="container mx-auto">
          <AnimatedSection>
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-2">HR Dashboard</h1>
                <p className="text-white/60">Manage job postings and applications</p>
              </div>
              <Link href="/">
                <span className="flex items-center gap-2 text-[#22C55E] hover:text-[#16a34a] transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Site
                </span>
              </Link>
            </div>

            {/* Overview Stats */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white/70 font-medium">Total Jobs</h3>
                    <Briefcase className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{totalJobs}</p>
                  <p className="text-white/60 text-sm mt-2">{activeJobs} active</p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white/70 font-medium">Applications</h3>
                    <Users className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{totalApplications}</p>
                  <p className="text-white/60 text-sm mt-2">{pendingApplications} pending</p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white/70 font-medium">Status</h3>
                    <FileText className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">Active</p>
                  <p className="text-white/60 text-sm mt-2">System operational</p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-white/10">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-3 font-medium border-b-2 transition-all ${
                  activeTab === "overview"
                    ? "text-[#22C55E] border-[#22C55E]"
                    : "text-white/60 border-transparent hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className={`px-4 py-3 font-medium border-b-2 transition-all ${
                  activeTab === "jobs"
                    ? "text-[#22C55E] border-[#22C55E]"
                    : "text-white/60 border-transparent hover:text-white"
                }`}
              >
                Job Postings
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`px-4 py-3 font-medium border-b-2 transition-all ${
                  activeTab === "applications"
                    ? "text-[#22C55E] border-[#22C55E]"
                    : "text-white/60 border-transparent hover:text-white"
                }`}
              >
                Applications
              </button>
            </div>

            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-white">Job Postings</h2>
                  <button
                    onClick={() => setShowNewJobModal(true)}
                    className="btn-green inline-flex items-center gap-2 px-4 py-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Job
                  </button>
                </div>

                {jobs.length === 0 ? (
                  <div className="text-center py-12 rounded-xl bg-white/5 border border-white/10">
                    <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">No job postings yet. Create one to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job: any) => (
                      <div
                        key={job.id}
                        className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#22C55E]/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-extrabold text-white mb-2">{job.title}</h3>
                            <div className="flex flex-wrap gap-4 text-white/60 text-sm mb-4">
                              <span>{job.department}</span>
                              <span>{job.location}</span>
                              <span className="text-[#22C55E]">{job.jobType}</span>
                            </div>
                            <p className="text-white/70 line-clamp-2">{job.description}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              job.status === "active"
                                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                            }`}
                          >
                            {job.status === "active" ? "Active" : "Archived"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div>
                <h2 className="text-2xl font-extrabold text-white mb-6">Job Applications</h2>

                {jobs.length === 0 ? (
                  <div className="text-center py-12 rounded-xl bg-white/5 border border-white/10">
                    <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">No job postings yet. Create jobs to receive applications.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job: any) => {
                      const jobApplications = allApplications.filter((a: any) => a.jobId === job.id);
                      return (
                        <div
                          key={job.id}
                          className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                        >
                          <h3 className="text-lg font-extrabold text-white mb-4">{job.title}</h3>
                          {jobApplications.length === 0 ? (
                            <div className="text-center py-8 text-white/60">
                              <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                              <p>No applications yet</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {jobApplications.map((app: any) => (
                                <div key={app.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-white">{app.fullName}</h4>
                                      <p className="text-white/60 text-sm">{app.email}</p>
                                      <p className="text-white/60 text-sm">{app.phone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <a
                                        href={app.cvUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 rounded text-sm bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E]/20 transition-colors"
                                      >
                                        View CV
                                      </a>
                                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                                        app.status === "pending"
                                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                                          : app.status === "reviewed"
                                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                          : app.status === "accepted"
                                          ? "bg-green-500/10 text-green-400 border border-green-500/30"
                                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                                      }`}>
                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                  {app.coverLetter && (
                                    <p className="text-white/70 text-sm mt-3 p-2 rounded bg-white/5 border-l-2 border-[#22C55E]">
                                      {app.coverLetter.substring(0, 200)}...
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </AnimatedSection>

          {/* New Job Modal */}
          {showNewJobModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02]">
                  <h2 className="text-2xl font-extrabold text-white">Create New Job Posting</h2>
                  <button
                    onClick={() => setShowNewJobModal(false)}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-6 h-6 text-white/60" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Job Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Senior Marketing Manager"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Department *</label>
                      <Input
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g., Marketing"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Location *</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Nairobi, Kenya"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Job Type *</label>
                      <Select value={formData.jobType} onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Salary Range</label>
                      <Input
                        value={formData.salaryRange}
                        onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                        placeholder="e.g., $50,000 - $70,000"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Description *</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Job description and responsibilities..."
                      className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Requirements</label>
                    <Textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Required qualifications and skills..."
                      className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Benefits</label>
                    <Textarea
                      value={formData.benefits}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                      placeholder="Job benefits and perks..."
                      className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setShowNewJobModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateJob}
                      disabled={createJobMutation.isPending || !formData.title || !formData.department || !formData.location || !formData.description}
                      className="flex-1 btn-green px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createJobMutation.isPending ? "Creating..." : "Create Job"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
