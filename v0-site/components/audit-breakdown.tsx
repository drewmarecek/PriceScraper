import { AlertTriangle, TrendingDown, MapPin, Star, Search } from "lucide-react"

type Metric = {
  label: string
  value: number
  note: string
  icon: React.ComponentType<{ className?: string }>
}

const metrics: Metric[] = [
  {
    label: "Listings Accuracy",
    value: 35,
    note: "Flagged: Inconsistent / broken business listings",
    icon: MapPin,
  },
  {
    label: "Reputation",
    value: 52,
    note: "Flagged: 0% review engagement rate",
    icon: Star,
  },
  {
    label: "SEO Analysis",
    value: 0,
    note: "Flagged: Rank 10+ — off page one",
    icon: Search,
  },
]

function barColor(value: number) {
  if (value < 40) return "bg-red-500"
  if (value < 70) return "bg-amber-500"
  return "bg-emerald-500"
}

export function AuditBreakdown() {
  const overall = 44
  const dash = 2 * Math.PI * 52
  const offset = dash - (overall / 100) * dash

  return (
    <section id="audit" className="border-y border-slate-200 bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600">
            <AlertTriangle className="h-3.5 w-3.5" /> Your Live Audit
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            This is what a bleeding business looks like.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            An unoptimized digital footprint isn&apos;t just a technical glitch—it is actively
            <span className="font-semibold text-slate-900"> funding your local competitors.</span>{" "}
            Every hour your profile sits misconfigured, ready-to-pay customers are slipping through
            the cracks.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl items-stretch gap-6 lg:grid-cols-5">
          {/* Score card */}
          <div className="lg:col-span-2">
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_12px_28px_-12px_rgba(15,23,42,0.12)]">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Overall Health Score
              </p>
              <div className="relative mt-6 h-40 w-40">
                <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={dash}
                    strokeDashoffset={offset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-900">{overall}%</span>
                  <span className="text-xs font-bold uppercase tracking-wide text-red-500">
                    Critical
                  </span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                <TrendingDown className="h-4 w-4" />
                Losing customers daily
              </div>
            </div>
          </div>

          {/* Metric bars */}
          <div className="lg:col-span-3">
            <div className="flex h-full flex-col justify-center gap-7 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_12px_28px_-12px_rgba(15,23,42,0.12)]">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <m.icon className="h-4 w-4 text-slate-400" />
                      {m.label}
                    </span>
                    <span className="text-sm font-black tabular-nums text-slate-900">
                      {m.value}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`animate-bar h-full rounded-full ${barColor(m.value)}`}
                      style={{ width: `${Math.max(m.value, 2)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-slate-500">{m.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leak callouts — the brutal financial reality behind each score */}
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            {
              stat: "35%",
              flag: "Inconsistent / Broken Business Listings",
              body:
                "Inconsistent business names, phone numbers, and addresses across the web destroy your local SEO trust score. Google reads this chaotic data as a dead or fake profile, rendering you completely invisible to nearby customers who are actively trying to buy from you right now.",
            },
            {
              stat: "0%",
              flag: "Review Engagement Rate",
              body:
                "Leaving 5-star customer reviews sitting empty without responses signals a neglected business to Google's ranking algorithm. Even worse, modern consumers skip right past profiles that don't talk back, handing their business straight to faster shops.",
            },
            {
              stat: "10+",
              flag: "Rank 10+ (Off Page One)",
              body:
                "If your business doesn't appear in the top 3 spots on Google Maps, you do not exist to the mobile market. 92% of local search traffic goes entirely to the top 3 map results. Sitting on page two means you are giving away free market share every single day.",
            },
          ].map((c) => (
            <div
              key={c.flag}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-[0_12px_28px_-16px_rgba(15,23,42,0.18)]"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-red-500">{c.stat}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">
                  <AlertTriangle className="h-3 w-3" /> Flagged
                </span>
              </div>
              <p className="mt-3 text-sm font-extrabold text-slate-900">{c.flag}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
