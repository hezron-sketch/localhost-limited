import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ServicesTab() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const { data: services, isLoading, refetch } = trpc.cms.services.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const createMutation = trpc.cms.services.create.useMutation({
    onSuccess: () => {
      toast.success("Service created successfully");
      setShowForm(false);
      setFormData({ title: "", description: "" });
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create service");
    },
  });

  const deleteMutation = trpc.cms.services.delete.useMutation({
    onSuccess: () => {
      toast.success("Service deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete service");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: "content",
    } as any);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Marketing Services</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-black gap-2"
        >
          <Plus className="w-4 h-4" />
          New Service
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mx-auto" />
          <p className="text-white/60 mt-2">Loading services...</p>
        </div>
      ) : !services?.services || services.services.length === 0 ? (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-8 text-center">
          <p className="text-white/60">No services yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.services.map((service: any) => (
            <div
              key={service.id}
              className="bg-[#0A1628] border border-white/10 rounded-lg p-6 hover:border-[#22C55E]/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{service.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => deleteMutation.mutate({ id: service.id })}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6">
          <h3 className="text-white font-bold text-lg mb-4">Create New Service</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Service Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Brand Activation"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Service description..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 min-h-24"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-black"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Service"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
