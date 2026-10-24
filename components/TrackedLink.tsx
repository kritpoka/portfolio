"use client";

import type { ComponentProps } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type Props = ComponentProps<"a"> & { event: AnalyticsEvent };

/** A plain <a> that records a Vercel Analytics event when followed. */
export default function TrackedLink({ event, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(event);
        onClick?.(e);
      }}
    />
  );
}
