import type { CSSProperties } from "react";

/**
 * Props for one step of the page-load reveal (see [data-reveal] in globals.css).
 * `rise` moves without fading: use it on the large hero text, which is the
 * page's Largest Contentful Paint and must be visible from the first frame.
 */
export function reveal(i: number, kind: "fade" | "rise" = "fade") {
  return { "data-reveal": kind, style: { "--i": i } as CSSProperties };
}
