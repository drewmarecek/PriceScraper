"use client";

import { useBookingModal } from "./BookingModalProvider";

type CtaButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "green" | "blue";
  /** Analytics attribution label for this button's location. */
  source?: string;
};

const VARIANTS: Record<NonNullable<CtaButtonProps["variant"]>, string> = {
  green:
    "bg-brand-green hover:bg-brand-green-dark shadow-green-600/25 focus-visible:ring-green-300",
  blue: "bg-brand-blue hover:bg-brand-blue-dark shadow-blue-600/25 focus-visible:ring-blue-300",
};

/**
 * Primary conversion element. Opens the booking modal instantly — no anchor
 * scrolling (which was causing dead clicks inside mobile webviews).
 */
export default function CtaButton({
  children,
  className = "",
  variant = "green",
  source = "cta",
}: CtaButtonProps) {
  const { openBookingModal } = useBookingModal();

  return (
    <button
      type="button"
      onClick={() => openBookingModal(source)}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 active:translate-y-0 ${VARIANTS[variant]} ${className}`}
    >
      {children}
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
    </button>
  );
}
