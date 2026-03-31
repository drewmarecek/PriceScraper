import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="px-6 pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl lg:text-[3.15rem] lg:leading-[1.12]">
          Never get <span className="text-primary">blind-sided</span> by a weekend flash sale again.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          National algorithms change prices constantly to steal your move-ins. PriceRadarAPI monitors their
          rates 24/7 so local operators can defend their occupancy.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/contact">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start 14-day trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#radar-story">
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
              See the radar
            </Button>
          </a>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">No credit card required · Cancel anytime</p>
      </div>
    </section>
  )
}
