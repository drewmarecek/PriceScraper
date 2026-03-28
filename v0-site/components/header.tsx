import { Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold text-foreground">PriceRadarAPI</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
            How It Works
          </a>
          <a href="#dashboard-demo" className="text-sm text-muted-foreground hover:text-foreground">
            Sample Dashboard
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </a>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav>
        <Link href="/contact">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Free Trial
          </Button>
        </Link>
      </div>
    </header>
  )
}
