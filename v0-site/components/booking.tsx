"use client"

import { useEffect } from "react"
import { CalendarClock, Radar } from "lucide-react"

const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/6aMjFGeLk7okV9zajsGo"

export function Booking() {
  useEffect(() => {
    // Embed script enables auto-resize + native styling of the booking iframe.
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://link.msgsndr.com/js/form_embed.js"]',
    )
    if (existing) return
    const script = document.createElement("script")
    script.src = "https://link.msgsndr.com/js/form_embed.js"
    script.type = "text/javascript"
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <section id="book" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
            <CalendarClock className="h-3.5 w-3.5" /> Book Your 15-Minute Flash Audit
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            See how it works — live.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Grab a 15-minute slot below for a <span className="font-semibold text-slate-900">15-Minute Live Sync</span>.
            We&apos;ll pull your live digital report on the call and map out your exact technical fixes.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-blue-50/40 to-white shadow-[0_1px_3px_rgba(15,23,42,0.06),0_24px_48px_-24px_rgba(15,23,42,0.2)]">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <Radar className="h-4 w-4 shrink-0 text-blue-600" strokeWidth={2.5} />
            <span className="text-sm font-semibold text-slate-700">
              PriceRadarAPI — 15-Minute Audit Flash Review
            </span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live availability
            </span>
          </div>

          {/* Zero-layout-shift wrapper: reserves consistent height so the booking
              iframe never causes a jump as it hydrates, with native padding on mobile. */}
          <div className="w-full p-2 sm:p-4">
            <iframe
              src={BOOKING_URL}
              title="PriceRadarAPI 15-Minute Audit Flash Review booking calendar"
              className="block h-[740px] w-full rounded-xl border border-slate-200 bg-white sm:h-[760px]"
              scrolling="no"
              id="6aMjFGeLk7okV9zajsGo_booking"
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Prefer email? The audit is complimentary and there&apos;s zero obligation.
        </p>
      </div>
    </section>
  )
}
