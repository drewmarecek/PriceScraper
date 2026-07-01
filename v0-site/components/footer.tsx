import { Radar, ArrowRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      {/* final CTA band */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-900 px-8 py-10 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Stop leaking customers to competitors.
            </h3>
            <p className="mt-2 text-slate-300">
              Book your 15-Minute Flash Audit and see your live report on the call.
            </p>
          </div>
          <a
            href="#book"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-blue-700"
          >
            Book Your 15-Minute Flash Audit <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Radar className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              PriceRadar<span className="text-blue-600">API</span>
            </span>
          </a>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#audit" className="hover:text-slate-900">The Audit</a>
            <a href="#solutions" className="hover:text-slate-900">Solutions</a>
            <a href="#framework" className="hover:text-slate-900">How It Works</a>
            <a href="#book" className="hover:text-slate-900">Book</a>
          </nav>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} PriceRadarAPI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
