/**
 * Job Detail Page — Localhost Limited
 * Display full job details and application form
 */

import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { MapPin, Briefcase, DollarSign, Calendar, ChevronLeft, Upload, AlertCircle, CheckCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { trpc } from "@/lib/trpc";

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const [, navigate] = useLocation();
  const jobId = params?.id ? parseInt(params.id) : null;

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  // Fetch job details
  const { data: jobsData, isLoading } = trpc.cms.jobs.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const jobs = (jobsData?.jobs || []) as any[];
  const job = jobs.find((j: any) => j.id === jobId) as any;

  // Apply for job mutation
  const applyMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitStatus("success");
      setSubmitMessage("Application submitted successfully! We'll review it and get back to you soon.");
      setFormData({ fullName: "", email: "", phone: "", coverLetter: "" });
      setCvFile(null);
      setErrors({});
      setTimeout(() => {
        setShowApplicationForm(false);
        setSubmitStatus("idle");
      }, 3000);
    },
    onError: (error: any) => {
      setSubmitStatus("error");
      setSubmitMessage(error.message || "Failed to submit application. Please try again.");
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!cvFile) newErrors.cv = "CV upload is required";
    else if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(cvFile.type)) {
      newErrors.cv = "Only PDF or DOC files are allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !jobId || !cvFile) return;

    setSubmitting(true);

    try {
      // Upload CV to storage
      const cvFormData = new FormData();
      cvFormData.append("file", cvFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: cvFormData,
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload CV");

      const { url: cvUrl } = await uploadResponse.json();

      // Submit application
      await applyMutation.mutateAsync({
        name: formData.fullName,
        email: formData.email,
        message: `Job Application for: ${job.title}\n\nPhone: ${formData.phone}\nCV: ${cvUrl}\n\nCover Letter:\n${formData.coverLetter || 'N/A'}`,
      });
    } catch (error: any) {
      setSubmitStatus("error");
      setSubmitMessage(error.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <PageLayout title="Loading..." description="">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#22C55E]" />
            <p className="text-white/60 mt-4">Loading job details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout title="Job Not Found" description="">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white mb-4">Job Not Found</h1>
            <p className="text-white/60 mb-8">The job you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate("/jobs")}
              className="btn-green inline-flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Jobs
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={job.title}
      description={`${job.title} at Localhost Limited - ${job.location}`}
    >
      {/* ─── Header ─── */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#0D1B2A] to-[#060E1A]">
        <div className="container mx-auto">
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-2 text-[#22C55E] hover:text-[#16a34a] transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Jobs
          </button>

          <AnimatedSection>
            {job && (
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1
                    className="text-4xl md:text-5xl font-extrabold text-white mb-3"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {job.title}
                  </h1>
                  <p className="text-[#22C55E] text-lg font-semibold">{job.department}</p>
                </div>
                <span className="px-4 py-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-medium">
                  {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                </span>
              </div>
            )}

            {job && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6 border-y border-white/10">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                  <div>
                    <p className="text-white/60 text-sm">Location</p>
                    <p className="text-white font-medium">{job.location}</p>
                  </div>
                </div>
                {job.salaryRange && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                    <div>
                      <p className="text-white/60 text-sm">Salary</p>
                      <p className="text-white font-medium">{job.salaryRange}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                  <div>
                    <p className="text-white/60 text-sm">Job Type</p>
                    <p className="text-white font-medium">{job.jobType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                  <div>
                    <p className="text-white/60 text-sm">Posted</p>
                    <p className="text-white font-medium">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Job Details ─── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
            {job && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <AnimatedSection>
                    {/* Description */}
                    {job.description && (
                      <div className="mb-12">
                        <h2 className="text-2xl font-extrabold text-white mb-4">About the Role</h2>
                        <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                      </div>
                    )}

                    {/* Requirements */}
                    {job.requirements && (
                      <div className="mb-12">
                        <h2 className="text-2xl font-extrabold text-white mb-4">Requirements</h2>
                        <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                      </div>
                    )}

                    {/* Benefits */}
                    {job.benefits && (
                      <div className="mb-12">
                        <h2 className="text-2xl font-extrabold text-white mb-4">Benefits</h2>
                        <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{job.benefits}</p>
                      </div>
                    )}
                  </AnimatedSection>
                </div>

                {/* Sidebar - Apply Button */}
                <div className="lg:col-span-1">
                  <AnimatedSection>
                    <div className="sticky top-32 p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <button
                        onClick={() => setShowApplicationForm(!showApplicationForm)}
                        className="w-full btn-green py-3 mb-4"
                      >
                        Apply Now
                      </button>
                      <p className="text-white/60 text-sm text-center">
                        Submit your CV and cover letter to apply for this position.
                      </p>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            )}
        </div>
      </section>

      {/* ─── Application Form Modal ─── */}
      {showApplicationForm && (
        <section className="py-20 md:py-28 bg-[#060E1A]">
          <div className="container mx-auto max-w-2xl">
            <AnimatedSection>
              <div className="p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <h2 className="text-2xl font-extrabold text-white mb-6">Apply for this Position</h2>

                {submitStatus === "success" && (
                  <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-400 font-medium">Success!</p>
                      <p className="text-green-400/80 text-sm">{submitMessage}</p>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium">Error</p>
                      <p className="text-red-400/80 text-sm">{submitMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all"
                      placeholder="Your full name"
                    />
                    {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all"
                      placeholder="+255 XXX XXX XXX"
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Upload CV (PDF or DOC) *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="block p-4 rounded-lg bg-white/5 border-2 border-dashed border-white/10 hover:border-[#22C55E]/30 cursor-pointer transition-all text-center"
                      >
                        <Upload className="w-6 h-6 text-white/40 mx-auto mb-2" />
                        <p className="text-white/70 text-sm">
                          {cvFile ? cvFile.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-white/40 text-xs mt-1">PDF or DOC (max 10MB)</p>
                      </label>
                    </div>
                    {errors.cv && <p className="text-red-400 text-sm mt-1">{errors.cv}</p>}
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all resize-none"
                      placeholder="Tell us why you're interested in this role..."
                      rows={5}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 btn-green py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
