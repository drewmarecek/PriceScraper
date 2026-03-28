import { Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-[oklch(0.07_0.01_250_/_0.85)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" strokeWidth={2} />
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            PriceRadar<span className="text-primary">API</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#radar-story"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            Radar
          </a>
          <a
            href="#features"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            Signals
          </a>
          <a
            href="#pricing"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            Pricing
          </a>
          <Link
            href="/contact"
            className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </nav>
        <Link href="/contact">
          <Button
            size="sm"
            className="bg-primary font-mono text-[11px] uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
          >
            Trial
          </Button>
        </Link>
      </div>
    </header>
  )
}
