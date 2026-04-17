import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function GalleryTab() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);

  const { data: galleryData, isLoading, refetch } = trpc.cms.gallery.list.useQuery({
    section: "other",
  });
  const gallery = galleryData?.images || [];

  const createMutation = trpc.cms.gallery.create.useMutation({
    onSuccess: () => {
      toast.success("Gallery item created successfully");
      setShowForm(false);
      setFormData({ title: "", description: "", imageUrl: "" });
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create gallery item");
    },
  });

  const deleteMutation = trpc.cms.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Gallery item deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete gallery item");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await response.json();
      if (data.url) {
        setFormData({ ...formData, imageUrl: data.url });
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate(formData as any);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ title: "", description: "", imageUrl: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Gallery</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-black gap-2"
        >
          <Plus className="w-4 h-4" />
          New Item
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mx-auto" />
          <p className="text-white/60 mt-2">Loading gallery...</p>
        </div>
      ) : !gallery || gallery.length === 0 ? (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-8 text-center">
          <p className="text-white/60">No gallery items yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((item: any) => (
            <div
              key={item.id}
              className="bg-[#0A1628] border border-white/10 rounded-lg overflow-hidden hover:border-[#22C55E]/30 transition-colors group"
            >
              <div className="relative h-48 overflow-hidden bg-white/5">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-white/60 text-xs line-clamp-2 mb-3">{item.description}</p>
                )}
                <Button
                  onClick={() => deleteMutation.mutate({ id: item.id })}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6">
          <h3 className="text-white font-bold text-lg mb-4">Add Gallery Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Image</label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#22C55E]/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">Click to upload image</p>
                </label>
              </div>
              {formData.imageUrl && (
                <div className="mt-4">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Item title"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Item description..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 min-h-20"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" onClick={handleCancel} variant="outline">Cancel</Button>
              <Button type="submit" className="bg-[#22C55E] hover:bg-[#16A34A] text-black" disabled={createMutation.isPending || uploading}>
                {createMutation.isPending || uploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : "Save Item"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
