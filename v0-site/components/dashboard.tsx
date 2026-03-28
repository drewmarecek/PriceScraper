"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

/** Observed web rate — 10×10 climate controlled, Public Storage, Conroe, TX (illustrative scrape window). */
const PUBLIC_STORAGE_CONROE_10X10_CC = [
  { date: "Mar 20", price: 66, flash: false },
  { date: "Mar 21", price: 54, flash: true },
  { date: "Mar 22", price: 66, flash: false },
  { date: "Mar 23", price: 66, flash: false },
  { date: "Mar 24", price: 66, flash: false },
] as const

const DROP_PCT = Math.round(((66 - 54) / 66) * 100)

export function Dashboard() {
  return (
    <section id="radar-story" className="relative mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">
          Live competitor intelligence
        </p>
        <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Caught on Radar: The 12-Hour Drop
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          While local operators were asleep, the national chains dropped web rates by {DROP_PCT}% to grab
          weekend traffic, then hiked them back up. If you don&apos;t have our API, you missed it.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_0_0_1px_oklch(0.78_0.14_195_/_0.08)]">
        <div className="flex flex-col gap-1 border-b border-border bg-black/30 px-4 py-3 font-mono text-[11px] sm:flex-row sm:items-center sm:justify-between md:px-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
            <span className="text-foreground">
              <span className="text-primary">●</span> PUBLIC STORAGE
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Conroe, TX</span>
            <span className="hidden sm:inline">·</span>
            <span>10×10 Climate Controlled</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary/90">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.72_0.2_155)]" />
            Web rate series
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="h-[320px] w-full md:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...PUBLIC_STORAGE_CONROE_10X10_CC]}
                margin={{ top: 28, right: 12, left: 0, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.78 0.14 195)" />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 210)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.28 0.02 250)" strokeDasharray="3 6" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.55 0.02 250)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                  padding={{ left: 8, right: 8 }}
                />
                <YAxis
                  domain={[48, 72]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.5 0.02 250)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                  tickFormatter={(v) => `$${v}`}
                  width={44}
                />
                <Tooltip
                  cursor={{ stroke: "oklch(0.78 0.14 195 / 0.35)", strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const row = payload[0].payload as (typeof PUBLIC_STORAGE_CONROE_10X10_CC)[number]
                    return (
                      <div className="rounded-md border border-border bg-[oklch(0.09_0.02_250)] px-3 py-2 font-mono text-xs shadow-xl">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {row.date}
                        </div>
                        <div className="mt-1 text-foreground">
                          <span className="text-primary">${row.price}</span>
                          <span className="text-muted-foreground"> /mo web</span>
                        </div>
                        {row.flash && (
                          <div className="mt-1.5 text-[10px] font-medium text-[oklch(0.78_0.18_155)]">
                            Weekend flash sale
                          </div>
                        )}
                      </div>
                    )
                  }}
                />
                <ReferenceArea
                  x1="Mar 20"
                  x2="Mar 22"
                  y1={52}
                  y2={68}
                  fill="oklch(0.72 0.2 155 / 0.14)"
                  stroke="oklch(0.72 0.2 155 / 0.35)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="url(#lineGrad)"
                  strokeWidth={2.75}
                  dot={(props: {
                    cx?: number
                    cy?: number
                    payload?: { flash?: boolean; price?: number; date?: string }
                  }) => {
                    const { cx, cy, payload } = props
                    if (cx == null || cy == null || !payload) return null
                    if (payload.flash) {
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={14} fill="oklch(0.72 0.2 155 / 0.2)" />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={7}
                            fill="oklch(0.72 0.2 155)"
                            stroke="oklch(0.95 0.02 155)"
                            strokeWidth={2}
                          />
                          <text
                            x={cx}
                            y={cy - 18}
                            textAnchor="middle"
                            fill="oklch(0.82 0.12 155)"
                            fontSize={10}
                            fontFamily="var(--font-mono)"
                            fontWeight={600}
                          >
                            Weekend Flash Sale
                          </text>
                        </g>
                      )
                    }
                    return (
                      <circle cx={cx} cy={cy} r={4} fill="oklch(0.78 0.14 195)" stroke="oklch(0.1 0.02 250)" strokeWidth={1} />
                    )
                  }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "oklch(0.78 0.14 195)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid gap-3 border-t border-border pt-4 font-mono text-[11px] sm:grid-cols-3">
            <div className="rounded border border-border/80 bg-black/25 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Baseline</div>
              <div className="mt-0.5 text-sm text-foreground">$66</div>
            </div>
            <div className="rounded border border-[oklch(0.72_0.2_155_/_0.45)] bg-[oklch(0.72_0.2_155_/_0.08)] px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-[oklch(0.75_0.15_155)]">Flash floor</div>
              <div className="mt-0.5 text-sm text-[oklch(0.82_0.12_155)]">$54</div>
            </div>
            <div className="rounded border border-border/80 bg-black/25 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Δ vs baseline</div>
              <div className="mt-0.5 text-sm text-primary">−{DROP_PCT}%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
