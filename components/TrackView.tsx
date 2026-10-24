"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/** Records one event when the page mounts (e.g. a case study open). */
export default function TrackView({ event }: { event: AnalyticsEvent }) {
  const key = JSON.stringify(event);
  useEffect(() => {
    trackEvent(JSON.parse(key));
  }, [key]);
  return null;
}
