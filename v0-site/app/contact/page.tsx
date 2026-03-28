"use client"

import { useState } from "react"
import { Activity, ArrowLeft, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      await fetch("https://formsubmit.co/ajax/drewmarecek@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Request Access</h1>
            <p className="text-sm text-muted-foreground">PriceRadarAPI — Early access</p>
          </div>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Request received!</h2>
            <p className="mt-2 text-muted-foreground">
              Thanks for your interest in PriceRadarAPI. I&apos;ll get back to you within 24 hours
              with setup details for your market.
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-6">
                Back to Home
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="mb-6 text-muted-foreground">
              Tell me about your facility and the competitors you want to track.
              Early access is free — no credit card required.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="hidden" name="_subject" value="PriceRadarAPI — New access request" />
              <input type="hidden" name="_captcha" value="false" />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="facility" className="mb-1.5 block text-sm font-medium text-foreground">
                    Facility Name
                  </label>
                  <Input
                    id="facility"
                    name="facility"
                    placeholder="e.g. Acme Self Storage"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label htmlFor="market" className="mb-1.5 block text-sm font-medium text-foreground">
                    Market / City
                  </label>
                  <Input
                    id="market"
                    name="market"
                    placeholder="e.g. Austin, TX"
                    className="bg-background"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                  Which competitors do you want to track?
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="List the competitor facilities or brands you'd like us to monitor (e.g. CubeSmart on Main St, the U-Haul on Highway 9, etc.)"
                  className="bg-background"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {sending ? "Sending..." : "Request Access"}
                {!sending && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
