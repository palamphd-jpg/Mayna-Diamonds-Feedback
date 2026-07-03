"use client";

import { useState, type FormEvent } from "react";

const STAFF_EXPERIENCE_OPTIONS = ["Pleasant", "Very Good", "Good", "Not Bad"];

interface FormData {
  rating: number;
  name: string;
  phone: string;
  staffExperience: string[];
  comments: string;
}

function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${
            star <= (hovered || rating) ? "active" : ""
          } ${hovered >= star ? "hover-active" : ""}`}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill={star <= (hovered || rating) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function PillButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-full border transition-all cursor-pointer ${
        selected
          ? "bg-gold text-white border-gold shadow-sm"
          : "bg-transparent text-foreground border-warm-border hover:border-gold hover:text-gold-dark"
      }`}
    >
      {label}
    </button>
  );
}

function DiamondIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold"
    >
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M2 9h20" />
      <path d="M12 22 6 3" />
      <path d="M12 22l6-19" />
      <path d="m10 3 2 6 2-6" />
    </svg>
  );
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="animate-fade-in-up text-center py-12 px-6">
      {/* Checkmark circle */}
      <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-success-bg flex items-center justify-center animate-check-pulse">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--success-text)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
        Thank You!
      </h2>
      <p className="text-warm-gray text-base md:text-lg mb-2 max-w-sm mx-auto">
        Your feedback means the world to us at Mayna Diamonds.
      </p>
      <p className="text-warm-gray text-sm mb-8">
        We&apos;ll use it to keep improving your experience.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gold-dark border border-warm-border rounded-lg hover:bg-gold-light/20 transition-colors cursor-pointer"
      >
        Submit Another Response
      </button>
    </div>
  );
}

export default function FeedbackPage() {
  const [form, setForm] = useState<FormData>({
    rating: 0,
    name: "",
    phone: "",
    staffExperience: [],
    comments: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(): boolean {
    const newErrors: Partial<Record<string, string>> = {};

    if (form.rating === 0) newErrors.rating = "Please rate your experience";
    if (!form.name.trim()) newErrors.name = "Please enter your name";
    if (!form.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: form.rating,
          name: form.name.trim(),
          phone: form.phone.trim(),
          staffExperience: form.staffExperience.join(", "),
          comments: form.comments.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit feedback.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to submit. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setForm({
      rating: 0,
      name: "",
      phone: "",
      staffExperience: [],
      comments: "",
    });
    setErrors({});
    setSubmitted(false);
    setSubmitError("");
  }

  function toggleArrayField(
    key: "staffExperience",
    value: string
  ) {
    setForm((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-14">
      {/* ─── Header ─── */}
      <header className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 mb-3">
          <DiamondIcon />
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground">
            Mayna Diamonds
          </h1>
          <DiamondIcon />
        </div>
        <div className="w-16 h-px bg-gold mx-auto mb-3" />
        <p className="text-warm-gray text-sm md:text-base tracking-widest uppercase">
          Salem, Tamil Nadu
        </p>
      </header>

      {/* ─── Card ─── */}
      <div className="w-full max-w-lg bg-card-bg rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.06)] border border-warm-border overflow-hidden">
        {/* Card header */}
        <div className="px-6 md:px-8 pt-7 pb-5 border-b border-warm-border">
          <h2 className="font-serif text-xl md:text-2xl text-foreground">
            Share Your Experience
          </h2>
          <p className="text-warm-gray text-sm mt-1">
            Your feedback helps us craft better moments for you.
          </p>
        </div>

        {/* Card body */}
        <div className="px-6 md:px-8 py-6 md:py-8">
          {submitted ? (
            <SuccessMessage onReset={handleReset} />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* ① Star Rating — FIRST */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2.5">
                  How was your Experience?{" "}
                  <span className="text-error">*</span>
                </label>
                <StarRating
                  rating={form.rating}
                  onRate={(r) => updateField("rating", r)}
                />
                {form.rating > 0 && (
                  <p className="text-xs text-warm-gray mt-1.5">
                    {form.rating === 1 && "Poor — We'll do better."}
                    {form.rating === 2 && "Fair — Room for improvement."}
                    {form.rating === 3 && "Good — Thanks for visiting!"}
                    {form.rating === 4 && "Great — Glad you enjoyed it!"}
                    {form.rating === 5 && "Excellent — You made our day!"}
                  </p>
                )}
                {errors.rating && (
                  <p className="text-error text-xs mt-1">{errors.rating}</p>
                )}
              </div>

              {/* ② Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Your Name <span className="text-error">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-transparent transition-colors ${
                    errors.name
                      ? "border-error"
                      : "border-warm-border hover:border-warm-gray-light"
                  }`}
                />
                {errors.name && (
                  <p className="text-error text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* ③ Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Phone Number <span className="text-error">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value.replace(/\D/g, ""))
                  }
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-transparent transition-colors ${
                    errors.phone
                      ? "border-error"
                      : "border-warm-border hover:border-warm-gray-light"
                  }`}
                />
                {errors.phone && (
                  <p className="text-error text-xs mt-1">{errors.phone}</p>
                )}
              </div>


              {/* ⑤ Staff experience */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2.5">
                  How was the experience with Mayna Diamonds Staffs Today?
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {STAFF_EXPERIENCE_OPTIONS.map((opt) => (
                    <PillButton
                      key={opt}
                      label={opt}
                      selected={form.staffExperience.includes(opt)}
                      onClick={() => toggleArrayField("staffExperience", opt)}
                    />
                  ))}
                </div>
              </div>



              {/* ⑦ Comments */}
              <div>
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Additional Comments{" "}
                  <span className="text-warm-gray font-normal">(optional)</span>
                </label>
                <textarea
                  id="comments"
                  rows={3}
                  placeholder="Tell us what you loved, or how we can improve..."
                  value={form.comments}
                  onChange={(e) => updateField("comments", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-warm-border hover:border-warm-gray-light bg-transparent transition-colors resize-none"
                />
              </div>

              {/* Submit error */}
              {submitError && (
                <div className="text-sm text-error bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  {submitError}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg text-sm font-semibold tracking-wide text-white transition-all cursor-pointer ${
                  isSubmitting
                    ? "btn-shimmer cursor-wait"
                    : "bg-gold hover:bg-gold-dark active:scale-[0.98]"
                }`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="spinner" />
                    Submitting…
                  </span>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 md:mt-12 text-center text-xs text-warm-gray-light">
        <p>© {new Date().getFullYear()} Mayna Diamonds. All rights reserved.</p>
      </footer>
    </main>
  );
}
