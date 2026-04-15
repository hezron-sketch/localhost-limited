import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, useRoute } from "wouter";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import JobsTab from "@/components/cms/JobsTab";
import ServicesTab from "@/components/cms/ServicesTab";
import BlogTab from "@/components/cms/BlogTab";
import PartnersTab from "@/components/cms/PartnersTab";
import GalleryTab from "@/components/cms/GalleryTab";

export default function CMSDashboard() {
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("jobs");

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/admin/login", { replace: true });
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      {/* Header */}
      <header className="bg-[#0A1628] border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663530145352/A7XjKD5uiUvbbu4scddhrb/logo_482f18a6.png"
              alt="Localhost Limited"
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-white font-bold text-xl">CMS Dashboard</h1>
              <p className="text-white/60 text-sm">Manage all content</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-white/60 text-xs">{user.email}</p>
            </div>
            <Button
              onClick={() => {
                logout();
                navigate("/", { replace: true });
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[#0A1628] border border-white/10">
            <TabsTrigger value="jobs" className="text-white data-[state=active]:text-[#22C55E]">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="services" className="text-white data-[state=active]:text-[#22C55E]">
              Services
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-white data-[state=active]:text-[#22C55E]">
              Blog
            </TabsTrigger>
            <TabsTrigger value="partners" className="text-white data-[state=active]:text-[#22C55E]">
              Partners
            </TabsTrigger>
            <TabsTrigger value="gallery" className="text-white data-[state=active]:text-[#22C55E]">
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-6">
            <JobsTab />
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <ServicesTab />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <BlogTab />
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            <PartnersTab />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <GalleryTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
