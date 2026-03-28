import { Activity } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-black/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" strokeWidth={2} />
          <span className="font-mono text-xs font-semibold tracking-tight text-foreground">
            PriceRadarAPI
          </span>
        </div>
        <nav className="flex gap-8">
          <a
            href="#pricing"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            Pricing
          </a>
          <Link
            href="/contact"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            Contact
          </Link>
        </nav>
        <p className="font-mono text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} PriceRadarAPI
        </p>
      </div>
    </footer>
  )
}
