import { track } from "@vercel/analytics";

// Custom Vercel Analytics events. Keep names stable: they are the keys in the dashboard.
export type AnalyticsEvent =
  | { name: "Resume click"; location: string }
  | { name: "Email copy"; location: string }
  | { name: "Email click"; location: string }
  | { name: "Case study open"; slug: string };

export function trackEvent({ name, ...props }: AnalyticsEvent) {
  try {
    track(name, props);
  } catch {
    // Analytics must never break an interaction.
  }
}
