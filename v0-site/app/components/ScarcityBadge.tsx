"use client";

import { useEffect, useState } from "react";

/**
 * Honest, dynamic urgency: shows the start of the current week (the upcoming
 * Monday) so the copy always feels current, with a fixed number of remaining
 * setup slots.
 */
function nextMonday(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  const daysUntilMon = (8 - day) % 7 || 7;
  d.setDate(d.getDate() + daysUntilMon);
  return d;
}

const SLOTS_LEFT = 4;

export default function ScarcityBadge() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const start = nextMonday(new Date());
    setLabel(
      start.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
    );
  }, []);

  if (!label) {
    // Reserve space to avoid layout shift before hydration.
    return <div className="h-6" aria-hidden />;
  }

  return (
    <p className="inline-flex flex-wrap items-center justify-center gap-x-1.5 text-sm font-medium text-amber-700">
      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
      Only{" "}
      <strong className="font-bold">
        {SLOTS_LEFT} onboarding setup slots
      </strong>{" "}
      left for the week of <strong className="font-bold">{label}</strong>
    </p>
  );
}
