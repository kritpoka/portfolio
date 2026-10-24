import type { ReactNode } from "react";

/** Dashed chip for content still to be supplied. Every one is listed in README → Content to add. */
export function Ph({ children }: { children: ReactNode }) {
  return <span className="ph">{children}</span>;
}

const PLACEHOLDER = /^\[.*\]$/;

export function isPlaceholder(text: string) {
  return PLACEHOLDER.test(text.trim());
}

/** Renders `text`, as a placeholder chip when it is a "[…]" token. */
export function MaybePh({ text }: { text: string }) {
  return isPlaceholder(text) ? <Ph>{text}</Ph> : <>{text}</>;
}
