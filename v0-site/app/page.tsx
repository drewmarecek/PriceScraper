import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Dashboard } from "@/components/dashboard"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Dashboard />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}
