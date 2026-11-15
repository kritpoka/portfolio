"use client";

import { useEffect, useState, useSyncExternalStore, type ComponentType } from "react";
import { markIntroSeen, PENDING_CLASS } from "./boot";
import { buildIntro } from "./config";
import type { StageProps } from "./Stage";

/**
 * Entry for the "live AI build" intro, mounted once on the homepage.
 * It stays tiny: GSAP and the overlay (./Stage) load only when the intro
 * actually plays, so repeat visitors download none of it until they press Tour.
 */

type StageModule = typeof import("./Stage");
let stagePromise: Promise<StageModule> | null = null;
const loadStage = () => (stagePromise ??= import("./Stage"));

// First visit: start fetching the overlay while the page hydrates.
if (typeof document !== "undefined" && document.documentElement.classList.contains(PENDING_CLASS)) {
  loadStage().catch(() => {});
}

const isPending = () => document.documentElement.classList.contains(PENDING_CLASS);
const noopSubscribe = () => () => {};
const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

export default function BuildIntro() {
  const [Stage, setStage] = useState<ComponentType<StageProps> | null>(null);
  const [playing, setPlaying] = useState(false);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  // The Tour pill steps aside once the visitor scrolls into the content.
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 160, () => false);

  // Autoplay: only when the boot script hid the page (first visit, motion allowed).
  useEffect(() => {
    if (!buildIntro.enabled || !isPending()) return;
    let cancelled = false;
    Promise.all([loadStage(), document.fonts?.ready])
      .then(([mod]) => {
        // If the failsafe already showed the page, don't hide it again.
        if (cancelled || !isPending()) return;
        markIntroSeen();
        setStage(() => mod.default);
        setPlaying(true);
      })
      .catch(() => document.documentElement.classList.remove(PENDING_CLASS));
    return () => {
      cancelled = true;
    };
  }, []);

  const tour = () => {
    loadStage()
      .then((mod) => {
        window.scrollTo({ top: 0, behavior: "instant" });
        setStage(() => mod.default);
        setPlaying(true);
      })
      .catch(() => {});
  };

  if (!buildIntro.enabled) return null;

  return (
    <>
      {mounted && !playing && (
        <button
          type="button"
          data-build-tour=""
          onClick={tour}
          aria-label="Tour: replay the build intro"
          aria-hidden={scrolled || undefined}
          tabIndex={scrolled ? -1 : undefined}
          className={
            "fixed bottom-4 left-4 z-40 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full border-0 px-3.5 font-mono text-xs leading-none font-medium shadow-card transition-[opacity,translate] duration-200 motion-reduce:transition-none max-[767px]:px-0 " +
            (scrolled ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100")
          }
          style={{ background: buildIntro.colors.bar, color: buildIntro.colors.barText }}
        >
          <span aria-hidden="true">▶</span>
          <span className="max-[767px]:hidden">Tour</span>
        </button>
      )}
      {playing && Stage && <Stage onDone={() => setPlaying(false)} />}
    </>
  );
}
