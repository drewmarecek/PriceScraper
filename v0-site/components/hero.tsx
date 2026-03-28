import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="pointer-events-none absolute inset-0 terminal-grid opacity-[0.45]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" aria-hidden />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-primary/90">
          B2B · Independent self-storage
        </p>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-[3.15rem] lg:leading-[1.12]">
          Never get{" "}
          <span className="text-glow-cyan text-primary">blind-sided</span> by a weekend flash sale again.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          National algorithms change prices constantly to steal your move-ins. PriceRadarAPI monitors their
          rates 24/7 so local operators can defend their occupancy.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-primary font-medium text-primary-foreground shadow-[0_0_24px_-4px_oklch(0.78_0.14_195_/_0.5)] hover:bg-primary/90"
            >
              Start 14-day trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#radar-story">
            <Button
              variant="outline"
              size="lg"
              className="border-border/80 bg-card/40 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            >
              See the radar
            </Button>
          </a>
        </div>
        <p className="mt-5 font-mono text-[11px] text-muted-foreground/80">
          No card required · Cancel anytime
        </p>
      </div>
    </section>
  )
}
