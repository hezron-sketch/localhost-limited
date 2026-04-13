import { trpc } from "@/lib/trpc";
import { Loader2, ExternalLink } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface PartnerGridProps {
  filterType?: string;
}

export default function PartnerGrid({ filterType = "all" }: PartnerGridProps) {
  const { data: partnersData, isLoading } = trpc.cms.partners.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const partners = partnersData?.partners || [];
  const filteredPartners = filterType === "all" ? partners : partners.filter((p) => p.partnerType === filterType);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#22C55E]" />
      </div>
    );
  }

  if (filteredPartners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">No partners available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredPartners.map((partner, index) => (
        <ScrollReveal key={partner.id} delay={index * 50}>
          <a
            href={partner.website || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="bg-gradient-to-br from-[#0A1628] to-[#0F2035] border-2 border-white/10 rounded-lg p-6 hover:border-[#22C55E]/50 transition-all hover:shadow-lg hover:shadow-[#22C55E]/20 h-full flex flex-col items-center justify-center gap-4">
              {partner.logoUrl && (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                />
              )}
              <div className="text-center">
                <h3 className="text-white font-black text-sm mb-1 line-clamp-2">{partner.name}</h3>
                <p className="text-[#22C55E] text-xs font-bold capitalize">{partner.partnerType}</p>
              </div>
              {partner.description && (
                <p className="text-white/60 text-xs text-center line-clamp-2">{partner.description}</p>
              )}
              {partner.website && (
                <div className="flex items-center gap-1 text-[#22C55E] text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit
                  <ExternalLink className="w-3 h-3" />
                </div>
              )}
            </div>
          </a>
        </ScrollReveal>
      ))}
    </div>
  );
}
