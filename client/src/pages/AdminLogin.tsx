/**
 * Admin Login Page
 * Google OAuth login for admin access
 */

import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Loader2, Lock, LogIn } from "lucide-react";

export default function AdminLogin() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // If already logged in, redirect to admin panel
  useEffect(() => {
    if (!loading && user) {
      navigate("/admin/panel");
    }
  }, [user, loading, navigate]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#0F2035] to-[#0D1B2A] flex items-center justify-center px-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#22C55E]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/30">
                <Lock className="w-6 h-6 text-[#22C55E]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              Admin Access
            </h1>
            <p className="text-white/60 text-sm">
              Sign in to manage contact submissions
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-3" />
              <p className="text-white/60 text-sm">Checking authentication...</p>
            </div>
          ) : (
            <>
              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  <strong>Note:</strong> After logging in, you'll need admin role to access the dashboard. Contact your site administrator if you need access.
                </p>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="w-full px-6 py-3 rounded-lg bg-[#22C55E] text-[#0D1B2A] font-bold text-lg hover:bg-[#1ea850] transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:shadow-[#22C55E]/20"
              >
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Sign In with Google
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-white/40 text-xs uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Info Text */}
              <div className="space-y-3 text-sm text-white/60">
                <p>
                  <strong className="text-white">First time?</strong> Sign in with your Google account to get started.
                </p>
                <p>
                  <strong className="text-white">Already have an account?</strong> Sign in above to access the admin dashboard.
                </p>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/40 text-xs">
              Protected by Google OAuth • Your data is secure
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-center text-white/50 text-sm">
          <p>
            <a href="/" className="text-[#22C55E] hover:underline">
              ← Back to Website
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
