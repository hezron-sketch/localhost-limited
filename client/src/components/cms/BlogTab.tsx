import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BlogTab() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Blog Posts</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#22C55E] hover:bg-[#16A34A] text-black gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6">
        <p className="text-white/60">Blog posts will appear here</p>
      </div>
    </div>
  );
}
