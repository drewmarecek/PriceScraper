import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const tiers = [
  {
    name: "Starter",
    price: "$79",
    period: "/mo",
    description: "For single-facility owners who want to know what the competition is doing.",
    features: [
      "Track up to 5 local competitors",
      "Daily price updates",
      "Slack & email alerts",
      "30-day price history",
      "CSV export",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$199",
    period: "/mo",
    description: "For regional operators managing multiple locations.",
    features: [
      "Track up to 20 competitors",
      "Hourly price updates",
      "Slack & email alerts",
      "Full price history & trend charts",
      "CSV + API access",
      "Multi-location dashboard",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large operators needing raw API access across hundreds of locations.",
    features: [
      "Unlimited competitor tracking",
      "Real-time updates",
      "Full API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">Simple, transparent pricing</h2>
        <p className="mt-2 text-muted-foreground">
          14-day free trial on paid tiers. No credit card required to start.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col border-border ${
              tier.highlight ? "ring-2 ring-primary bg-card" : "bg-card"
            }`}
          >
            {tier.highlight && (
              <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground rounded-t-lg">
                Most Popular
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-foreground">{tier.name}</CardTitle>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="mt-6">
                <Button
                  className={`w-full ${
                    tier.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
