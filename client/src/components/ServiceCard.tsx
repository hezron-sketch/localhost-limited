/**
 * ServiceCard Component — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * - Glass-morphism card with dark navy background
 * - Green top-border accent on hover
 * - Icon with green glow
 * - Smooth lift animation on hover
 */

import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits?: string[];
  variant?: "default" | "featured";
  className?: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  benefits = [],
  variant = "default",
  className = "",
}: ServiceCardProps) {
  return (
    <article
      className={`group relative rounded-xl p-6 transition-all duration-300 cursor-default
        bg-[#0F2035] border border-white/8
        hover:border-[#22C55E]/40 hover:shadow-[0_8px_40px_rgba(34,197,94,0.12)]
        hover:-translate-y-1
        ${variant === "featured" ? "ring-1 ring-[#22C55E]/30 shadow-[0_0_30px_rgba(34,197,94,0.08)]" : ""}
        ${className}`}
      aria-label={`Service: ${title}`}
    >
      {/* Top border glow on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-gradient-to-r from-transparent via-[#22C55E] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-5 group-hover:bg-[#22C55E]/15 group-hover:shadow-[0_0_16px_rgba(34,197,94,0.2)] transition-all duration-300">
        <Icon
          className="w-6 h-6 text-[#22C55E]"
          aria-hidden="true"
          strokeWidth={1.75}
        />
      </div>

      {/* Title */}
      <h3
        className="text-white font-semibold text-lg mb-3 group-hover:text-[#22C55E] transition-colors duration-300"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-white/55 text-sm leading-relaxed mb-4">
        {description}
      </p>

      {/* Benefits List */}
      {benefits.length > 0 && (
        <ul className="space-y-2" role="list" aria-label={`Benefits of ${title}`}>
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/65">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0 shadow-[0_0_4px_rgba(34,197,94,0.6)]"
                aria-hidden="true"
              />
              {benefit}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
