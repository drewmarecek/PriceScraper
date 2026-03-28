"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, MapPin } from "lucide-react"
import {
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  ComposedChart,
} from "recharts"

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(today.getDate() - 1)

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const priceData = [
  { date: fmt(yesterday), facility_a: 189, facility_b: 145, facility_c: 122 },
  { date: fmt(today), facility_a: 189, facility_b: 139, facility_c: 122 },
]

const changes = [
  { name: "Competitor B", unit: "10x10 CC", change: -6, price: 139, date: fmt(today) },
  { name: "Competitor A", unit: "10x10 CC", change: 0, price: 189, date: fmt(today) },
  { name: "Competitor C", unit: "10x10 CC", change: 0, price: 122, date: fmt(today) },
]

export function Dashboard() {
  const [city, setCity] = useState("Your Market")

  useEffect(() => {
    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((data) => {
        if (data.city && data.region_code) {
          setCity(`${data.city}, ${data.region_code}`)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="dashboard-demo" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Here&apos;s what your dashboard looks like
        </h2>
        <p className="mt-2 text-muted-foreground">
          Sample data for a market like yours. Your actual dashboard tracks your real competitors.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {city}
          </div>
          <span className="text-xs text-muted-foreground">10x10 Climate Controlled</span>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-5">
          <Card className="border-border bg-secondary/30 lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Rate History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={priceData}>
                    <defs>
                      <linearGradient id="fa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.72 0.14 180)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="oklch(0.72 0.14 180)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} domain={[100, 210]} tickFormatter={(v: number) => `$${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "oklch(0.14 0 0)", border: "1px solid oklch(0.25 0 0)", borderRadius: "8px", color: "oklch(0.95 0 0)", fontSize: "13px" }}
                      formatter={(value: number) => [`$${value}`, ""]}
                    />
                    <Area type="monotone" dataKey="facility_a" stroke="oklch(0.72 0.14 180)" strokeWidth={2} fill="url(#fa)" name="Competitor A" />
                    <Line type="monotone" dataKey="facility_b" stroke="oklch(0.75 0.15 85)" strokeWidth={2} dot={false} name="Competitor B" />
                    <Line type="monotone" dataKey="facility_c" stroke="oklch(0.6 0.2 300)" strokeWidth={2} dot={false} name="Competitor C" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-5">
                {[
                  { label: "Competitor A", color: "oklch(0.72 0.14 180)" },
                  { label: "Competitor B", color: "oklch(0.75 0.15 85)" },
                  { label: "Competitor C", color: "oklch(0.6 0.2 300)" },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-xs text-muted-foreground">{c.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-secondary/30 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {changes.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.unit} · {item.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">${item.price}</span>
                      <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.change > 0 ? "bg-destructive/20 text-destructive"
                          : item.change < 0 ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {item.change > 0 ? <TrendingUp className="h-3 w-3" /> : item.change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                        {item.change === 0 ? "—" : `${item.change > 0 ? "+" : ""}$${Math.abs(item.change)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
