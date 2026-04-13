import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import JobForm from "./JobForm";

export default function JobsTab() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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

      {showForm && <JobForm onClose={() => setShowForm(false)} editingId={editingId} onEditingChange={setEditingId} />}

      <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6">
        <p className="text-white/60">Job listings will appear here</p>
      </div>
    </div>
  );
}
