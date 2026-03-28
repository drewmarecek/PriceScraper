import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-foreground md:text-3xl">
        Your competitors are already watching your prices.
      </h2>
      <p className="mt-3 text-muted-foreground">
        Start your 14-day free trial today. Set up takes less than 5 minutes —
        just tell us your address and we handle the rest.
      </p>
      <div className="mt-6">
        <Link href="/contact">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
