"use client";

import { PHONE_TEL } from "../config";
import { trackCall } from "../lib/track";

type CallLinkProps = {
  children: React.ReactNode;
  className?: string;
  /** Where on the page this call link lives — used for analytics attribution. */
  source: string;
};

/** Tel link that fires a retargeting-friendly analytics event when tapped. */
export default function CallLink({ children, className, source }: CallLinkProps) {
  return (
    <a
      href={`tel:${PHONE_TEL}`}
      className={className}
      onClick={() => trackCall(source)}
    >
      {children}
    </a>
  );
}
