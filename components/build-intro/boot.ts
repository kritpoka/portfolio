import { buildIntro } from "./config";

/** On <html> from first paint until the intro takes over (or the failsafe fires). */
export const PENDING_CLASS = "build-pending";

declare global {
  interface Window {
    __buildIntroFailsafe?: number;
  }
}

/**
 * Hides the build targets before first paint, on a first visit to "/" only.
 * - No JS: never runs, so the page shows normally.
 * - Reduced motion, a stored flag, or blocked storage: does nothing.
 * - JS slow or broken: the failsafe removes the class and the page shows.
 * The CSS is injected here so other visitors and pages get none of it.
 */
const css = [
  `html.${PENDING_CLASS} [data-build]{opacity:0}`,
  // Pause the page's own CSS load reveal so the two don't animate together.
  `html.${PENDING_CLASS} [data-reveal]{animation:none}`,
  `html.${PENDING_CLASS} [data-build-tour]{display:none}`,
].join("");

export const buildIntroBootScript = buildIntro.enabled
  ? `(function(){try{if(location.pathname!=="/")return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(localStorage.getItem(${JSON.stringify(buildIntro.storageKey)}))return;var d=document.documentElement,s=document.createElement("style");s.textContent=${JSON.stringify(css)};document.head.appendChild(s);d.classList.add(${JSON.stringify(PENDING_CLASS)});window.__buildIntroFailsafe=setTimeout(function(){d.classList.remove(${JSON.stringify(PENDING_CLASS)})},${buildIntro.failsafeMs})}catch(e){}})()`
  : "";

export function markIntroSeen() {
  try {
    localStorage.setItem(buildIntro.storageKey, "1");
  } catch {
    // Blocked storage: the boot script can't read it either, so nothing autoplays.
  }
}
