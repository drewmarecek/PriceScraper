import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">
          Plans
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          14-day free trial on paid tiers. No credit card required to start.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-lg border bg-card ${
              tier.highlight
                ? "ring-growth relative z-10 border-primary/40 bg-[oklch(0.1_0.03_250)] lg:-mt-2 lg:mb-0 lg:pb-2"
                : "border-border"
            }`}
          >
            {tier.highlight && (
              <div className="rounded-t-lg bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 px-4 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                Most deployed · Growth
              </div>
            )}
            <div className={`flex flex-1 flex-col p-6 ${tier.highlight ? "pt-5" : ""}`}>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {tier.name}
              </div>
              <div className="mt-2 flex items-baseline gap-0.5">
                <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/95">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        tier.highlight ? "text-primary" : "text-muted-foreground"
                      }`}
                      strokeWidth={2}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="mt-8">
                <Button
                  className={`w-full font-medium ${
                    tier.highlight
                      ? "bg-primary text-primary-foreground shadow-[0_0_28px_-6px_oklch(0.78_0.14_195_/_0.65)] hover:bg-primary/90"
                      : "border border-border bg-secondary/80 text-secondary-foreground hover:bg-secondary"
                  }`}
                  variant={tier.highlight ? "default" : "secondary"}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
