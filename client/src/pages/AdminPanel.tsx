/**
 * Admin Panel — User Management & Submissions Dashboard
 * Features:
 * - View current user info
 * - Promote/demote users to admin
 * - View all users
 * - Access submissions dashboard
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  Users,
  Shield,
  LogOut,
  Settings,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, loading: authLoading, logout } = useAuth();
  const [, navigate] = useLocation();
  const [showUserList, setShowUserList] = useState(false);

  // Use useEffect to handle navigation when user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#22C55E]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D1B2A] to-[#0F2035] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                Admin Panel
              </h1>
              <p className="text-white/50 text-sm mt-1">Manage your account and access admin features</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current User Card */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Your Account
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-white/50 text-sm">Email</label>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-white/50 text-sm">Name</label>
                  <p className="text-white font-medium">{user.name || "Not set"}</p>
                </div>
                <div>
                  <label className="text-white/50 text-sm">Role</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                      user.role === "admin"
                        ? "bg-[#22C55E]/20 border border-[#22C55E]/30"
                        : "bg-blue-500/20 border border-blue-500/30"
                    }`}>
                      <Shield className={`w-4 h-4 ${
                        user.role === "admin" ? "text-[#22C55E]" : "text-blue-400"
                      }`} />
                      <span className={`text-sm font-semibold capitalize ${
                        user.role === "admin" ? "text-[#22C55E]" : "text-blue-400"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {user.role === "admin" && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span className="text-xs font-semibold text-[#22C55E]">Admin Access</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Submissions Dashboard */}
          <button
            onClick={() => navigate("/admin/submissions")}
            className="group bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-[#22C55E]/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Submissions Dashboard
                </h3>
                <p className="text-white/60 text-sm">
                  View and manage all contact form submissions
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#22C55E] group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* User Management */}
          <button
            onClick={() => setShowUserList(!showUserList)}
            className="group bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  User Management
                </h3>
                <p className="text-white/60 text-sm">
                  Manage user roles and permissions
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>

        {/* User Management Section */}
        {showUserList && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              User Management
            </h2>

            {user.role === "admin" ? (
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-300 text-sm">
                        <strong>Admin Features Coming Soon:</strong> You'll be able to view all users and manage their roles from this panel. For now, please contact your site administrator or use the database UI to manage user roles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Current User</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">{user.name || user.email}</p>
                      <p className="text-white/50 text-sm">{user.email}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30">
                      <span className="text-xs font-semibold text-[#22C55E]">Admin</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 text-sm">
                      <strong>Limited Access:</strong> You don't have admin permissions yet. Contact your site administrator to request admin access.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            Getting Started
          </h3>
          <div className="space-y-2 text-white/70 text-sm">
            <p>✓ You're logged in as <strong>{user.email}</strong></p>
            {user.role === "admin" ? (
              <>
                <p>✓ You have admin access to manage submissions</p>
                <p>✓ Click "Submissions Dashboard" to view and manage contact forms</p>
              </>
            ) : (
              <>
                <p>✗ You don't have admin permissions yet</p>
                <p>→ Contact your site administrator to request admin access</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
