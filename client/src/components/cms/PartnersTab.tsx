import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PartnersTab() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
  });

  const { data: partners, isLoading, refetch } = trpc.cms.partners.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const createMutation = trpc.cms.partners.create.useMutation({
    onSuccess: () => {
      toast.success("Partner created successfully");
      setShowForm(false);
      setFormData({ name: "", description: "", type: "" });
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create partner");
    },
  });

  const deleteMutation = trpc.cms.partners.delete.useMutation({
    onSuccess: () => {
      toast.success("Partner deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete partner");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate(formData as any);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: "", description: "", type: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Partners</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-black gap-2"
        >
          <Plus className="w-4 h-4" />
          New Partner
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mx-auto" />
          <p className="text-white/60 mt-2">Loading partners...</p>
        </div>
      ) : !partners?.partners || partners.partners.length === 0 ? (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-8 text-center">
          <p className="text-white/60">No partners yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {partners.partners.map((partner: any) => (
            <div
              key={partner.id}
              className="bg-[#0A1628] border border-white/10 rounded-lg p-6 hover:border-[#22C55E]/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{partner.name}</h3>
                  <p className="text-white/70 text-sm mb-3">{partner.description}</p>
                  {partner.type && (
                    <span className="inline-block px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-medium">
                      {partner.type}
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => deleteMutation.mutate({ id: partner.id })}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-400 hover:text-red-300 ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6">
          <h3 className="text-white font-bold text-lg mb-4">Add New Partner</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Partner Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Partner name"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Partner description..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 min-h-24"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Type (Optional)</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g., Retail, Corporate"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" onClick={handleCancel} variant="outline">Cancel</Button>
              <Button type="submit" className="bg-[#22C55E] hover:bg-[#16A34A] text-black" disabled={createMutation.isPending}>
                {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : "Save Partner"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
