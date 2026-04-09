/**
 * Admin Dashboard — Contact Form Submissions Management
 * Features:
 * - View all contact submissions with pagination
 * - Filter by status (new, reviewed, replied, archived)
 * - Sort by date, name, email
 * - Update submission status
 * - Delete submissions with confirmation
 * - View submission details in modal
 * - Real-time statistics
 */

import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  Mail,
  MessageSquare,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Archive,
  Clock,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type SubmissionStatus = "new" | "reviewed" | "replied" | "archived";

const STATUS_COLORS: Record<SubmissionStatus, { bg: string; text: string; icon: any }> = {
  new: { bg: "bg-blue-500/15", text: "text-blue-400", icon: AlertCircle },
  reviewed: { bg: "bg-yellow-500/15", text: "text-yellow-400", icon: Eye },
  replied: { bg: "bg-green-500/15", text: "text-green-400", icon: CheckCircle2 },
  archived: { bg: "bg-gray-500/15", text: "text-gray-400", icon: Archive },
};

interface SubmissionDetail {
  id: number;
  name: string;
  email: string;
  message: string;
  status: SubmissionStatus;
  submittedAt: Date;
  updatedAt: Date;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | undefined>();
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Fetch submissions
  const { data: submissionsData, isLoading: isLoadingSubmissions, refetch: refetchSubmissions } = trpc.contact.list.useQuery(
    {
      limit: ITEMS_PER_PAGE,
      offset,
      status: statusFilter,
    },
    { enabled: !!user && user.role === "admin" }
  );

  // Fetch stats
  const { data: stats, isLoading: isLoadingStats } = trpc.contact.stats.useQuery(
    undefined,
    { enabled: !!user && user.role === "admin" }
  );

  // Fetch single submission
  const { data: detailData, isLoading: isLoadingDetail } = trpc.contact.get.useQuery(
    { id: selectedSubmission?.id || 0 },
    { enabled: !!selectedSubmission && !!user && user.role === "admin" }
  );

  // Update status mutation
  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetchSubmissions();
      if (selectedSubmission) {
        setSelectedSubmission(null);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  // Delete mutation
  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      toast.success("Submission deleted successfully");
      setShowDeleteConfirm(null);
      refetchSubmissions();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete submission");
    },
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#22C55E]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const submissions = submissionsData?.submissions || [];
  const total = submissionsData?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const sortedSubmissions = useMemo(() => {
    const sorted = [...submissions];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [submissions, sortBy]);

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D1B2A] to-[#0F2035] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                Contact Submissions
              </h1>
              <p className="text-white/50 text-sm mt-1">Manage all contact form submissions</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Site
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total", value: stats?.total || 0, icon: Users, color: "text-blue-400" },
            { label: "New", value: stats?.new || 0, icon: AlertCircle, color: "text-blue-400" },
            { label: "Reviewed", value: stats?.reviewed || 0, icon: Eye, color: "text-yellow-400" },
            { label: "Replied", value: stats?.replied || 0, icon: CheckCircle2, color: "text-green-400" },
            { label: "Archived", value: stats?.archived || 0, icon: Archive, color: "text-gray-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{isLoadingStats ? "..." : stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/50" />
            <span className="text-white/70 text-sm">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: undefined, label: "All" },
              { value: "new" as SubmissionStatus, label: "New" },
              { value: "reviewed" as SubmissionStatus, label: "Reviewed" },
              { value: "replied" as SubmissionStatus, label: "Replied" },
              { value: "archived" as SubmissionStatus, label: "Archived" },
            ].map((filter) => (
              <button
                key={filter.label}
                onClick={() => {
                  setStatusFilter(filter.value);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? "bg-[#22C55E] text-[#0D1B2A]"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-white/70 text-sm">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "name")}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/40"
          >
            <option value="date">Date (Newest)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Submissions Table */}
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          {isLoadingSubmissions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#22C55E]" />
            </div>
          ) : sortedSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <MessageSquare className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-white/50">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sortedSubmissions.map((submission) => {
                    const statusColor = STATUS_COLORS[submission.status];
                    const StatusIcon = statusColor.icon;
                    return (
                      <tr key={submission.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-white font-medium">{submission.name}</td>
                        <td className="px-6 py-4 text-sm text-white/70">{submission.email}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.bg}`}>
                            <StatusIcon className={`w-4 h-4 ${statusColor.text}`} />
                            <span className={`text-xs font-semibold ${statusColor.text} capitalize`}>
                              {submission.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/50">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedSubmission(submission)}
                              className="p-2 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(submission.id)}
                              className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-white/50 text-sm">
              Showing {offset + 1} to {Math.min(offset + ITEMS_PER_PAGE, total)} of {total} submissions
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#22C55E] text-[#0D1B2A]"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F2035] border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0F2035] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                Submission Details
              </h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                  <p className="text-white">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-[#22C55E] hover:underline">
                    {selectedSubmission.email}
                  </a>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/80 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Status & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${STATUS_COLORS[selectedSubmission.status].bg}`}>
                    {(() => {
                      const Icon = STATUS_COLORS[selectedSubmission.status].icon;
                      return <Icon className={`w-4 h-4 ${STATUS_COLORS[selectedSubmission.status].text}`} />;
                    })()}
                    <span className={`text-xs font-semibold ${STATUS_COLORS[selectedSubmission.status].text} capitalize`}>
                      {selectedSubmission.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Submitted</label>
                  <p className="text-white/80">{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Updated</label>
                  <p className="text-white/80">{new Date(selectedSubmission.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Update Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["new", "reviewed", "replied", "archived"] as SubmissionStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: selectedSubmission.id,
                          status,
                        })
                      }
                      disabled={updateStatusMutation.isPending || selectedSubmission.status === status}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        selectedSubmission.status === status
                          ? "bg-[#22C55E] text-[#0D1B2A]"
                          : "bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-50"
                      }`}
                    >
                      {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(selectedSubmission.id);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F2035] border border-white/10 rounded-lg max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Delete Submission?
                </h3>
              </div>
              <p className="text-white/70 mb-6">
                This action cannot be undone. The submission will be permanently deleted from the database.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteMutation.mutate({ id: showDeleteConfirm });
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
