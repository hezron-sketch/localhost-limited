import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface PartnerFormProps {
  onClose: () => void;
  editingId: number | null;
  onEditingChange: (id: number | null) => void;
  onSuccess: () => void;
}

export default function PartnerForm({ onClose, editingId, onEditingChange, onSuccess }: PartnerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    partnerType: "corporate" as const,
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const createMutation = trpc.cms.partners.create.useMutation();
  const updateMutation = trpc.cms.partners.update.useMutation();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogoToS3 = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Logo upload error:", error);
      throw new Error("Failed to upload logo");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Partner name is required");
      return;
    }

    setIsUploading(true);

    try {
      let logoUrl = formData.logoUrl;

      if (logoFile) {
        logoUrl = await uploadLogoToS3(logoFile);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        partnerType: formData.partnerType,
        logoUrl,
      };

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
        toast.success("Partner updated successfully!");
        onEditingChange(null);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Partner added successfully!");
      }

      setFormData({ name: "", description: "", website: "", partnerType: "corporate", logoUrl: "" });
      setLogoFile(null);
      setLogoPreview("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting partner:", error);
      toast.error("Failed to save partner");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0A1628] border border-white/10 rounded-lg p-6 space-y-4 mb-6">
      <h3 className="text-white font-black text-lg">
        {editingId ? "Edit Partner" : "Add New Partner"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Partner Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-[#0F2035] border border-white/10 rounded px-3 py-2 text-white placeholder-white/40"
        />

        <select
          value={formData.partnerType}
          onChange={(e) => setFormData({ ...formData, partnerType: e.target.value as any })}
          className="bg-[#0F2035] border border-white/10 rounded px-3 py-2 text-white"
        >
          <option value="corporate">Corporate</option>
          <option value="startup">Startup</option>
          <option value="agency">Agency</option>
          <option value="other">Other</option>
        </select>
      </div>

      <input
        type="url"
        placeholder="Website URL"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        className="w-full bg-[#0F2035] border border-white/10 rounded px-3 py-2 text-white placeholder-white/40"
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full bg-[#0F2035] border border-white/10 rounded px-3 py-2 text-white placeholder-white/40 h-20 resize-none"
      />

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="text-white text-sm font-bold">Partner Logo</label>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-[#22C55E]/50 transition-colors">
          {logoPreview ? (
            <div className="relative inline-block">
              <img src={logoPreview} alt="Logo preview" className="h-20 object-contain" />
              <button
                type="button"
                onClick={() => {
                  setLogoPreview("");
                  setLogoFile(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-[#22C55E]" />
                <span className="text-white text-sm">Click to upload logo</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={isUploading || createMutation.isPending || updateMutation.isPending}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-black font-black flex-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            editingId ? "Update Partner" : "Add Partner"
          )}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
