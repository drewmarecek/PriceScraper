"use client";

import { PHONE_DISPLAY, PHONE_TEL } from "../config";
import { trackCall } from "../lib/track";
import { useBookingModal } from "./BookingModalProvider";

/**
 * Fixed bottom action bar for mobile. Facebook traffic is overwhelmingly mobile,
 * so this keeps the primary action (book) and the low-friction action (call)
 * one tap away at all times. Booking opens the modal instantly.
 */
export default function StickyCta() {
  const { openBookingModal } = useBookingModal();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-3 py-2.5 shadow-[0_-4px_20px_-8px_rgba(15,23,42,0.25)] backdrop-blur sm:hidden">
      <div className="flex items-center gap-2">
        <a
          href={`tel:${PHONE_TEL}`}
          onClick={() => trackCall("sticky_mobile")}
          aria-label={`Call ${PHONE_DISPLAY}`}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-xl text-ink transition-colors active:bg-slate-50"
        >
          <span aria-hidden>📞</span>
        </a>
        <button
          type="button"
          onClick={() => openBookingModal("sticky_mobile")}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-brand-green text-base font-semibold text-white shadow-lg shadow-green-600/20 transition-colors active:bg-brand-green-dark"
        >
          Book your free 15-min demo
        </button>
      </div>
    </div>
  );
}
