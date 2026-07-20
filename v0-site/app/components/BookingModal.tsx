"use client";

import { useEffect, useRef, useState } from "react";
import { GHL_BOOKING_URL } from "../config";
import { useBookingModal } from "./BookingModalProvider";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required";
  if (!form.lastName.trim()) errors.lastName = "Last name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email";
  }
  if (form.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a valid phone number";
  }
  return errors;
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close booking"
      className="absolute top-3 right-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition hover:bg-slate-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

export default function BookingModal() {
  const { closeBookingModal } = useBookingModal();

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const step2Ref = useRef<HTMLDivElement>(null);

  // Lock background scroll while mounted (mounts only when open) + Escape close.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBookingModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [closeBookingModal]);

  // Safety reset: whenever we land on Step 2, snap both the window and the
  // modal's own scroll container back to the top so users never open the
  // calendar half-scrolled down a pre-rendered iframe canvas.
  useEffect(() => {
    if (step === 2) {
      window.scrollTo(0, 0);
      step2Ref.current?.scrollTo(0, 0);
    }
  }, [step]);

  const update =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    // Fire-and-forget: alert Discord instantly without blocking the calendar.
    fetch("/api/discord-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone }),
    }).catch(() => {});

    setIframeLoaded(false);
    setStep(2);
  };

  const calendarSrc = `${GHL_BOOKING_URL}?first_name=${encodeURIComponent(
    form.firstName.trim(),
  )}&last_name=${encodeURIComponent(
    form.lastName.trim(),
  )}&email=${encodeURIComponent(form.email.trim())}&phone=${encodeURIComponent(
    form.phone.trim(),
  )}`;

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-3 text-ink placeholder-slate-400 outline-none transition focus:ring-2";

  const inputClass = (field: keyof FormState) =>
    `${inputBase} ${
      errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-slate-300 focus:border-brand-blue focus:ring-blue-100"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Book your free demo"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeBookingModal();
      }}
    >
      {step === 1 ? (
        /* STEP 1 — centered, elegant contact card */
        <div className="animate-in fade-in zoom-in-95 relative mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-xl duration-150">
          <CloseButton onClose={closeBookingModal} />

          <div className="pr-8">
            <p className="text-xs font-semibold tracking-wide text-brand-blue uppercase">
              Step 1 of 2
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              Tell us where to send your demo details
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Takes 15 seconds. Then choose your slot on the next step.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-sm font-semibold text-ink"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={update("firstName")}
                  className={inputClass("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1.5 block text-sm font-semibold text-ink"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={update("lastName")}
                  className={inputClass("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-ink"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="jane@company.com"
                value={form.email}
                onChange={update("email")}
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-semibold text-ink"
              >
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={update("phone")}
                className={inputClass("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-green-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-green-dark hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300 active:translate-y-0"
            >
              See Available Times
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

            <p className="mt-3 text-center text-xs text-ink-soft">
              No spam. We only use this to confirm your demo booking.
            </p>
          </form>
        </div>
      ) : (
        /* STEP 2 — expansive calendar frame. The ONLY scroll container is this
           outer card (overflow-y-auto). The iframe is a fixed tall canvas so
           GHL never traps its own scrollbar and every date/time/button is
           reachable via native momentum scrolling on mobile. */
        <div
          ref={step2Ref}
          className="relative mx-auto flex h-screen w-full max-w-2xl flex-col overflow-y-auto rounded-none bg-white p-4 shadow-xl sm:h-auto sm:max-h-[90vh] sm:rounded-2xl"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <CloseButton onClose={closeBookingModal} />

          <div className="shrink-0 pr-8 pb-3">
            <p className="text-xs font-semibold tracking-wide text-brand-blue uppercase">
              Step 2 of 2
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              Pick a time that works for you
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Your details are pre-filled — just choose a time below.
            </p>
          </div>

          <div className="relative flex-1">
            {/* Loading state — prevents a blank white flash while GHL fetches */}
            {!iframeLoaded && (
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-3 bg-white">
                <span
                  className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-blue"
                  aria-hidden
                />
                <p className="text-sm font-medium text-ink-soft">
                  Loading your available times…
                </p>
              </div>
            )}

            <iframe
              src={calendarSrc}
              title="Book your free 15-minute PriceRadarAPI demo"
              onLoad={() => setIframeLoaded(true)}
              className="relative z-[1] block w-full"
              style={{ width: "100%", height: "850px", border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
