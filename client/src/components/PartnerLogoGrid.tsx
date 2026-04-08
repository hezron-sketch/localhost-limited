/**
 * PartnerLogoGrid Component — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * - Grid of partner logo placeholders
 * - Hover: green tint + border glow
 * - Responsive grid layout
 */

interface Partner {
  name: string;
  initials: string;
  category?: string;
}

interface PartnerLogoGridProps {
  partners: Partner[];
  className?: string;
}

export default function PartnerLogoGrid({ partners, className = "" }: PartnerLogoGridProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className}`}
      role="list"
      aria-label="Partner logos"
    >
      {partners.map((partner, i) => (
        <div
          key={i}
          role="listitem"
          aria-label={`Partner: ${partner.name}`}
          className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/40 hover:bg-[#22C55E]/5 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all duration-300 cursor-default aspect-square"
        >
          {/* Logo placeholder */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#22C55E]/20 to-[#4ADE80]/10 border border-[#22C55E]/20 flex items-center justify-center mb-2 group-hover:shadow-[0_0_12px_rgba(34,197,94,0.2)] transition-all duration-300">
            <span className="text-[#22C55E] text-xs font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
              {partner.initials}
            </span>
          </div>
          <p className="text-white/50 text-xs text-center leading-tight group-hover:text-white/80 transition-colors duration-200">
            {partner.name}
          </p>
          {partner.category && (
            <p className="text-[#22C55E]/50 text-[10px] text-center mt-0.5">
              {partner.category}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
