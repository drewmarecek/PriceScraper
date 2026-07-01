import { ScanLine, ClipboardCheck, Wrench } from "lucide-react"

const steps = [
  {
    num: "01",
    title: "Automated Scan",
    description:
      "We pull your complete digital footprint and compile a health report — listings, reputation, SEO, site performance, and tracking gaps, all scored.",
    icon: ScanLine,
  },
  {
    num: "02",
    title: "Strategic Audit Review",
    description:
      "On a brief call, we walk you through your specific score gaps and show you exactly where revenue is leaking to local competitors.",
    icon: ClipboardCheck,
  },
  {
    num: "03",
    title: "Complete Done-For-You Setup",
    description:
      "Our team handles 100% of the backend: migration, widgets, AI integrations, directory sync, and tracking pixels. You approve — we deploy.",
    icon: Wrench,
  },
]

export function Framework() {
  return (
    <section id="framework" className="border-y border-slate-200 bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
            The Framework
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Zero tech friction. We do the entire build.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Three steps from a leaking presence to a fully automated growth engine.
          </p>
        </div>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* connecting line on desktop */}
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-slate-200 md:block" />

          {steps.map((s) => (
            <div
              key={s.num}
              className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                  <s.icon className="h-7 w-7" />
                </span>
                <span className="text-4xl font-black text-slate-100">{s.num}</span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-slate-900">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
