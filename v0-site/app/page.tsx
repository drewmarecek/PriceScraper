import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AuditBreakdown } from "@/components/audit-breakdown"
import { Solutions } from "@/components/solutions"
import { Framework } from "@/components/framework"
import { Booking } from "@/components/booking"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AuditBreakdown />
      <Solutions />
      <Framework />
      <Booking />
      <Footer />
    </main>
  )
}
