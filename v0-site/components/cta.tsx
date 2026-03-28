import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <div className="rounded-lg border border-border/80 bg-card/50 px-6 py-10 shadow-[inset_0_1px_0_0_oklch(0.78_0.14_195_/_0.08)]">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-primary/80">
          Next step
        </p>
        <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Put your market on the radar
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-sm text-muted-foreground md:text-base">
          Tell us your stores and the competitors you care about—we&apos;ll wire the feeds and ship your first
          alerts within 24 hours.
        </p>
        <div className="mt-8">
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-primary font-medium text-primary-foreground shadow-[0_0_24px_-4px_oklch(0.78_0.14_195_/_0.5)] hover:bg-primary/90"
            >
              Request access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
