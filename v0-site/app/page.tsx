import CallLink from "./components/CallLink";
import CtaButton from "./components/CtaButton";
import FaqAccordion from "./components/FaqAccordion";
import FeatureTabs from "./components/FeatureTabs";
import SiteHeader from "./components/SiteHeader";
import StickyCta from "./components/StickyCta";
import { PHONE_DISPLAY } from "./config";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Build the agent",
    body: "Connect your business details, define the call flow, and link your calendar and tools — no engineering team required.",
  },
  {
    step: "02",
    title: "Test before you go live",
    body: "Run the agent through common front-desk scenarios, review accuracy, and refine the flow before callers reach it.",
  },
  {
    step: "03",
    title: "Connect your line",
    body: "Forward calls to the agent on your existing number — all calls, missed calls only, or after hours — with clear escalation rules.",
  },
  {
    step: "04",
    title: "Monitor and improve",
    body: "Review transcripts, outcomes, and booking performance. Spot gaps and retrain the flow as your business changes.",
  },
];

const USE_CASES = [
  {
    title: "Answer every call",
    body: "The agent picks up promptly, greets callers in your name, and answers common questions from your knowledge base — day or night.",
  },
  {
    title: "Book appointments",
    body: "It checks live availability and writes appointments directly into your calendar, then confirms during the same call.",
  },
  {
    title: "Capture and qualify leads",
    body: "The agent gathers what you need, qualifies the lead in conversation, and can warm-transfer hot leads with full context.",
  },
  {
    title: "Follow up by phone",
    body: "Send reminders, confirmations, and follow-up calls — or take a message when the right person isn’t available.",
  },
  {
    title: "Cover overflow and after-hours",
    body: "Handle the calls your team can’t take, so nothing rolls to voicemail when you’re busy or offline.",
  },
  {
    title: "Support multiple languages",
    body: "Serve callers in the language they start in, with automatic language detection across supported languages.",
  },
];

const INTEGRATIONS = [
  "HubSpot",
  "Twilio",
  "Vonage",
  "Go High Level",
  "n8n",
  "Zapier",
  "Salesforce",
  "Avaya",
  "Genesys",
  "Five9",
  "Amazon Connect",
  "Telnyx",
  "Make",
  "Cal.com",
];

const FOOTER_COLS = [
  {
    title: "Products",
    links: [
      "Build",
      "Call Transfer",
      "Book Appointments",
      "Knowledge Base",
      "Batch Call",
      "Post Call Analysis",
    ],
  },
  {
    title: "Solutions",
    links: [
      "AI Receptionist",
      "Lead Qualification",
      "Answering Service",
      "Appointment Setter",
      "Healthcare",
      "Home Services",
    ],
  },
  {
    title: "Resources",
    links: ["Documentation", "Changelog", "Blog", "Customer Stories", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Newsroom", "Trust Center", "Privacy", "Terms"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-page pb-20 text-ink sm:pb-0">
      <SiteHeader />

      {/* ============ HERO ============ */}
      <section className="hero-bg relative overflow-hidden px-5 pt-24 pb-20 sm:pt-40 sm:pb-36">
        <div className="fade-up mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl text-ink sm:text-6xl lg:text-[4.25rem]">
            AI Receptionist That Answers Every Call, 24/7
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-[1.7] text-ink-soft sm:text-xl">
            Greets callers, answers questions, books appointments, and routes
            conversations with context — so you never miss a lead.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton source="hero" className="px-8 py-4 text-base">
              Try for Free
            </CtaButton>
            <CtaButton
              source="hero_contact"
              variant="secondary"
              showArrow={false}
              className="px-8 py-4 text-base"
            >
              Contact Sales
            </CtaButton>
          </div>

          <p className="mt-8 text-sm text-ink-muted">
            Prefer to hear it first? Call Riley live at{" "}
            <CallLink
              source="hero_phone"
              className="font-semibold text-brand-blue hover:underline"
            >
              {PHONE_DISPLAY}
            </CallLink>
          </p>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section
        id="how-it-works"
        className="section-pad border-t border-line bg-tint px-5"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold tracking-wider text-brand-blue uppercase">
            How It Works
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl text-ink sm:text-5xl">
            From setup to a live line — on your existing number.
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {HOW_IT_WORKS.map((item) => (
              <article key={item.step} className="feature-panel p-8">
                <span className="text-sm font-semibold tracking-wider text-brand-blue">
                  {item.step}
                </span>
                <h3 className="font-display mt-3 text-xl text-ink sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ USE CASES ============ */}
      <section
        id="use-cases"
        className="section-pad border-t border-line bg-page px-5"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold tracking-wider text-brand-blue uppercase">
            Use Cases
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl text-ink sm:text-5xl">
            What your AI receptionist handles from day one
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((item) => (
              <article key={item.title} className="feature-panel flex flex-col p-8">
                <h3 className="font-display text-lg text-ink">{item.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-ink-soft">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section
        id="features"
        className="section-pad border-t border-line bg-tint px-5"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold tracking-wider text-brand-blue uppercase">
            Features
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl text-ink sm:text-5xl">
            Why teams choose PriceRadarAPI
          </h2>
          <div className="mt-12">
            <FeatureTabs />
          </div>
        </div>
      </section>

      {/* ============ INTEGRATIONS ============ */}
      <section
        id="integrations"
        className="section-pad border-t border-line bg-page px-5"
      >
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold tracking-wider text-brand-blue uppercase">
            Integrations
          </p>
          <h2 className="font-display mx-auto mt-3 max-w-xl text-3xl text-ink sm:text-5xl">
            Works with your existing stack
          </h2>

          <div className="mt-12 overflow-hidden">
            <div className="integrations-track flex w-max gap-3">
              {[...INTEGRATIONS, ...INTEGRATIONS].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="integration-chip inline-flex items-center rounded-[14px] border border-line bg-white px-5 py-3 text-sm font-semibold whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="section-pad border-t border-line bg-tint px-5">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm font-semibold tracking-wider text-brand-blue uppercase">
            FAQ
          </p>
          <h2 className="font-display mt-3 text-center text-3xl text-ink sm:text-5xl">
            Frequently asked questions
          </h2>
          <div className="mt-12">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section
        id="contact"
        className="section-pad relative overflow-hidden border-t border-line bg-brand-navy px-5 text-white"
      >
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl sm:text-5xl">
            Ready to stop missing calls?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-[1.7] text-slate-300">
            Start a free trial or talk with our team about your setup.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton source="final_cta" className="px-8 py-4 text-base">
              Try For Free
            </CtaButton>
            <CtaButton
              source="final_contact"
              variant="secondaryOnDark"
              showArrow={false}
              className="px-8 py-4 text-base"
            >
              Contact Sales
            </CtaButton>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-line bg-page px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
            <div>
              <p className="font-display text-xl text-ink">
                Built to scale
              </p>
              <p className="mt-4 max-w-sm text-sm leading-[1.7] text-ink-soft">
                Product updates, delivered occasionally.
              </p>
              <form className="mt-5 flex max-w-sm gap-2" action="#" method="get">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  aria-label="Email"
                  className="min-w-0 flex-1 rounded-[14px] border border-line bg-tint px-4 py-3 text-sm outline-none transition-colors duration-200 focus:border-brand-blue"
                />
                <button
                  type="submit"
                  className="rounded-[14px] bg-brand-navy px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800"
                >
                  Submit
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {FOOTER_COLS.map((col) => (
                <div key={col.title}>
                  <p className="text-sm font-semibold text-ink">{col.title}</p>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">
              © {new Date().getFullYear()} PriceRadarAPI
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-ink-muted">
              <a href="#" className="transition-colors duration-200 hover:text-ink">
                Trust Center
              </a>
              <a href="#" className="transition-colors duration-200 hover:text-ink">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors duration-200 hover:text-ink">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      <StickyCta />
    </main>
  );
}
