"use client";

import { useState } from "react";
import CtaButton from "./CtaButton";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <a
          href="#"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="PriceRadarAPI home"
        >
          <span
            role="img"
            aria-label="PriceRadar API"
            className="block h-10 w-10 rounded-[12px] bg-brand-navy bg-cover ring-1 ring-line transition-transform duration-200 group-hover:scale-[1.03] sm:h-11 sm:w-11"
            style={{
              backgroundImage: "url(/logo.png)",
              backgroundSize: "205%",
              backgroundPosition: "50% 48%",
            }}
          />
          <span className="hidden leading-none sm:block">
            <span className="font-display text-[15px] tracking-[-0.02em] text-ink">
              PriceRadar
              <span className="text-brand-blue">API</span>
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors duration-200 hover:bg-tint hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <CtaButton
            source="header_contact"
            variant="ghost"
            showArrow={false}
            className="px-3 py-2 shadow-none hover:translate-y-0"
          >
            Contact Sales
          </CtaButton>
          <CtaButton source="header" className="ml-1 px-5 py-2.5">
            Try For Free
          </CtaButton>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink"
              >
                {link.label}
              </a>
            ))}
            <CtaButton
              source="header_contact_mobile"
              variant="secondary"
              showArrow={false}
              className="mt-2 w-full"
            >
              Contact Sales
            </CtaButton>
            <CtaButton source="header_mobile" className="w-full">
              Try For Free
            </CtaButton>
          </div>
        </div>
      )}
    </header>
  );
}
