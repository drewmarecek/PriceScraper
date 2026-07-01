import { ArrowRight, Zap, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* subtle grid + glow backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid-slate opacity-[0.4] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          Automated Audits + Done-For-You Fixes
        </div>

        <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          Your online presence has leaks.{" "}
          <span className="text-blue-600">We find them.</span>{" "}
          <span className="text-emerald-600">We fix them.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 sm:text-xl">
          PriceRadarAPI scans your business footprint, isolates the technical gaps
          costing you customers, and deploys complete done-for-you fixes — so you
          stop leaking revenue and start showing up.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#book" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-14 w-full rounded-xl bg-blue-600 px-8 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-blue-700 sm:w-auto"
            >
              Book Your 15-Minute Flash Audit
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </a>
          <a href="#audit" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-xl border-slate-300 bg-white px-8 text-base font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              See a Sample Audit
            </Button>
          </a>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
          <span className="inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" /> Live report on the call
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" /> No tech work on your end
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" /> 100% done-for-you
          </span>
        </div>
      </div>
    </section>
  )
}
