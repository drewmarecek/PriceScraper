import { MessageSquareText, MessageCircle, PhoneMissed, RefreshCw, Gauge } from "lucide-react"

type Solution = {
  flag: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  featured?: boolean
}

const solutions: Solution[] = [
  {
    flag: "Flagged: 0% review replies & low reputation",
    title: "AI Reputation Manager",
    description:
      "AI-driven responses reply to every Google and Facebook review the moment it lands. That constant activity signals a live, trusted business to Google and pushes your Local Map ranking up fast.",
    icon: MessageSquareText,
    featured: true,
  },
  {
    flag: "Flagged: No chat widget on website",
    title: "Live WebChat Conversion Widget",
    description:
      "An instant, SMS-synchronized web chat hooks mobile visitors before they bounce to a competitor. Conversations continue by text, so leads never slip through the cracks.",
    icon: MessageCircle,
  },
  {
    flag: "Flagged: No text-enabled phone number",
    title: "Missed-Call Text-Back",
    description:
      "Every missed inbound call fires an automated text back within seconds. You lock in the client instantly instead of handing them to the next business they call.",
    icon: PhoneMissed,
  },
  {
    flag: "Flagged: Broken / mismatched directory listings",
    title: "Automated Local Directory Sync",
    description:
      "We synchronize your name, address, and phone (NAP) directly across every major online directory. Consistent data restores SEO credibility and makes you easy to find everywhere.",
    icon: RefreshCw,
  },
  {
    flag: "Flagged: Poor website performance & weak SEO",
    title: "High-Performance Hosting & Tracking",
    description:
      "We migrate you to speed-optimized, mobile-friendly infrastructure. Google Tag Manager, Google Ads tracking, and Meta Pixels are wired in so every dollar of ROI is measured.",
    icon: Gauge,
  },
]

export function Solutions() {
  return (
    <section id="solutions" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
            The Fulfillment
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Every leak has a fix. We deploy all of them.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Each problem our audit flags maps to a specific automated system our team
            builds and turns on for you — no tech friction on your end.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <div
              key={s.title}
              className={`group relative flex flex-col rounded-2xl border p-7 transition-all duration-200 hover:-translate-y-1 ${
                s.featured
                  ? "border-blue-200 bg-blue-50/40 shadow-[0_1px_3px_rgba(37,99,235,0.08),0_16px_32px_-16px_rgba(37,99,235,0.25)] lg:col-span-1"
                  : "border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:border-slate-300 hover:shadow-[0_12px_28px_-16px_rgba(15,23,42,0.18)]"
              }`}
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                  s.featured ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30" : "bg-slate-900 text-white"
                }`}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                {s.flag}
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{s.description}</p>
              <div className="mt-auto pt-5">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Deployed done-for-you
                </span>
              </div>
            </div>
          ))}

          {/* Closing CTA cell to fill the 6th grid slot on large screens */}
          <div className="flex flex-col justify-center rounded-2xl border border-slate-900 bg-slate-900 p-7 text-white">
            <h3 className="text-xl font-extrabold">Ready to patch every leak?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
              Book a 15-Minute Diagnostic Review and we&apos;ll map your exact fixes on the call.
            </p>
            <a
              href="#book"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/30 transition-transform duration-200 hover:scale-[1.03] hover:bg-blue-700"
            >
              Book Your 15-Minute Flash Audit
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
