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

/** Teal primary + green flash (matches theme chart-1 / chart-2) */
const C_LINE = "oklch(0.72 0.14 180)"
const C_LINE_END = "oklch(0.62 0.12 180)"
const C_FLASH = "oklch(0.65 0.18 145)"
const C_GRID = "oklch(0.25 0 0)"
const C_TICK = "oklch(0.6 0 0)"

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
    <section id="radar-story" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
          Caught on Radar: The 12-Hour Drop
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          While local operators were asleep, the national chains dropped web rates by {DROP_PCT}% to grab
          weekend traffic, then hiked them back up. If you don&apos;t have our API, you missed it.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-1 border-b border-border bg-secondary/30 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between md:px-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
            <span className="font-medium text-foreground">
              <span className="text-primary">●</span> Public Storage
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Conroe, TX</span>
            <span className="hidden sm:inline">·</span>
            <span>10×10 Climate Controlled</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
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
                    <stop offset="0%" stopColor={C_LINE} />
                    <stop offset="100%" stopColor={C_LINE_END} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C_GRID} strokeDasharray="3 6" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: C_TICK, fontSize: 12 }}
                  padding={{ left: 8, right: 8 }}
                />
                <YAxis
                  domain={[48, 72]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: C_TICK, fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                  width={44}
                />
                <Tooltip
                  cursor={{ stroke: `${C_LINE}99`, strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const row = payload[0].payload as (typeof PUBLIC_STORAGE_CONROE_10X10_CC)[number]
                    return (
                      <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-xl">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{row.date}</div>
                        <div className="mt-1 text-foreground">
                          <span className="font-semibold text-primary">${row.price}</span>
                          <span className="text-muted-foreground"> /mo web</span>
                        </div>
                        {row.flash && (
                          <div className="mt-1.5 text-[10px] font-medium" style={{ color: C_FLASH }}>
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
                  fill={`${C_FLASH}22`}
                  stroke={`${C_FLASH}55`}
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
                          <circle cx={cx} cy={cy} r={14} fill={`${C_FLASH}33`} />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={7}
                            fill={C_FLASH}
                            stroke="oklch(0.95 0.02 145)"
                            strokeWidth={2}
                          />
                          <text
                            x={cx}
                            y={cy - 18}
                            textAnchor="middle"
                            fill={C_FLASH}
                            fontSize={10}
                            fontWeight={600}
                          >
                            Weekend Flash Sale
                          </text>
                        </g>
                      )
                    }
                    return (
                      <circle cx={cx} cy={cy} r={4} fill={C_LINE} stroke="oklch(0.1 0 0)" strokeWidth={1} />
                    )
                  }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: C_LINE }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-secondary/30 px-3 py-2">
              <div className="text-xs text-muted-foreground">Baseline</div>
              <div className="mt-0.5 font-semibold text-foreground">$66</div>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 px-3 py-2 ring-1 ring-primary/25">
              <div className="text-xs text-muted-foreground">Flash floor</div>
              <div className="mt-0.5 font-semibold" style={{ color: C_FLASH }}>
                $54
              </div>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 px-3 py-2">
              <div className="text-xs text-muted-foreground">Δ vs baseline</div>
              <div className="mt-0.5 font-semibold text-primary">−{DROP_PCT}%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
