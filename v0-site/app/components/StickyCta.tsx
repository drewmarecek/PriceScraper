"use client";

import { PHONE_DISPLAY, PHONE_TEL } from "../config";
import { trackCall } from "../lib/track";
import { useBookingModal } from "./BookingModalProvider";

export default function StickyCta() {
  const { openBookingModal } = useBookingModal();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-3 py-2.5 shadow-[0_-4px_20px_-8px_rgba(15,23,42,0.12)] backdrop-blur sm:hidden">
      <div className="flex items-center gap-2">
        <a
          href={`tel:${PHONE_TEL}`}
          onClick={() => trackCall("sticky_mobile")}
          aria-label={`Call ${PHONE_DISPLAY}`}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-line bg-white text-xl text-ink transition-colors duration-200 active:bg-tint"
        >
          <span aria-hidden>📞</span>
        </a>
        <button
          type="button"
          onClick={() => openBookingModal("sticky_mobile")}
          className="cta-primary inline-flex h-12 flex-1 items-center justify-center text-base"
        >
          Try for Free
        </button>
      </div>
    </div>
  );
}
