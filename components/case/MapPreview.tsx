"use client";

import { useState, useSyncExternalStore } from "react";
import MediaSlot, { type Media } from "@/components/MediaSlot";
import { reveal } from "@/components/reveal";
import { LINKS } from "@/lib/site";

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const mq = matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * KU Campus Map hero. A static poster first; the live 3D map (and its
 * three.js bundle) only loads in an iframe after an explicit click.
 */
export default function MapPreview({ poster, skipTo = "#tldr" }: { poster?: Media; skipTo?: string }) {
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeRM, () => matchMedia(RM).matches, () => false);

  return (
    <figure {...reveal(5)} className="relative mx-auto mt-0 mb-6 max-w-[1040px] px-6">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="relative aspect-video">
          {loaded ? (
            <iframe
              src={LINKS.kuMap}
              title="KU Campus Map — interactive 3D preview"
              allow="fullscreen"
              className="absolute inset-0 h-full w-full border-0 bg-surface"
            />
          ) : (
            <MediaSlot
              media={poster}
              placeholder="[POSTER] Static render of the 3D campus"
              sizes="(min-width: 1040px) 992px, 100vw"
              priority
            />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line bg-raise py-3.5 pr-4 pl-5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[15px] font-medium">
              {loaded ? "Live map — drag to orbit, tap a landmark" : "Interactive 3D preview"}
            </span>
            <span className="font-mono text-xs leading-normal text-muted">
              {loaded ? "Loaded from ku-map-beta.vercel.app" : "Nothing loads until you click · loads ku-map-beta.vercel.app"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {loaded ? (
              <button
                type="button"
                onClick={() => setLoaded(false)}
                className="btn px-4 font-mono text-[13px] leading-none font-medium"
              >
                Unload map
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-0 bg-ink px-4 font-sans text-sm leading-none font-medium text-paper"
              >
                Load interactive map <span className="font-mono text-[11px] leading-none opacity-75">3D</span>
              </button>
            )}
            <a href={skipTo} className="btn font-mono text-[13px] leading-none font-medium">
              Skip ↓
            </a>
          </div>
        </div>
      </div>
      {reducedMotion && (
        <figcaption className="mt-3 font-mono text-xs leading-normal text-muted">
          Reduced motion is on — the poster stays static and nothing auto-rotates. The map only loads if you ask.
        </figcaption>
      )}
    </figure>
  );
}
