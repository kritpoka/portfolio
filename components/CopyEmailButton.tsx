"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

type Props = {
  /** Analytics label: where on the page the button sits. */
  location: string;
  /** Where the "Copied" bubble appears. */
  toast?: "below-end" | "above-center";
  className?: string;
};

export async function copyEmail(location: string) {
  trackEvent({ name: "Email copy", location });
  try {
    await navigator.clipboard.writeText(EMAIL);
  } catch {
    // Clipboard blocked (insecure context, permissions): the address is visible next to the button.
  }
}

export default function CopyEmailButton({ location, toast = "above-center", className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = () => {
    copyEmail(location);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <span className="relative inline-flex">
      <button type="button" onClick={onClick} aria-label="Copy email address" className={className}>
        Copy
      </button>
      {copied && (
        <span
          aria-hidden="true"
          className={
            "toast absolute z-10 " +
            (toast === "below-end" ? "top-[calc(100%+8px)] right-0" : "bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2")
          }
        >
          <span className="text-accent-on-ink">✓</span>Copied
        </span>
      )}
      <span role="status" aria-live="polite" className="sr-only-live">
        {copied ? "Email address copied" : ""}
      </span>
    </span>
  );
}
