import { Radar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-600/30">
            <Radar className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            PriceRadar<span className="text-blue-600">API</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#audit" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            The Audit
          </a>
          <a href="#solutions" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Solutions
          </a>
          <a href="#framework" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            How It Works
          </a>
        </nav>

        <a href="#book">
          <Button className="bg-blue-600 font-semibold text-white shadow-sm shadow-blue-600/30 transition-transform duration-200 hover:scale-[1.04] hover:bg-blue-700">
            Book Flash Audit
          </Button>
        </a>
      </div>
    </header>
  )
}
