/**
 * HR Dashboard — Localhost Limited
 * Manage job postings and applications
 * Protected route - requires admin authentication
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Briefcase, Users, FileText, CheckCircle, Clock, XCircle, Download, ChevronLeft, Plus, Edit2, Trash2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { trpc } from "@/lib/trpc";

type Tab = "overview" | "jobs" | "applications";
type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

export default function HRDashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Fetch data
  const { data: jobsData } = trpc.cms.jobs.list.useQuery({ limit: 100, offset: 0 });
  const jobs = jobsData?.jobs || [];

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
                  <p className="text-3xl font-extrabold text-white">0</p>
                  <p className="text-white/60 text-sm mt-2">Pending review</p>
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
                  <button className="btn-green inline-flex items-center gap-2 px-4 py-2">
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
                            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === "active"
                              ? "bg-green-500/10 text-green-400 border border-green-500/30"
                              : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                          }`}>
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
                    <p className="text-white/60">No applications yet. Create job postings to receive applications.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job: any) => (
                      <div
                        key={job.id}
                        className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                      >
                        <h3 className="text-lg font-extrabold text-white mb-4">{job.title}</h3>
                        <div className="text-center py-8 text-white/60">
                          <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                          <p>No applications for this position yet</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  );
}
