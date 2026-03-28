import { Bell, Clock, BarChart3, Globe, Building2, Database } from "lucide-react"

const features = [
  {
    icon: Bell,
    code: "ALRT-01",
    title: "Slack & Email Alerts",
    value: "Same-day",
    description:
      "Push notifications when a peer changes their published web rate—no dashboard babysitting.",
  },
  {
    icon: Clock,
    code: "SCRAPE",
    title: "Daily price tracking",
    value: "24/7 queue",
    description:
      "Scheduled pulls from competitor facility pages so your intel is always current.",
  },
  {
    icon: BarChart3,
    code: "CHART",
    title: "Trend charts",
    value: "Multi-window",
    description:
      "Visualize rate moves across weeks and months to time your own moves with confidence.",
  },
  {
    icon: Globe,
    code: "ORIGIN",
    title: "Source: real websites",
    value: "Direct scrape",
    description:
      "Rates come from operator sites and booking flows—not third-party estimates.",
  },
  {
    icon: Building2,
    code: "PORTFOLIO",
    title: "Multi-location",
    value: "Unified",
    description:
      "One command surface for every store you run—compare peers at a glance.",
  },
  {
    icon: Database,
    code: "STORE",
    title: "Historical data",
    value: "CSV + API",
    description:
      "Every observation retained for audit, export, and your own models.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">
          Signal feed
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Built for operators, not slide decks
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          Every readout is designed like a desk terminal—dense, legible, and action-oriented.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.code}
            className="group relative overflow-hidden rounded-lg border border-border bg-[oklch(0.08_0.02_250)] p-4 shadow-[inset_0_1px_0_0_oklch(0.78_0.14_195_/_0.06)] transition-colors hover:border-primary/25"
          >
            <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className="text-primary/90">{f.code}</span>
              <f.icon className="h-4 w-4 shrink-0 text-primary/70" strokeWidth={1.75} />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-medium leading-snug text-foreground">{f.title}</h3>
              <span className="shrink-0 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-primary tabular-nums">
                {f.value}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
