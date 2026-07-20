import CtaButton from "./components/CtaButton";
import CallLink from "./components/CallLink";
import ScarcityBadge from "./components/ScarcityBadge";
import StickyCta from "./components/StickyCta";
import { PHONE_DISPLAY } from "./config";

const STATS = [
  { value: "62%", label: "of calls to local businesses go unanswered" },
  { value: "85%", label: "of missed callers never call back" },
  { value: "0", label: "missed calls once Riley is live" },
];

const TESTIMONIALS = [
  {
    initials: "MR",
    name: "Mike R.",
    role: "Owner, Roofing Co.",
    accent: "bg-blue-600",
    quote:
      "We set it up on a Thursday and it booked two jobs over the weekend — calls we would've completely missed.",
  },
  {
    initials: "JC",
    name: "James Carter",
    role: "Home Services",
    accent: "bg-indigo-600",
    quote:
      "All I can say is WOW. I just got off the phone with my AI demo and it sounded more professional than half my team.",
  },
  {
    initials: "SJ",
    name: "Sarah J.",
    role: "HVAC, Operations Lead",
    accent: "bg-emerald-600",
    quote:
      "We stopped bleeding leads overnight — literally. Three after-hours bookings the first night. It pays for itself.",
  },
  {
    initials: "DT",
    name: "Dominic T.",
    role: "Plumbing, Franchise Owner",
    accent: "bg-sky-600",
    quote:
      "Setup was done-for-us and Riley never misses. Our missed-call rate went from ~30% to basically zero.",
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-page pb-16 text-ink sm:pb-0">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/85 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-indigo to-brand-blue text-sm font-black text-white shadow-sm">
              P
            </span>
            <span className="text-lg tracking-tight text-ink">
              <span className="font-extrabold">PriceRadar</span>
              <span className="font-extrabold text-brand-blue">API</span>
            </span>
          </div>
          <CtaButton
            source="header"
            className="hidden px-5 py-2.5 text-sm hover:scale-105 sm:inline-flex"
          >
            Book a free call
          </CtaButton>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="hero-bg px-5 pt-14 pb-12 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Pill badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/70 px-4 py-1.5 text-sm font-semibold text-brand-blue">
            <span aria-hidden>✨</span> Modern AI Voice Engine
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Stop losing revenue to missed calls.
            <span className="mt-2 block text-gradient">
              Our AI Agent answers &amp; books jobs 24/7.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft">
            Every missed call is a customer handing money to your competitor.
            PriceRadarAPI answers instantly, sounds human, and books the job
            straight onto your calendar — day or night.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton source="hero" className="px-8 py-4 text-base sm:text-lg">
              Book your free 15-min demo
            </CtaButton>
            <CallLink
              source="hero"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-8 py-4 text-base font-semibold text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:text-lg"
            >
              <span aria-hidden>📞</span> Call Riley live now
            </CallLink>
          </div>

          <div className="mt-6">
            <ScarcityBadge />
          </div>
        </div>

        {/* ============ PREMIUM LIVE DEMO WIDGET CARD ============ */}
        <div className="mx-auto mt-12 max-w-xl">
          <div className="card rounded-3xl bg-blue-50/40 p-7 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
                Test the AI Right Now
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Live 24/7/365
              </span>
            </div>

            <p className="mt-3 text-lg font-bold text-ink">
              Call Riley Live — talk to the AI yourself
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Ask her hard questions, try to interrupt her, and watch her take a
              message &amp; book an appointment in real time.
            </p>

            <CallLink
              source="demo_card"
              className="soft-ring mt-6 flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50/60 px-6 py-5 text-center transition-colors hover:bg-blue-50"
            >
              <span className="text-3xl font-black tracking-tight text-brand-blue sm:text-4xl">
                {PHONE_DISPLAY}
              </span>
            </CallLink>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-brand-green">
              <span>✓ Answers on ring one</span>
              <span>✓ Books to your calendar</span>
              <span>✓ Never sleeps</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PAIN / VALUE STAT BAR ============ */}
      <section className="border-y border-line bg-tint px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-semibold tracking-wide text-ink-soft uppercase">
            The cost of a missed call
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="card p-6 text-center">
                <div className="text-4xl font-extrabold tracking-tight text-gradient">
                  {s.value}
                </div>
                <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-ink-soft">
            Industry averages for local service businesses. Your competitors are
            already answering.
          </p>
        </div>
      </section>

      {/* ============ BOOKING CTA ============ */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            See how it works — <span className="text-gradient">live.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
            Grab a free 15-minute demo. We&apos;ll map your call flow and show
            you a custom AI agent handling your exact scenarios — no pressure,
            no obligation.
          </p>

          <div className="mx-auto mt-9 max-w-sm">
            <CtaButton source="book_section" className="w-full px-8 py-4 text-lg">
              Book your free 15-min demo
            </CtaButton>
          </div>

          {/* Micro-trust right at the decision point */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {["No contract to test it", "100+ businesses live", "Setup done for you"].map(
              (item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-green/10 text-brand-green">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.3 6.8-6.8a1 1 0 0 1 1.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {item}
                </span>
              ),
            )}
          </div>
          <p className="mt-6 text-center text-sm text-ink-soft">
            Prefer to talk first? Call Riley at{" "}
            <CallLink
              source="calendar_note"
              className="font-semibold text-brand-blue hover:underline"
            >
              {PHONE_DISPLAY}
            </CallLink>
          </p>
        </div>
      </section>

      {/* ============ SOCIAL PROOF ============ */}
      <section className="border-t border-line bg-tint px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold text-ink-soft">
            Loved by service businesses
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            What owners say after going live
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="card flex flex-col gap-4 p-6 transition-shadow duration-200 hover:shadow-lg"
            >
              <StarRow />
              <blockquote className="text-[15px] leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-4">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${t.accent}`}
                >
                  {t.initials}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-ink">
                    {t.name}
                  </span>
                  <span className="block text-xs text-ink-soft">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-md text-center">
          <CtaButton source="social_proof" className="w-full px-8 py-4 text-lg">
            Book my free 15-min demo
          </CtaButton>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-line bg-white px-5 py-10 text-center">
        <p className="text-base font-bold tracking-tight text-ink">
          PriceRadar<span className="text-brand-blue">API</span>
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          AI receptionists that answer every call and book every job — 24/7.
        </p>
        <p className="mt-4 text-xs text-ink-soft">
          &copy; {new Date().getFullYear()} PriceRadarAPI. All rights reserved.
        </p>
      </footer>

      {/* Sticky mobile action bar */}
      <StickyCta />
    </main>
  );
}
