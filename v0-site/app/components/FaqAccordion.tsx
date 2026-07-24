"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What is an AI receptionist?",
    a: "A voice agent that answers your business calls, understands what the caller needs, and takes action — answering questions, booking appointments, routing calls, and logging the conversation.",
  },
  {
    q: "What features should I look for?",
    a: "Natural conversation, answers from your own knowledge base, appointment booking, call routing with context, lead capture, and clear analytics so you can improve over time.",
  },
  {
    q: "How do I get started?",
    a: "Share your business details, connect your calendar and tools, test the agent on common scenarios, then forward your line. Most teams are live quickly — or we can set it up for you.",
  },
  {
    q: "Does it replace my front desk?",
    a: "Most businesses use it to cover first contact, overflow, and after-hours — while staff handle complex or in-person work. Anything the agent shouldn’t handle can transfer to a person with full context.",
  },
  {
    q: "Can it book appointments and transfer calls?",
    a: "Yes. It answers from your knowledge base, books into your calendar, and routes or transfers calls to the right person when needed.",
  },
  {
    q: "How are emergencies handled?",
    a: "You set the escalation rules. When a call is urgent or asks for a person, the agent transfers immediately and passes along the context.",
  },
  {
    q: "How fast can I go live?",
    a: "Most teams go live within a few days. We can also handle setup for you if you’d rather not configure it yourself.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line rounded-[20px] border border-line bg-white">
      {FAQS.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-8"
            >
              <span className="font-display text-base text-ink sm:text-lg">
                {item.q}
              </span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-transform duration-200 ${
                  open ? "rotate-45 bg-tint" : ""
                }`}
                aria-hidden
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            {open && (
              <div className="px-6 pb-6 sm:px-8">
                <p className="max-w-3xl text-[15px] leading-[1.7] text-ink-soft">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
