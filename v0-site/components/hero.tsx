import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="px-6 pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
          Stop Leaving Money on the Table
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Your competitors change their rates constantly. Most operators find out weeks later
          — if they find out at all. PriceRadarAPI tracks every price change in your market and
          alerts you the same day.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/contact">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start 14-Day Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
              See how it works
            </Button>
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  )
}
