"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, MapPin } from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"

/** Illustrative Austin-metro scenario — not live or client-specific data. */
const COMPETITORS = [
  {
    short: "Bluebonnet",
    full: "Bluebonnet Self Storage",
    area: "Pflugerville",
    price: 140,
    occupancy: 95,
  },
  {
    short: "Oak Hill",
    full: "Oak Hill Mini Storage",
    area: "Southwest Austin",
    price: 140,
    occupancy: 95,
  },
  {
    short: "Tech Ridge",
    full: "Tech Ridge Storage",
    area: "North Austin",
    price: 140,
    occupancy: 95,
  },
] as const

const chartData = [
  { name: "You", price: 110, kind: "you" as const },
  ...COMPETITORS.map((c) => ({ name: c.short, price: c.price, kind: "comp" as const })),
]

export function HowItWorksPractice() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          How it works in practice
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Example: in a tight submarket around Austin, TX, three nearby independents are nearly full
          and have moved 10×10 climate-controlled web rates to{" "}
          <span className="font-medium text-foreground">$140/mo</span>. Your site still shows{" "}
          <span className="font-medium text-foreground">$110</span>. That gap is margin you may be
          leaving on the table — or a deliberate strategy PriceRadarAPI helps you defend with data.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Illustrative scenario; facility names are representative, not live quotes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Your facility vs. nearby competitors
            </div>
            <CardTitle className="text-base font-normal text-muted-foreground">
              10×10 climate-controlled · Web rate comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border-2 border-amber-500/40 bg-amber-500/10 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-semibold text-foreground">Your facility (Austin, TX)</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">$110/mo</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    $30/mo below the three competitors shown — worth a deliberate pricing review.
                  </p>
                </div>
              </div>
            </div>

            {COMPETITORS.map((c) => (
              <div
                key={c.short}
                className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{c.full}</p>
                  <p className="text-xs text-muted-foreground">{c.area}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                    ~{c.occupancy}% occupied
                  </span>
                  <span className="text-lg font-semibold tabular-nums text-foreground">
                    ${c.price}/mo
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Same data as a bar view
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              PriceRadarAPI surfaces this in your dashboard and can alert you when peers move.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" domain={[90, 160]} tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={56} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => [`$${value}/mo`, "Web rate"]}
                    contentStyle={{
                      backgroundColor: "oklch(0.14 0 0)",
                      border: "1px solid oklch(0.25 0 0)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="price" radius={[0, 4, 4, 0]} maxBarSize={28}>
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          entry.kind === "you"
                            ? "oklch(0.75 0.15 85)"
                            : "oklch(0.72 0.14 180)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
