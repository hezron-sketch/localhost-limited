import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import JobForm from "./JobForm";

export default function JobsTab() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch jobs
  const { data: jobs, isLoading, refetch } = trpc.cms.jobs.list.useQuery({ limit: 100, offset: 0 });
  const deleteJobMutation = trpc.cms.jobs.delete.useMutation();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job opening?")) return;

    try {
      await deleteJobMutation.mutateAsync({ id });
      toast.success("Job opening deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job opening");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Job Openings</h2>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-black gap-2"
        >
          <Plus className="w-4 h-4" />
          New Job
        </Button>
      </div>

      {showForm && (
        <JobForm
          onClose={() => setShowForm(false)}
          editingId={editingId}
          onEditingChange={setEditingId}
          onSuccess={() => refetch()}
        />
      )}

      {isLoading ? (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-[#22C55E] mr-2" />
          <p className="text-white/60">Loading jobs...</p>
        </div>
      ) : jobs && jobs.jobs && jobs.jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.jobs.map((job: any) => (
            <div key={job.id} className="bg-[#0A1628] border border-white/10 rounded-lg p-4 hover:border-[#22C55E]/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{job.title}</h3>
                  <div className="flex gap-4 mt-2 text-white/60 text-sm">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="capitalize">{job.jobType}</span>
                  </div>
                  {job.salaryRange && <p className="text-[#22C55E] text-sm mt-1">{job.salaryRange}</p>}
                  <p className="text-white/70 text-sm mt-2 line-clamp-2">{job.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(job.id)}
                    disabled={deleteJobMutation.isPending}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6">
          <p className="text-white/60 text-center">No job openings yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
