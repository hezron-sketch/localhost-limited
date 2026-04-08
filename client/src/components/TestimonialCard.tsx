/**
 * TestimonialCard Component — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * - Dark glass card with subtle border
 * - Star rating in green
 * - Avatar placeholder with initials
 * - Quote mark decoration
 */

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating?: number;
  avatarInitials?: string;
}

export default function TestimonialCard({
  quote,
  name,
  role,
  company,
  rating = 5,
  avatarInitials,
}: TestimonialCardProps) {
  const initials = avatarInitials || name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <article
      className="group relative rounded-xl p-6 bg-[#0F2035] border border-white/8 hover:border-[#22C55E]/30 hover:shadow-[0_4px_30px_rgba(34,197,94,0.08)] transition-all duration-300"
      aria-label={`Testimonial from ${name}`}
    >
      {/* Quote decoration */}
      <div
        className="absolute top-4 right-5 text-6xl leading-none text-[#22C55E]/10 font-serif select-none"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-4" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-[#22C55E]" : "text-white/20"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote Text */}
      <blockquote className="text-white/70 text-sm leading-relaxed mb-6 relative z-10">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22C55E]/30 to-[#4ADE80]/20 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] text-xs font-bold shrink-0"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>
            {name}
          </p>
          <p className="text-white/45 text-xs">
            {role}, <span className="text-[#22C55E]/80">{company}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
