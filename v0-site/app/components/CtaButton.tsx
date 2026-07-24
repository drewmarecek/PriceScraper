"use client";

import { useBookingModal } from "./BookingModalProvider";

type CtaButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "secondaryOnDark" | "ghost";
  source?: string;
  showArrow?: boolean;
};

const VARIANTS: Record<NonNullable<CtaButtonProps["variant"]>, string> = {
  primary: "cta-primary focus-visible:ring-blue-200",
  secondary: "cta-secondary focus-visible:ring-slate-200",
  secondaryOnDark: "cta-secondary-on-dark focus-visible:ring-white/30",
  ghost:
    "bg-transparent text-ink-soft hover:text-ink hover:bg-tint focus-visible:ring-slate-200 font-semibold rounded-[14px]",
};

export default function CtaButton({
  children,
  className = "",
  variant = "primary",
  source = "cta",
  showArrow = variant === "primary",
}: CtaButtonProps) {
  const { openBookingModal } = useBookingModal();

  return (
    <button
      type="button"
      onClick={() => openBookingModal(source)}
      className={`group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 active:translate-y-0 active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
    >
      {children}
      {showArrow && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </button>
  );
}
