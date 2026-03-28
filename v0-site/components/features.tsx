import { Bell, Clock, BarChart3, Globe, Building2, Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Bell,
    title: "Slack & Email Alerts",
    description:
      "Get notified the same day a competitor changes their rate. No more manual spreadsheet checks.",
  },
  {
    icon: Clock,
    title: "Daily Price Tracking",
    description:
      "We scrape your competitors' public web rates every day so you never miss a move.",
  },
  {
    icon: BarChart3,
    title: "Trend Charts",
    description:
      "See how competitor rates shift over weeks and months. Spot seasonal patterns before they spot yours.",
  },
  {
    icon: Globe,
    title: "Works With Any Website",
    description:
      "We pull rates directly from facility websites — SpareFoot, SiteLink, storEDGE, and more.",
  },
  {
    icon: Building2,
    title: "Multi-Location Tracking",
    description:
      "Manage pricing intelligence for all your locations from a single dashboard.",
  },
  {
    icon: Database,
    title: "Historical Data",
    description:
      "Every price point is stored. Export to CSV or access via API for your own analysis.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Everything you need to price with confidence
        </h2>
        <p className="mt-2 text-muted-foreground">
          Built specifically for self-storage operators, not generic SaaS analytics.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="border-border bg-card">
            <CardContent className="pt-6">
              <f.icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
