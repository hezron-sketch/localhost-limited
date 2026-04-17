import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface JobFormProps {
  onClose: () => void;
  editingId: number | null;
  onEditingChange: (id: number | null) => void;
  onSuccess?: () => void;
}

export default function JobForm({ onClose, editingId, onEditingChange, onSuccess }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    salaryRange: "",
    jobType: "full-time" as const,
    requirements: "",
    benefits: "",
    imageUrl: "",
  });

  const createJobMutation = trpc.cms.jobs.create.useMutation();
  const isLoading = createJobMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.department || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createJobMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        department: formData.department,
        location: formData.location,
        salaryRange: formData.salaryRange || "",
        jobType: formData.jobType,
        requirements: formData.requirements || "",
        benefits: formData.benefits || "",
      });
      
      toast.success("Job opening created successfully!");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Failed to create job opening. Please try again.");
    }
  };

  return (
    <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-bold">New Job Opening</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/80 text-sm block mb-2">Job Title *</label>
            <Input
              placeholder="e.g., Senior Marketing Manager"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-[#0D1B2A] border-white/10 text-white"
              required
            />
          </div>
          <div>
            <label className="text-white/80 text-sm block mb-2">Department *</label>
            <Input
              placeholder="e.g., Marketing"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="bg-[#0D1B2A] border-white/10 text-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/80 text-sm block mb-2">Location *</label>
            <Input
              placeholder="e.g., Nairobi, Kenya"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-[#0D1B2A] border-white/10 text-white"
              required
            />
          </div>
          <div>
            <label className="text-white/80 text-sm block mb-2">Job Type *</label>
            <Select value={formData.jobType} onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}>
              <SelectTrigger className="bg-[#0D1B2A] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0A1628] border-white/10">
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-white/80 text-sm block mb-2">Description *</label>
          <Textarea
            placeholder="Job description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-[#0D1B2A] border-white/10 text-white min-h-24"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/80 text-sm block mb-2">Salary Range</label>
            <Input
              placeholder="e.g., $50,000 - $80,000"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              className="bg-[#0D1B2A] border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-white/80 text-sm block mb-2">Image URL</label>
            <Input
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="bg-[#0D1B2A] border-white/10 text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-white/80 text-sm block mb-2">Requirements</label>
          <Textarea
            placeholder="Required skills and experience..."
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="bg-[#0D1B2A] border-white/10 text-white min-h-20"
          />
        </div>

        <div>
          <label className="text-white/80 text-sm block mb-2">Benefits</label>
          <Textarea
            placeholder="Job benefits and perks..."
            value={formData.benefits}
            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            className="bg-[#0D1B2A] border-white/10 text-white min-h-20"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="bg-[#22C55E] hover:bg-[#16A34A] text-black" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Job Opening"
            )}
          </Button>
          <Button type="button" onClick={onClose} variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
