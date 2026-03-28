import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-foreground md:text-3xl">Put your market on the radar</h2>
      <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
        Tell us your stores and the competitors you care about—we&apos;ll wire the feeds and ship your first
        alerts within 24 hours.
      </p>
      <div className="mt-6">
        <Link href="/contact">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Request access
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
