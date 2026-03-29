import { Bell, Clock, BarChart3, Globe, Building2, Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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
    <section id="features" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">Built for operators</h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          Dense readouts and clear labels—built for how facility owners actually work.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.code} className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-primary">{f.code}</span>
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {f.value}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
