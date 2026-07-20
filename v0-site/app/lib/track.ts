/**
 * Lightweight, dependency-free analytics dispatch.
 *
 * Safely no-ops if no tag manager / pixel is installed yet. When you add
 * Google Tag Manager and/or the Meta (Facebook) Pixel, these events will start
 * flowing automatically — critical for retargeting warm traffic from Facebook.
 *
 * To enable the Meta Pixel: add your base pixel snippet in app/layout.tsx, then
 * callers/booking events below map to standard + custom events for audiences.
 */
type Params = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;

  // Google Tag Manager dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  // Meta Pixel (custom event) — powers Facebook retargeting audiences
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, params);
  }
}

/** Fire when a visitor taps the "Call Riley" phone number. */
export function trackCall(source: string) {
  track("call_click", { source });
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    // Standard event — builds a "people who tried to contact us" audience
    window.fbq("track", "Contact", { source });
  }
}

/** Fire when a visitor engages the booking calendar CTA. */
export function trackBookingIntent(source: string) {
  track("booking_intent", { source });
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Schedule", { source });
  }
}

/** Fire when a visitor submits the Step 1 contact form (lead captured). */
export function trackLead(params: Params = {}) {
  track("lead", params);
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", params);
  }
}
