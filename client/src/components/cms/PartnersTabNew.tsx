import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import PartnerForm from "./PartnerForm";

export default function PartnersTabNew() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const { data: partnersData, isLoading, refetch } = trpc.cms.partners.list.useQuery({
    limit: 100,
    offset: 0,
  });
  const deleteMutation = trpc.cms.partners.delete.useMutation();

  const partners = partnersData?.partners || [];
  const filteredPartners = filterType === "all" ? partners : partners.filter((p) => p.partnerType === filterType);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Partner deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Failed to delete partner");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#22C55E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-black">Manage Partners</h2>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-black font-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {showForm && (
        <PartnerForm
          onClose={() => setShowForm(false)}
          editingId={editingId}
          onEditingChange={setEditingId}
          onSuccess={() => refetch()}
        />
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["all", "corporate", "startup", "agency", "other"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded font-bold capitalize transition-all ${
              filterType === type
                ? "bg-[#22C55E] text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {type === "all" ? "All Partners" : type}
          </button>
        ))}
      </div>

      {/* Partners Grid */}
      {filteredPartners.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60">No partners found. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-[#0A1628] border border-white/10 rounded-lg p-4 hover:border-[#22C55E]/50 transition-all"
            >
              {partner.logoUrl && (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-full h-24 object-contain mb-3 rounded"
                />
              )}
              <h3 className="text-white font-black text-lg mb-1">{partner.name}</h3>
              <p className="text-[#22C55E] text-xs font-bold mb-2 capitalize">{partner.partnerType}</p>
              {partner.description && (
                <p className="text-white/60 text-sm mb-3 line-clamp-2">{partner.description}</p>
              )}
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#22C55E] text-xs font-bold hover:underline mb-3 block"
                >
                  Visit Website
                </a>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditingId(partner.id);
                    setShowForm(true);
                  }}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(partner.id)}
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
