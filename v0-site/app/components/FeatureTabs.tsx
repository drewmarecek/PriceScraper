"use client";

import { useState } from "react";

const TABS = [
  {
    id: "build",
    label: "Build",
    items: [
      {
        title: "Sounds like your business",
        body: "Tune voice, tone, and language so the agent matches your brand — and greets callers in your business name.",
      },
      {
        title: "Books into your calendar",
        body: "The agent checks live availability and writes the appointment directly into your calendar during the call.",
      },
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    items: [
      {
        title: "Fast, natural conversation",
        body: "Low-latency responses and natural turn-taking keep conversations flowing — including interruptions and barge-in.",
      },
      {
        title: "Never miss a call",
        body: "The agent answers around the clock, so callers aren’t sent to voicemail when your team is busy or offline.",
      },
    ],
  },
  {
    id: "monitor",
    label: "Monitor",
    items: [
      {
        title: "Review every call",
        body: "Calls are transcribed, summarized, and tagged by outcome so you can track performance and improve the flow.",
      },
      {
        title: "Improve over time",
        body: "Spot gaps, tighten transfer rules, and refine prompts from real conversations — not a small sample.",
      },
    ],
  },
] as const;

export default function FeatureTabs() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("build");
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <div>
      <div
        className="inline-flex rounded-full border border-line bg-white p-1"
        role="tablist"
        aria-label="Feature categories"
      >
        {TABS.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(t.id)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                selected
                  ? "bg-brand-navy text-white"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="mt-10 grid gap-8 lg:grid-cols-2"
        key={tab.id}
      >
        {tab.items.map((item) => (
          <article key={item.title} className="feature-panel p-8">
            <h3 className="font-display text-xl tracking-tight text-ink sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
