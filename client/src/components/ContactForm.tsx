/**
 * ContactForm Component — Localhost Limited
 * Design: Premium B2B SaaS / Refined Dark Corporate
 * - Dark glass card form
 * - Green focus states and submit button
 * - Form validation with error states
 * - Success state with animation
 */

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClass = (hasError?: string) =>
    `w-full rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 bg-[#0D1B2A] border transition-all duration-200 outline-none focus:ring-2 focus:ring-[#22C55E]/40 ${
      hasError
        ? "border-red-500/60 focus:border-red-500"
        : "border-white/10 focus:border-[#22C55E]/60 hover:border-white/20"
    }`;

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <CheckCircle className="w-8 h-8 text-[#22C55E]" />
        </div>
        <h3 className="text-white text-xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
          Message Sent!
        </h3>
        <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-xs">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="btn-outline-green text-sm px-5 py-2.5"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className="space-y-5"
    >
      {/* Name + Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
            Full Name <span className="text-[#22C55E]" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={inputClass(errors.name)}
            aria-required="true"
            aria-describedby={errors.name ? "name-error" : undefined}
            autoComplete="name"
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-400" role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
            Email Address <span className="text-[#22C55E]" aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
            className={inputClass(errors.email)}
            aria-required="true"
            aria-describedby={errors.email ? "email-error" : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-400" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-2">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`${inputClass()} appearance-none`}
          aria-label="Select a subject"
        >
          <option value="" className="bg-[#0D1B2A]">Select a subject...</option>
          <option value="marketing" className="bg-[#0D1B2A]">Marketing Services</option>
          <option value="hr" className="bg-[#0D1B2A]">HR & Talent Sourcing</option>
          <option value="partnerships" className="bg-[#0D1B2A]">Partnership Inquiry</option>
          <option value="general" className="bg-[#0D1B2A]">General Inquiry</option>
          <option value="other" className="bg-[#0D1B2A]">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">
          Message <span className="text-[#22C55E]" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your project or inquiry..."
          rows={5}
          className={`${inputClass(errors.message)} resize-none`}
          aria-required="true"
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-400" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-green w-full py-3.5 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        aria-label={isSubmitting ? "Sending message..." : "Send message"}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
